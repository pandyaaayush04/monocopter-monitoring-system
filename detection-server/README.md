# Detection Server

Runs the trained YOLOv8n human-detection model (`models/best.pt`, trained on DsDPM-66 coal_miner — see `SIH2026_MineRescue/` for the full training project) against a camera or video source and serves it to the dashboard. This is the "base station" side of the pipeline: it owns the camera, not the browser.

Stand-in for the monocopter's camera today — once the hardware is ready, this is the piece that gets pointed at the monocopter's video feed instead of a webcam, phone, or simulation clip. The dashboard doesn't need to change either way, it just talks to this server.

## Setup

Requires Python 3.10+. By default it loops a bundled simulation-video playlist (no camera needed to demo it) — see below for a real camera or phone.

```bash
cd detection-server
pip install -r requirements.txt
python server.py
```

Serves on `http://localhost:8000`. Leave it running — the dashboard (`monocopter-monitoring-system/`) polls it for detections and streams `/video_feed` directly. Or start both at once with `npm run dev:all` from the dashboard folder — see its README.

## Choosing a source

`CAMERA_SOURCE` accepts a webcam index, an IP-camera URL, a video file path, or a **comma-separated playlist** of video files that loops forever. Set it before starting the server:

```bash
# Windows PowerShell
$env:CAMERA_SOURCE="0"; python server.py

# bash
CAMERA_SOURCE="0" python server.py
```

Leave it unset to use the default: the two bundled simulation clips in `../monocopter-monitoring-system/public/video/` (`rgb-1.mp4,rgb-2.mp4`), looped and paced to their real frame rate. A live camera (int index) keeps its old "sleep and retry" behavior on a dropped frame; a video file advances to the next playlist entry and wraps around instead.

### Using a phone as the camera

No laptop webcam, or want a better vantage point? Install an IP-camera app on the phone, e.g. **IP Webcam** (Android) or **DroidCam**, start its stream, note the URL it gives you (IP Webcam shows something like `http://192.168.1.23:8080`; the video stream is at `/video`), then:

```bash
# Windows PowerShell
$env:CAMERA_SOURCE="http://192.168.1.23:8080/video"; python server.py

# bash
CAMERA_SOURCE="http://192.168.1.23:8080/video" python server.py
```

Phone and the machine running the server must be on the same Wi-Fi network.

## Endpoints

| Endpoint | Returns |
|---|---|
| `GET /video_feed` | MJPEG stream, bounding boxes already drawn in |
| `GET /api/detection/current` | Latest detection as JSON (`label`, `confidence`, `box`, `time`, `sector`) |
| `GET /api/detection/history` | Last 6 sampled detections |
| `GET /api/snapshot` | Single current frame as a JPEG (used by the dashboard's Snapshot button) |
| `GET /health` | `{ model_loaded, camera_open }` — check this first if the dashboard shows "detection service offline" |

## Model Architecture & Training Strategy

The full training project lives in `SIH2026_MineRescue/`; this is what's actually deployed as `models/best.pt`.

### Architecture

| | |
|---|---|
| **Base model** | YOLOv8n (Ultralytics), pretrained on COCO, fine-tuned from scratch on our data |
| **Parameters** | 3.01M — nano variant, chosen for real-time CPU/low-end-GPU inference on a base station |
| **Classes** | 1 (`coal_miner`) — a single-class detector, not a generic "person" class |
| **Inference config** | `conf=0.40`, `imgsz=640` (this server's defaults, matching `inference/live_camera.py`) |

### Dataset

Fine-tuned on **DsDPM-66**, an open dataset of underground coal-mine footage: [figshare link](https://figshare.com/articles/dataset/_b_An_Open_Paradigm_Dataset_for_Intelligent_Monitoring_of_Underground_Drilling_Scenarios_in_Coal_Mines_b_/26135107/1). Only the `coal_miner` subset was used, re-labeled for single-class person detection.

- **66 video sequences**, 15,606 total frames
- **12,439 train / 3,167 val**

### Training strategy: sequence-grouped split (not a naive random split)

The dataset is frames sampled from 66 videos, so consecutive frames from the same video are near-duplicates. A random frame-level split puts near-identical frames on both sides of train/val — the model partly memorizes rather than generalizes, and validation metrics look better than they should.

We verified this directly: the naive per-frame split (`datasets/DsDPM66/yolo/coal_miner/`) has **all 66 video sequences present in both train and val**. The deployed model instead trains on `coal_miner_grouped/`, split **by video sequence** — 54 sequences to train, 12 to val, **zero sequence overlap**. Validation is on footage the model has never seen any frame of, not just any exact frame of.

### Hyperparameters (`runs/coal_miner_yolov8n_50ep_grouped/args.yaml`)

| | |
|---|---|
| Epochs / batch / image size | 50 / 8 / 640 |
| Optimizer | auto (Ultralytics-selected), lr0 0.01, lrf 0.01, momentum 0.937, weight decay 5e-4 |
| Warmup | 3 epochs |
| Loss weights | box 7.5 · cls 0.5 · dfl 1.5 (CIoU + BCE + distribution focal loss) |
| Augmentation | mosaic 1.0 (disabled for the last 10 epochs), HSV jitter, translate 0.1, scale 0.5, horizontal flip 0.5, random erasing 0.4, RandAugment |
| Deliberately off | vertical flip, rotation, perspective warp — a mine tunnel has a fixed up/down, faking those would teach the model orientations it will never see |
| Precision | AMP (mixed precision) |
| Compute | Local GPU (no notebook — trained via the Ultralytics CLI; `args.yaml` is the training script's own record of the run) |
| Training time | 3h 30m (12,582s wall-clock for all 50 epochs) |

### Results (final epoch, on the held-out unseen-sequence validation set)

| Metric | Value |
|---|---|
| Precision | 0.908 |
| Recall | 0.892 |
| mAP50 | 0.942 |
| mAP50-95 | 0.751 |
| Final box / cls / dfl loss | 0.397 / 0.199 / 0.832 |

## Notes

- `sector` is a static placeholder ("Sector B") — there's no positioning system yet, same as it was in the dashboard's old mock data.
- CORS is wide open (`allow_origins=["*"]`) for local dev convenience. Tighten before this runs anywhere beyond a laptop demo.
- If no camera or video source is available, or a phone stream drops, the server still starts and stays up — `/health` reports `camera_open: false` and detections stay empty rather than crashing.
