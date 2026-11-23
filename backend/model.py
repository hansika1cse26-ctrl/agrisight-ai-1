"""MobileNetV2 inference. Missing model => honest demonstration mode."""
from functools import lru_cache
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "tomato_mobilenetv2.keras"
IMAGE_SIZE = (224, 224)

# Exact order also used in train_model.py. Never sort these labels.
CLASS_NAMES = ["Healthy", "Early Blight", "Late Blight"]


@lru_cache(maxsize=1)
def load_trained_model():
    if not MODEL_PATH.is_file():
        return None
    # Import TensorFlow only when a saved model is present.
    from tensorflow.keras.models import load_model

    trained = load_model(MODEL_PATH, compile=False)
    if trained.output_shape[-1] != len(CLASS_NAMES):
        raise ValueError("The saved model must have exactly 3 output classes.")
    return trained


def model_status():
    if not MODEL_PATH.is_file():
        return {
            "mode": "demo",
            "message": "No trained model found. Uploads work, but no AI diagnosis is made.",
        }
    try:
        load_trained_model()
        return {"mode": "ai", "message": "Trained MobileNetV2 model is ready."}
    except Exception:
        return {
            "mode": "demo",
            "message": "The model could not be loaded. Check your training output and restart the backend.",
        }


def classify_image(pil_image):
    """Return the result, or None if the model is missing/unloadable."""
    if model_status()["mode"] != "ai":
        return None

    import numpy as np
    from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

    resized = pil_image.resize(IMAGE_SIZE)
    pixels = np.asarray(resized, dtype=np.float32)
    batch = preprocess_input(np.expand_dims(pixels, axis=0))
    probabilities = load_trained_model().predict(batch, verbose=0)[0]
    index = int(np.argmax(probabilities))
    return {
        "disease": CLASS_NAMES[index],
        "confidence": round(float(probabilities[index]) * 100, 2),
    }
