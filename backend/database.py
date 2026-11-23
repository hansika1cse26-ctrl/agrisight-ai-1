"""Tiny SQLite helper functions. No external ORM is required."""
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "agrisight.db"


@contextmanager
def connection():
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    try:
        yield db
        db.commit()
    finally:
        db.close()


def initialize_database():
    with connection() as db:
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS scans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT NOT NULL,
                disease TEXT,
                confidence REAL,
                mode TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )


def add_scan(filename, disease, confidence, mode):
    timestamp = datetime.now(timezone.utc).isoformat()
    with connection() as db:
        cursor = db.execute(
            "INSERT INTO scans (filename, disease, confidence, mode, created_at) "
            "VALUES (?, ?, ?, ?, ?)",
            (filename, disease, confidence, mode, timestamp),
        )
        scan_id = cursor.lastrowid
    return get_scan(scan_id)


def _to_dict(row):
    if row is None:
        return None
    item = dict(row)
    item["image_url"] = f"/uploads/{item['filename']}"
    return item


def get_scans():
    with connection() as db:
        rows = db.execute("SELECT * FROM scans ORDER BY id DESC").fetchall()
    return [_to_dict(row) for row in rows]


def get_scan(scan_id):
    with connection() as db:
        row = db.execute("SELECT * FROM scans WHERE id = ?", (scan_id,)).fetchone()
    return _to_dict(row)


def remove_scan(scan_id):
    with connection() as db:
        row = db.execute("SELECT * FROM scans WHERE id = ?", (scan_id,)).fetchone()
        if row:
            db.execute("DELETE FROM scans WHERE id = ?", (scan_id,))
    return _to_dict(row)
