# Monocopter Monitoring System

Operator dashboard + human-detection backend for SIH 2026 PS 26039 (AI-Powered Underground Mine Safety, Monitoring and Rescue System).

## What's in here

```
monocopter-monitoring-system/   the dashboard (React + Vite)
detection-server/                the human-detection backend (FastAPI + trained YOLOv8n model)
```

Everything else (dataset, training scripts, experiment logs) lives outside this repo — this repo is the two deployable pieces plus the one trained model artifact the backend needs (`detection-server/models/best.pt`).

## Run the dashboard only (mock data, no live detection)

Everything except the Live Feed module runs on simulated data regardless — this just skips the real camera/model too.

```bash
cd monocopter-monitoring-system
npm install
npm run dev
```

Opens at `http://localhost:5173`. The Live Feed module will show "Detection service offline" until the backend below is also running.

## Run the dashboard + real human detection model

Requires Node.js 20+, Python 3.10+, and a camera (laptop webcam or a phone — see `detection-server/README.md`).

```bash
# one-time setup
cd detection-server
pip install -r requirements.txt
cd ../monocopter-monitoring-system
npm install

# every time after, one command starts both:
npm run dev:all
```

`npm run dev:all` runs the dashboard and the detection backend together, labeled `[dashboard]`/`[backend]` in one terminal. Ctrl+C stops both.

## More detail

- `monocopter-monitoring-system/README.md` — dashboard stack, project structure, commands
- `monocopter-monitoring-system/MODULES.md` — which of the 12 dashboard sections are built vs mocked vs not started
- `detection-server/README.md` — backend endpoints, phone-camera setup, how the model was trained
