# Detection Server

Runs the trained YOLOv8n human-detection model (`models/best.pt`, trained on DsDPM-66 coal_miner — see `SIH2026_MineRescue/` for training details) against a live camera and serves it to the dashboard. This is the "base station" side of the pipeline described in the project docs: it owns the camera, not the browser.

Stand-in for the monocopter's camera today — once the hardware is ready, this is the piece that gets pointed at the monocopter's video feed instead of a laptop webcam or phone. The dashboard doesn't need to change either way, it just talks to this server.

## Setup

Requires Python 3.10+ and a camera (laptop webcam by default, or a phone — see below).

```bash
cd detection-server
pip install -r requirements.txt
python server.py
```

Serves on `http://localhost:8000`. Leave it running — the dashboard (`monocopter-monitoring-system/`) polls it for detections and streams `/video_feed` directly. Or start both at once with `npm run dev:all` from the dashboard folder — see its README.

## Using a phone as the camera

No laptop webcam, or want a better vantage point? Point the server at a phone instead:

1. Install an IP-camera app on the phone, e.g. **IP Webcam** (Android) or **DroidCam**. Start its stream.
2. Note the URL it gives you (IP Webcam shows something like `http://192.168.1.23:8080`; the video stream is at `/video`).
3. Run the server with `CAMERA_SOURCE` set to that URL:

```bash
# Windows PowerShell
$env:CAMERA_SOURCE="http://192.168.1.23:8080/video"; python server.py

# bash
CAMERA_SOURCE="http://192.168.1.23:8080/video" python server.py
```

Phone and the machine running the server must be on the same Wi-Fi network. Leave `CAMERA_SOURCE` unset (or `"0"`) to use the default laptop webcam.

## Endpoints

| Endpoint | Returns |
|---|---|
| `GET /video_feed` | MJPEG stream, bounding boxes already drawn in |
| `GET /api/detection/current` | Latest detection as JSON (`label`, `confidence`, `box`, `time`, `sector`) |
| `GET /api/detection/history` | Last 6 sampled detections |
| `GET /api/snapshot` | Single current frame as a JPEG (used by the dashboard's Snapshot button) |
| `GET /health` | `{ model_loaded, camera_open }` — check this first if the dashboard shows "detection service offline" |

## Notes

- Confidence threshold 0.40, image size 640 — same defaults as `inference/live_camera.py` in the training project.
- `sector` is a static placeholder ("Sector B") — there's no positioning system yet, same as it was in the dashboard's old mock data.
- CORS is wide open (`allow_origins=["*"]`) for local dev convenience. Tighten before this runs anywhere beyond a laptop demo.
- If no camera is available, or a phone stream drops, the server still starts and stays up — `/health` reports `camera_open: false` and detections stay empty rather than crashing.
