"""Train a three-class tomato leaf classifier from PlantVillage images.

Run from backend/: python train_model.py
"""
from pathlib import Path

import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

from model import CLASS_NAMES, IMAGE_SIZE, MODEL_PATH

BASE_DIR = Path(__file__).resolve().parent
DATASET_DIR = BASE_DIR / "dataset"
BATCH_SIZE = 32
EPOCHS = 10
SEED = 42

# These directory names are in the SAME ORDER as CLASS_NAMES in model.py.
CLASS_FOLDERS = [
    "Tomato___healthy",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
]


def main():
    missing = [name for name in CLASS_FOLDERS if not (DATASET_DIR / name).is_dir()]
    if missing:
        raise SystemExit(
            f"Missing dataset folders in {DATASET_DIR}: {', '.join(missing)}\n"
            "Read README.md for dataset download instructions."
        )

    train_ds, val_ds = tf.keras.utils.image_dataset_from_directory(
        DATASET_DIR,
        labels="inferred",
        label_mode="categorical",
        class_names=CLASS_FOLDERS,
        validation_split=0.2,
        subset="both",
        seed=SEED,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
    )

    augment = tf.keras.Sequential([
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.08),
        layers.RandomZoom(0.1),
    ])

    train_ds = train_ds.map(
        lambda images, labels: (preprocess_input(augment(images, training=True)), labels),
        num_parallel_calls=tf.data.AUTOTUNE,
    ).prefetch(tf.data.AUTOTUNE)
    val_ds = val_ds.map(
        lambda images, labels: (preprocess_input(images), labels),
        num_parallel_calls=tf.data.AUTOTUNE,
    ).prefetch(tf.data.AUTOTUNE)

    base = MobileNetV2(
        input_shape=(*IMAGE_SIZE, 3),
        include_top=False,
        weights="imagenet",
    )
    base.trainable = False

    inputs = tf.keras.Input(shape=(*IMAGE_SIZE, 3))
    x = base(inputs, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(len(CLASS_NAMES), activation="softmax")(x)
    model = tf.keras.Model(inputs, outputs)

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS,
        callbacks=[tf.keras.callbacks.EarlyStopping(
            monitor="val_loss", patience=3, restore_best_weights=True
        )],
    )

    loss, accuracy = model.evaluate(val_ds, verbose=0)
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    model.save(MODEL_PATH)
    print(f"Validation accuracy: {accuracy * 100:.1f}%")
    print(f"Saved model to: {MODEL_PATH}")
    print("IMPORTANT: This validation score is not a real-world field accuracy guarantee.")
    print("Restart FastAPI to load the new model.")


if __name__ == "__main__":
    main()
