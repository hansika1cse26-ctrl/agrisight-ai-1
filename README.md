# AgriSightAI 🌿

A beginner-friendly tomato leaf disease screening application built with React, Vite, FastAPI, MobileNetV2, and SQLite.

## What works

1. **Upload:** Select or drag-and-drop JPG/JPEG/PNG images up to 8 MB, then preview them.
2. **Results:** With a trained model, classify a tomato leaf as **Healthy**, **Early Blight**, or **Late Blight**, and show confidence and simple crop-care guidance.
3. **History:** Save scans, images, dates, predictions, and confidence in local SQLite. View and delete records.

**Important:** A trained `.keras` model is NOT included. Before training, the application runs in explicitly labelled **Demonstration mode**. Uploads, image previews, saved results and history still work, but no AI disease prediction or confidence score is fabricated.

## Folder layout

```text
agrisight-ai/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── public/favicon.svg
│   └── src/
│       ├── api.js
│       ├── App.jsx
│       ├── App.css
│       ├── main.jsx
│       ├── guidance.js
│       ├── assets/leaf-illustration.svg
│       ├── components/Icon.jsx
│       ├── components/Navbar.jsx
│       ├── components/ScanCard.jsx
│       └── pages/
│           ├── Home.jsx
│           ├── Detect.jsx
│           ├── Results.jsx
│           └── History.jsx
├── backend/
│   ├── main.py
│   ├── model.py
│   ├── database.py
│   ├── train_model.py
│   ├── requirements.txt
│   ├── models/             # saved model goes here
│   ├── uploads/            # images are saved here
│   └── dataset/            # download these images yourself
└── README.md
```

## 1. Required software

Install:
- **Visual Studio Code** (suggested extensions: *Python* and *Pylance* by Microsoft)
- **Python 3.11, 64-bit** from https://www.python.org/downloads/ (on Windows, check **Add Python to PATH**)
- **Node.js 22 LTS** (version **22.12+**) from https://nodejs.org/
- A browser such as Chrome or Edge

In a terminal check:

```bash
python --version
node --version
npm --version
```

On Windows you can use `py -3.11 --version` if `python` points to another installation.

## 2. Run the backend in VS Code (Terminal 1)

Open the entire `agrisight-ai` folder with VS Code (**File > Open Folder**).

**Windows (PowerShell):**

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

**macOS / Linux:**

```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

TensorFlow is a large dependency and may need an internet connection and enough disk space. On Windows, if PowerShell blocks activation, use Command Prompt and run `.venv\Scripts\activate.bat` instead.

Open **http://127.0.0.1:8000/docs** to see and test the API. If you haven't trained a model, **http://127.0.0.1:8000/status** should say `"mode": "demo"`.

## 3. Run the frontend (Terminal 2)

Click **Terminal > New Terminal** to open a second terminal while leaving Terminal 1 running.

From the root folder `agrisight-ai`:

```bash
cd frontend
npm install
npm run dev
```

Open **http://127.0.0.1:5173** in your browser.

You should see the dashboard and a demonstration-mode notification. Navigate to **Detect Disease**, upload an image, click **Analyze Crop**, and verify that the scan appears in **Scan History**. You can view and delete it.

## 4. Train the AI model using PlantVillage

**Dataset source:** https://github.com/spMohanty/PlantVillage-Dataset

1. Open that URL. Choose **Code > Download ZIP** and unzip it. The repository download is large.
2. Open the extracted `PlantVillage-Dataset-master/raw/color/` folder.
3. Copy **only** the following three folders (including their images) into `agrisight-ai/backend/dataset/`:

```text
backend/dataset/
├── Tomato___healthy/
│   ├── (many .jpg images)
├── Tomato___Early_blight/
│   ├── (many .jpg images)
└── Tomato___Late_blight/
    ├── (many .jpg images)
```

**The folder spelling, underscores, and letter case must match exactly.** Do not add another nested `color/` folder inside `backend/dataset/`. Use colour (`raw/color`) images, not grayscale or segmented images.

4. In **Terminal 1**, stop the server using `Ctrl+C`. Make sure the virtual environment is active and your current folder is `backend`.
5. Train and save the model:

```bash
python train_model.py
```

The script uses ImageNet-pretrained **MobileNetV2**, a 224×224 pixel input, image augmentation, a three-class softmax output, an 80%/20% image split, and early stopping. Its first execution may download the ImageNet weights. Training will save:

```text
backend/models/tomato_mobilenetv2.keras
```

6. Restart the server:

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

7. Open **http://127.0.0.1:8000/status**. It should now say `"mode": "ai"`. Refresh the frontend. New uploads will use the trained model. **Older demo scans remain clearly marked as demo** and are not retroactively reclassified.

**Training cautions:** PlantVillage photos often have clean, controlled backgrounds. A high validation accuracy on this dataset does not mean equal accuracy on real farm photos. The script uses a simple image-level validation split for learning; repeated images or images of the same leaf can make such scores optimistic. For serious use, evaluate on a separate leaf-grouped and real-field test set. A classifier restricted to three labels will still output one of those labels for other diseases or non-tomato leaves, so only use it as an educational screening aid.

## 5. API reference

| Method | URL | What it does |
| --- | --- | --- |
| `GET` | `/status` | AI model or demonstration mode |
| `POST` | `/predict` | Upload a form field named `file`; validate, analyze if trained, then save |
| `GET` | `/history` | Newest saved scans first |
| `GET` | `/history/{id}` | One scan, including image URL |
| `DELETE` | `/history/{id}` | Remove the record and image |
| `GET` | `/uploads/{filename}` | Display the saved image |

Example AI scan response (values below illustrate the JSON structure, **not a real prediction**):

```json
{
  "id": 7,
  "filename": "some-generated-id.jpg",
  "disease": "Early Blight",
  "confidence": 87.5,
  "mode": "ai",
  "created_at": "2026-11-23T12:00:00+00:00",
  "image_url": "/uploads/some-generated-id.jpg"
}
```

In demo mode, `"disease": null` and `"confidence": null`. Files and the SQLite database (`backend/agrisight.db`) are kept on your own computer. They are created automatically; you don't need to install SQLite separately.

## 6. Troubleshooting

| Problem | Fix |
| --- | --- |
| `Cannot connect to the backend` | Make sure Terminal 1 is running FastAPI on `127.0.0.1:8000`. |
| `python-multipart` error | Activate the backend `.venv` and run `pip install -r requirements.txt`. |
| TensorFlow installation fails | Use 64-bit Python **3.11**, upgrade pip, and verify you have enough disk space. |
| `npm` not recognized | Install Node.js and reopen VS Code. |
| `/status` still says demo | Confirm the `.keras` filename and location; inspect the backend terminal and restart FastAPI. |
| `Could not import module "main"` | Run `uvicorn` **from the `backend` folder**. |
| React page is blank | Inspect the browser developer console and confirm `npm install` succeeded. |
| `Address already in use` | Stop any other application using ports 5173 or 8000. |

## 7. Exhibition demonstration order

1. Show the **dashboard** and the three feature cards.
2. Show **drag-and-drop**, file validation, and the leaf preview.
3. If a trained model is present, analyze a clear tomato leaf and explain that model confidence is not a diagnosis guarantee.
4. Explain the **disease guidance** and farmer-friendly prevention tips.
5. Open **Scan History**, view a saved scan, and delete one.
6. Show **`/docs`** in FastAPI and **`backend/agrisight.db`** in the VS Code file explorer.

If you have not finished training, say that the project is in **demonstration mode**; do not claim AI detection works until `/status` reports `ai` and a trained model produces a result.

## 8. Reading and sources

- [PlantVillage repository and dataset information](https://github.com/spMohanty/PlantVillage-Dataset)
- [TensorFlow pip installation guide](https://www.tensorflow.org/install/pip)
- [Vite setup and Node requirements](https://vite.dev/guide/)
- [Early blight guidance, University of Maryland Extension](https://extension.umd.edu/resource/early-blight-tomatoes)
- [Late blight guidance, University of Maryland Extension](https://extension.umd.edu/resource/late-blight-tomato-and-potato)

The disease care information is educational. Local agricultural extension workers should confirm diagnoses and recommend locally approved treatments.
