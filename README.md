# MineWatch: AI-Powered Underground Mine Safety, Monitoring and Rescue System

<div align="center">

![MineWatch](https://img.shields.io/badge/MineWatch-Underground%20Mine%20Rescue%20Dashboard-0f3d3a?style=for-the-badge)
![YOLOv8n](https://img.shields.io/badge/Model-YOLOv8n-6a4c93?style=for-the-badge)
![Monocopter](https://img.shields.io/badge/Platform-Monocopter-2e7d32?style=for-the-badge)
![SIH](https://img.shields.io/badge/Smart%20India%20Hackathon-2026-ff9933?style=for-the-badge)

**See What's Hidden. Protect What's Inside.**
*A rescue-operator console for a monocopter that goes where rescuers can't.*

</div>

---

## 🇮🇳 Smart India Hackathon 2026: Problem Statement

| | |
|---|---|
| **Problem Statement ID** | 26039 |
| **Problem Statement Title** | AI-Powered Underground Mine Safety, Monitoring and Rescue System |
| **Organization** | Government of Jharkhand |
| **Category** | Hardware |

### Description

**Dashboard Overview**
A centralized rescue-operator interface providing real-time situational awareness, alerts, mission status, and actionable information from the monocopter.

**Dashboard Sections**

- Live Camera & Human Detection
- Gas Trends
- Battery Intelligence
- Environment Insights
- Monocopter Health
- Actionable Alerts
- Mapping & Location
- Mission Status
- Thermal View & Detection
- Communication & Connectivity
- Flight Path & Mission History
- Rescue Intelligence & Recommended Actions

**Key Dashboard Highlights**

1. Battery Intelligence → Estimated flight time remaining + battery level + flight time
2. Gas Trends → See whether gas levels are rising or falling + live readings + risk status
3. Human Detection → Know where and when a person was detected + confidence level
4. Environment Insights → Understand what the sensor readings mean + risk status
5. Monocopter Health → Know if the monocopter is ready for operation + battery + signal + system status
6. Actionable Alerts → Know what happened and what to do next + severity + recommended action

**Dashboard Value Proposition**

- **See** → Live video, map & sensor data
- **Understand** → AI detections, trends & risk levels
- **Act** → Alerts, victim location & recommended actions

---

## Our Submission

| Field | Details |
|---|---|
| **Project** | **MineWatch**: See What's Hidden. Protect What's Inside. |
| **Human-Detection Model** | **YOLOv8n**, fine-tuned on the DsDPM-66 coal-miner dataset |
| **Dashboard** | React 19 + TypeScript + Vite, all 12 problem-statement modules built |
| **Team** | Tanisha Sharma (Team Leader) · Harsh Parekh · Riya Prajapati · Mahi Parmar · Aayush Pandya · Khushi Bhanushali |

---

## The Problem We Are Solving

Underground coal mine accidents (collapses, gas leaks, fires) put rescue teams at risk the moment they enter a mine whose conditions are already unknown:

- Rescuers walk into **zero visibility, unknown gas levels, and unknown structural stability** with no situational picture beforehand.
- **GPS does not work underground** — there is no reliable way to know a trapped worker's location without someone physically finding them.
- Manual search is **slow**, and every minute matters for gas exposure and injury.
- Decisions ("send a team in", "evacuate a sector") are made **without live data**, on the rescuer's judgment alone.

> **Result:** rescue response is slower and riskier than it needs to be, because the first "eyes" into a collapsed or gas-affected mine are the rescuers themselves.

---

## Solution Description

**MineWatch** is the operator-side console for a monocopter drone built to fly into a mine ahead of the rescue team, and stream back everything an operator needs to make a safe call before anyone goes in.

```
Monocopter sensors -> detection-server (YOLOv8n human detection)
                    -> MineWatch dashboard (12 live modules)
                    -> Operator sees, understands, and acts
```

Everything lives in one operator dashboard:

- **Live Camera & Human Detection:** real-time video with an actual trained model drawing boxes around people, live
- **Thermal View:** a second camera feed for low-visibility/heat-signature conditions
- **Gas, Environment, Battery, Monocopter Health:** live sensor telemetry with plain-language risk status
- **Map, Mission, History:** where the monocopter is, what it's doing, and what past missions found
- **Alerts & Rescue Intelligence:** cross-module event feed that rolls up into one recommended course of action

---

### How MineWatch Meets the Problem Statement

| Requirement (from the problem statement) | Status | How |
|---|---|---|
| Live Camera & Human Detection | ✅ Done | Real trained YOLOv8n model, live inference, bounding boxes burned into the stream |
| Thermal View & Detection | ✅ Done | Second camera view in the same panel; honest "not connected" state until a real thermal source is wired in |
| Gas Trends | ✅ Done | CH4 / CO / O2 with mine-safety thresholds and a rolled-up risk banner |
| Battery Intelligence | ✅ Done | Radial gauge, estimated flight time, 4S LiPo discharge-curve-derived voltage |
| Environment Insights | ✅ Done | Temperature + humidity with plain-language risk interpretation |
| Monocopter Health | ✅ Done | Pre-flight checklist (no GPS item — underground has none) + comms signal card |
| Actionable Alerts | ✅ Done | Live cross-module event feed, severity filter, acknowledge/dismiss |
| Mapping & Location | ✅ Done | Top-down SLAM-style map: position, flight path, waypoints, hazard zones, detected-human marker |
| Mission Status | ✅ Done | Current phase, objective checklist, real elapsed mission timer |
| Communication & Connectivity | ✅ Done | Link quality, latency, packet loss, connection-events log |
| Flight Path & Mission History | ✅ Done | Past-mission log with per-session recorded-path replay on the map |
| Rescue Intelligence & Recommended Actions | ✅ Done | Single synthesis panel combining detection + gas + alerts into one plain-language recommendation |

All 12 dashboard sections from the problem statement are built — see `monocopter-monitoring-system/MODULES.md` for the per-module detail and what each module needs from real hardware.

---

## AI Approach & Architecture

### System Architecture

```
+------------------------------------------------------------------+
|                 DASHBOARD (React 19 + Vite)                      |
|  Landing / Auth -> Operator Console (12 modules)                 |
|  Live Feed (RGB + Thermal) | Map | Gas/Env/Battery | Alerts       |
+------------------------------+-----------------------------------+
                               | HTTP + MJPEG
+------------------------------v-----------------------------------+
|              DETECTION SERVER (FastAPI + OpenCV)                 |
|                                                                  |
|  +----------------+     +------------------------------------+  |
|  | Camera / video |---->| YOLOv8n inference, every frame      |  |
|  | source(s)      |     | boxes drawn into the MJPEG stream   |  |
|  +----------------+     +------------------+-------------------+  |
|                                             |                    |
|                     /video_feed, /api/detection/current,        |
|                     /api/detection/history, /health             |
+------------------------------+-----------------------------------+
                               |
+------------------------------v-----------------------------------+
|                  AUTH SERVER (Express + SQLite)                  |
|   bcrypt password hashing | JWT httpOnly-cookie sessions         |
|   Google Sign-In (google-auth-library) | rate limiting           |
+------------------------------------------------------------------+
```

### Detection Pipeline: Step by Step

| Step | Technology | What Happens |
|---|---|---|
| 1. Capture | `cv2.VideoCapture` | Owns the camera source — laptop webcam, a phone stream, or a looping simulation-video playlist |
| 2. Detect | **YOLOv8n** (Ultralytics) | Runs on every frame at `conf=0.40`, `imgsz=640` |
| 3. Annotate | `results[0].plot()` | Bounding box + confidence burned directly into the frame server-side |
| 4. Stream | FastAPI `StreamingResponse` | MJPEG multipart stream at `/video_feed`, dashboard just points an `<img>` at it |
| 5. Report | In-memory state + lock | Latest detection and a rolling 6-sample history served as JSON for the side cards |

---

## 🧠 Model Used

MineWatch uses **one fine-tuned vision model**: a YOLOv8n object detector trained to spot a person in a mine tunnel.

### 1. YOLOv8n: Human Detection

| | |
|---|---|
| **Base model** | `yolov8n.pt` (Ultralytics) |
| **Role** | Detect a person in each camera frame, live |
| **Class** | `coal_miner` (single-class detector) |
| **Inference config** | `conf=0.40`, `imgsz=640` |
| **Training** | Local Ultralytics CLI run — 50 epochs, batch 8, imgsz 640, on a local GPU (`runs/coal_miner_yolov8n_50ep_grouped/args.yaml`). **No notebook was used** for this run. |

### 2. Dataset

Fine-tuned on the **DsDPM-66** open dataset for underground coal-mine monitoring:

> [An Open Paradigm Dataset for Intelligent Monitoring of Underground Drilling Scenarios in Coal Mines](https://figshare.com/articles/dataset/_b_An_Open_Paradigm_Dataset_for_Intelligent_Monitoring_of_Underground_Drilling_Scenarios_in_Coal_Mines_b_/26135107/1) — figshare

Only the `coal_miner` subset was used, re-labeled for single-class person detection.

### 3. Model Results

Final-epoch metrics for the deployed model (`detection-server/models/best.pt`, from `runs/coal_miner_yolov8n_50ep_grouped/`):

| Metric | Value |
|---|---|
| Precision | **0.908** |
| Recall | **0.892** |
| mAP50 | **0.942** |
| mAP50-95 | **0.751** |
| Epochs | 50 |
| Train / val box loss (final) | 0.397 / 0.718 |

---

## Features

| Feature | Description |
|---|---|
| Live human detection | Real YOLOv8n inference on every frame, not a mock |
| Honest thermal state | Second camera view; shows "not connected" rather than faking a filter over RGB |
| Mine-safety-aware thresholds | Gas, environment, battery all use real mine-safety risk bands, not generic ones |
| No fake GPS | Position is framed as inertial/SLAM-estimated — GPS doesn't work underground |
| Cross-module alerts | One shared event bus feeds both the Alerts feed and the Rescue Intelligence synthesis panel |
| Snapshot & Fullscreen | Real downloadable snapshot from the live backend, native fullscreen API |
| Accounts | Email + password (bcrypt + JWT sessions) or Google Sign-In, plus a seeded demo account for instant access |
| Mission history | Past missions with per-session recorded-path replay on the same map component |
| Works everywhere | Responsive from phone to desktop |

---

## 🖥️ Dashboard Modules

All 12 problem-statement sections are built. See `monocopter-monitoring-system/MODULES.md` for full detail per module (what's live, what's simulated pending hardware, and what each one needs from the monocopter).

| # | Module | Status |
|---|---|---|
| 1 | Live Camera & Human Detection | ✅ Real model, live camera / video source |
| 2 | Gas Trends | ✅ |
| 3 | Battery Intelligence | ✅ |
| 4 | Environment Insights | ✅ |
| 5 | Monocopter Health | ✅ |
| 6 | Actionable Alerts | ✅ |
| 7 | Mapping & Location | ✅ |
| 8 | Mission Status | ✅ |
| 9 | Thermal View & Detection | ✅ |
| 10 | Communication & Connectivity | ✅ |
| 11 | Flight Path & Mission History | ✅ |
| 12 | Rescue Intelligence & Recommended Actions | ✅ |

---

## Tech Stack

### Dashboard (`monocopter-monitoring-system/`)
| Layer | Technology |
|---|---|
| Framework | **React 19** + Vite |
| Language | TypeScript |
| Styling | **Tailwind CSS v4** |
| UI Components | Radix UI primitives (shadcn-style, hand-rolled in `src/components/ui/`) |
| Charts | recharts |
| Icons | Phosphor Icons |
| Sign-in | Google Identity Services |

### Detection Server (`detection-server/`)
| Layer | Technology |
|---|---|
| Framework | **FastAPI** + Uvicorn |
| Vision model | **YOLOv8n** via Ultralytics |
| Video I/O | OpenCV (`cv2.VideoCapture`, MJPEG streaming) |

### Auth Server (`auth-server/`)
| Layer | Technology |
|---|---|
| Framework | **Express** |
| Sessions | JWT in an httpOnly cookie |
| Passwords | bcrypt (`bcryptjs`) |
| Database | SQLite (`better-sqlite3`) |
| Google Sign-In | `google-auth-library` (server-side ID-token verification) |

---

## Project Structure

```
SIH26-Hardware-26039/
+-- monocopter-monitoring-system/     # React 19 + Vite operator dashboard
|   +-- src/
|   |   +-- App.tsx                   # Root layout, view routing
|   |   +-- pages/                    # One file per dashboard module/tab
|   |   +-- components/               # UI primitives + per-module components
|   |   +-- hooks/                    # Live data feeds (one per module)
|   |   +-- lib/                      # Shared types, API clients, auth context
|   |   +-- data/                     # Feed config (thresholds, seed generators)
|   +-- public/                       # Static assets (images, simulation videos)
|   +-- MODULES.md                    # Per-module build status & backend needs
|   +-- README.md                     # Dashboard-specific docs
|
+-- detection-server/                 # FastAPI human-detection backend
|   +-- server.py                     # Camera/video capture loop + YOLOv8n inference + MJPEG stream
|   +-- models/best.pt                # Trained YOLOv8n weights
|   +-- requirements.txt
|   +-- README.md
|
+-- auth-server/                      # Express auth backend
|   +-- server.js                     # Register/login/logout/me/google/forgot-password
|   +-- db.js                         # SQLite schema + seeded demo account
|   +-- README.md
|
+-- SIH2026_MineRescue/               # Model training project (dataset, runs, inference script)
+-- Dashboard Features.pdf            # Original problem-statement dashboard spec
+-- README.md                         # This file
```

---

## Quick Start

### Prerequisites
- Node.js 20+
- Python 3.10+ and a camera (laptop webcam, a phone, or the bundled simulation videos — no camera needed for the default setup)

### 1. Clone
```bash
git clone <this-repo-url>
cd "SIH26 Hardware - 26039"
```

### 2. Detection server
```bash
cd detection-server
pip install -r requirements.txt
```

### 3. Auth server
```bash
cd auth-server
npm install
cp .env.example .env    # fill in JWT_SECRET and (optionally) GOOGLE_CLIENT_ID
```

### 4. Dashboard + everything, one command
```bash
cd monocopter-monitoring-system
npm install
npm run dev:all
```

`npm run dev:all` starts the dashboard, the detection server, and the auth server together. Opens at `http://localhost:5173`.

Or run each piece separately:
```bash
cd detection-server && python server.py          # :8000
cd auth-server && npm run dev                     # :8787
cd monocopter-monitoring-system && npm run dev    # :5173
```

---

## Environment Variables

### `auth-server/.env` (copy from `auth-server/.env.example`)
```env
JWT_SECRET=                    # required: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
GOOGLE_CLIENT_ID=               # optional: enables "Sign in with Google"
CORS_ORIGIN=http://localhost:5173
PORT=8787
```

### `monocopter-monitoring-system/.env` (copy from `.env.example`)
```env
VITE_AUTH_API_URL=http://localhost:8787
VITE_GOOGLE_CLIENT_ID=          # optional: must match auth-server's GOOGLE_CLIENT_ID
```

A seeded demo account (`demo@minewatch.app` / `MineWatch#2026`) works with no setup at all — see `auth-server/README.md`.

---

## API Reference

### Detection Server (`http://localhost:8000`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/video_feed` | MJPEG stream, bounding boxes already drawn in |
| `GET` | `/api/detection/current` | Latest detection (label, confidence, box, time, sector) |
| `GET` | `/api/detection/history` | Last 6 sampled detections |
| `GET` | `/api/snapshot` | Single current frame as JPEG |
| `GET` | `/health` | Model-loaded / camera-open status |

### Auth Server (`http://localhost:8787`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create an account |
| `POST` | `/api/auth/login` | Sign in with email + password |
| `POST` | `/api/auth/google` | Sign in with a Google ID token |
| `POST` | `/api/auth/logout` | Clear the session cookie |
| `GET` | `/api/auth/me` | Current signed-in user |
| `POST` | `/api/auth/forgot-password` | Request a password-reset token |
| `POST` | `/api/auth/reset-password` | Set a new password with that token |

---

## Security

- Passwords are hashed with **bcrypt**, never stored or logged in plain text
- Sessions are a JWT in an **httpOnly, SameSite=Lax** cookie — never touched by frontend JS, never put in localStorage
- State-changing requests are rejected unless their `Origin` matches `CORS_ORIGIN`
- Auth endpoints are **rate-limited** per IP
- Error responses are generic by design; real errors go to server logs only
- No secrets are committed: `.env` files are git-ignored on both backends

---

## User Journey

```
http://localhost:5173   (Landing page)
        |
Login / Get Started (or the seeded demo account)
        |
Operator Console: Live Feed, Map, Environment, Monocopter, Mission, Alerts, History, Rescue
        |
Real-time detection + sensor status -> Alerts -> Rescue Intelligence recommendation
```

---

<div align="center">

**Built for the Smart India Hackathon 2026 · Problem Statement 26039 · Government of Jharkhand**

*MineWatch: See what's hidden. Protect what's inside.*

</div>
