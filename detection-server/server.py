"""
Human detection server for the Mine Rescue dashboard.

Owns the webcam (stand-in for the monocopter's camera feed until the
hardware is ready), runs the trained YOLOv8n model on every frame, and
serves:
  - GET /video_feed              MJPEG stream, boxes already burned in
  - GET /api/detection/current   latest detection as JSON
  - GET /api/detection/history   last N detection samples
  - GET /health                  model/camera status

Run: python server.py  (see README.md for setup)
"""

import os
import threading
import time
from collections import deque
from contextlib import asynccontextmanager
from datetime import datetime
from itertools import count

import cv2
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Response
from fastapi.responses import JSONResponse, StreamingResponse
from ultralytics import YOLO

MODEL_PATH = "models/best.pt"

# Webcam by default (0 = first camera). Point this at a phone instead by
# setting CAMERA_SOURCE to the phone's stream URL, e.g. with the "IP Webcam"
# Android app: CAMERA_SOURCE="http://192.168.1.23:8080/video" (or DroidCam,
# similar idea). cv2.VideoCapture accepts either an int index or a URL string.
_camera_env = os.environ.get("CAMERA_SOURCE", "0")
CAMERA_INDEX: int | str = int(_camera_env) if _camera_env.isdigit() else _camera_env
CONF_THRESHOLD = 0.40
IMG_SIZE = 640
SECTOR = "Sector B"  # no positioning system yet; static placeholder, same as the UI mock it replaces
HISTORY_SAMPLE_SECONDS = 3
HISTORY_MAX = 6

state_lock = threading.Lock()
state = {
    "camera_open": False,
    "frame_jpeg": None,
    "current": {
        "id": "d0",
        "time": "--:--:--",
        "label": "No Person",
        "confidence": None,
        "sector": SECTOR,
        "box": None,  # {x, y, w, h} in percent of frame, top-left origin
    },
    "history": deque(maxlen=HISTORY_MAX),
}
_ids = count(1)


def run_capture_loop():
    model = YOLO(MODEL_PATH)
    cap = cv2.VideoCapture(CAMERA_INDEX)

    with state_lock:
        state["camera_open"] = cap.isOpened()

    if not cap.isOpened():
        print(f"Could not open camera index {CAMERA_INDEX}. /video_feed and detections will stay empty.")
        return

    last_sample = 0.0

    while True:
        ok, frame = cap.read()
        if not ok:
            time.sleep(0.5)
            continue

        results = model.predict(source=frame, conf=CONF_THRESHOLD, imgsz=IMG_SIZE, verbose=False)
        annotated = results[0].plot()
        ok_encode, buf = cv2.imencode(".jpg", annotated)

        boxes = results[0].boxes
        now = datetime.now().strftime("%H:%M:%S")

        if boxes is not None and len(boxes) > 0:
            best_idx = boxes.conf.argmax().item()
            conf = float(boxes.conf[best_idx])
            x1, y1, x2, y2 = boxes.xyxyn[best_idx].tolist()
            detection = {
                "time": now,
                "label": "Person Detected",
                "confidence": round(conf, 2),
                "sector": SECTOR,
                "box": {
                    "x": round(x1 * 100, 1),
                    "y": round(y1 * 100, 1),
                    "w": round((x2 - x1) * 100, 1),
                    "h": round((y2 - y1) * 100, 1),
                },
                "objectsDetected": len(boxes),
            }
        else:
            detection = {
                "time": now,
                "label": "No Person",
                "confidence": None,
                "sector": SECTOR,
                "box": None,
                "objectsDetected": 0,
            }

        with state_lock:
            if ok_encode:
                state["frame_jpeg"] = buf.tobytes()
            state["current"] = {"id": f"d{next(_ids)}", **detection}

            elapsed = time.monotonic()
            if elapsed - last_sample >= HISTORY_SAMPLE_SECONDS:
                last_sample = elapsed
                state["history"].appendleft({"id": f"h{next(_ids)}", **detection})


@asynccontextmanager
async def lifespan(app: FastAPI):
    thread = threading.Thread(target=run_capture_loop, daemon=True)
    thread.start()
    yield


app = FastAPI(lifespan=lifespan)

# Dev-only: dashboard runs on a Vite dev port, origin varies. Tighten this
# to the deployed dashboard origin before this ever leaves a laptop demo.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    with state_lock:
        return {"model_loaded": True, "camera_open": state["camera_open"]}


@app.get("/api/detection/current")
def current_detection():
    with state_lock:
        return JSONResponse(state["current"])


@app.get("/api/detection/history")
def detection_history():
    with state_lock:
        return JSONResponse(list(state["history"]))


@app.get("/api/snapshot")
def snapshot():
    with state_lock:
        frame = state["frame_jpeg"]
    if frame is None:
        return JSONResponse({"error": "no frame available yet"}, status_code=503)
    return Response(content=frame, media_type="image/jpeg")


def mjpeg_generator():
    boundary = b"--frame"
    while True:
        with state_lock:
            frame = state["frame_jpeg"]
        if frame is not None:
            yield boundary + b"\r\nContent-Type: image/jpeg\r\n\r\n" + frame + b"\r\n"
        time.sleep(0.05)


@app.get("/video_feed")
def video_feed():
    return StreamingResponse(mjpeg_generator(), media_type="multipart/x-mixed-replace; boundary=frame")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
