"""AgriSightAI REST API. Run: uvicorn main:app --reload"""
from contextlib import asynccontextmanager
from io import BytesIO
from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from PIL import Image, ImageOps, UnidentifiedImageError

from database import add_scan, get_scan, get_scans, initialize_database, remove_scan
from model import classify_image, model_status

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
MAX_FILE_BYTES = 8 * 1024 * 1024
MAX_PIXELS = 12_000_000
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}


@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_database()
    yield


app = FastAPI(title="AgriSightAI API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


@app.get("/status")
def status():
    return model_status()


@app.post("/predict", status_code=201)
async def predict(file: UploadFile = File(...)):
    extension = Path(file.filename or "").suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, "Only JPG, JPEG, and PNG images are supported.")

    try:
        contents = await file.read(MAX_FILE_BYTES + 1)
    finally:
        await file.close()

    if not contents:
        raise HTTPException(400, "The uploaded file is empty.")
    if len(contents) > MAX_FILE_BYTES:
        raise HTTPException(413, "The image must be 8 MB or smaller.")

    try:
        with Image.open(BytesIO(contents)) as image:
            if image.format not in {"JPEG", "PNG"}:
                raise ValueError("Unsupported image content")
            if image.width * image.height > MAX_PIXELS:
                raise HTTPException(400, "Image dimensions are too large.")
            leaf_image = ImageOps.exif_transpose(image).convert("RGB")
            leaf_image.load()
            actual_extension = ".png" if image.format == "PNG" else ".jpg"
    except HTTPException:
        raise
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError):
        raise HTTPException(400, "This is not a valid JPG or PNG image.") from None

    # If inference fails, return an error; never invent a fallback prediction.
    try:
        result = classify_image(leaf_image)
    except Exception:
        raise HTTPException(503, "AI analysis failed. Check the backend terminal and model.") from None

    filename = f"{uuid4().hex}{actual_extension}"
    filepath = UPLOAD_DIR / filename
    try:
        filepath.write_bytes(contents)
        mode = "ai" if result is not None else "demo"
        scan = add_scan(
            filename,
            result["disease"] if result else None,
            result["confidence"] if result else None,
            mode,
        )
    except Exception:
        filepath.unlink(missing_ok=True)
        raise HTTPException(500, "Could not save this scan. Please try again.") from None
    return scan


@app.get("/history")
def history():
    return get_scans()


@app.get("/history/{scan_id}")
def history_detail(scan_id: int):
    scan = get_scan(scan_id)
    if scan is None:
        raise HTTPException(404, "Scan not found.")
    return scan


@app.delete("/history/{scan_id}")
def delete_history(scan_id: int):
    scan = remove_scan(scan_id)
    if scan is None:
        raise HTTPException(404, "Scan not found.")
    (UPLOAD_DIR / scan["filename"]).unlink(missing_ok=True)
    return {"message": "Scan deleted successfully."}
