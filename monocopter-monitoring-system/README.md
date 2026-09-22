# Mine Rescue Console — UI

Operator dashboard for SIH 2026 PS 26039 (AI-Powered Underground Mine Safety, Monitoring and Rescue System). React + Vite frontend. The Live Camera Feed & Human Detection module runs the real trained YOLOv8n model against a live camera via `detection-server/` (repo root) — everything else still runs on mock data until wired up.

## Prerequisites

- Node.js 20+ (built and tested on Node 22)
- npm
- **For live human detection (Live Feed module):** Python 3.10+ and a camera (laptop webcam or a phone, see below). Not needed for the rest of the dashboard — modules 2–5 run on mock data with just Node.

## Run it

### Dashboard only (mock data for everything, no live detection)

```bash
cd monocopter-monitoring-system
npm install
npm run dev
```

Opens at `http://localhost:5173` (Vite picks the next free port if that one's busy — check the terminal output). The Live Feed module will show "Detection service offline" until the backend below is also running.

### Dashboard + live human detection, one command

First time only, install the Python side:

```bash
cd detection-server
pip install -r requirements.txt
cd ../monocopter-monitoring-system
npm install
```

Then, every time, from `monocopter-monitoring-system/`:

```bash
npm run dev:all
```

Starts the Vite dev server **and** the detection backend together (via `concurrently`), labeled `[dashboard]` / `[backend]` in the terminal. Ctrl+C stops both. Same as running `npm run dev` and `python ../detection-server/server.py` in two separate terminals — `dev:all` is just the one-command version.

### Using a phone camera instead of a laptop webcam

The detection server defaults to the laptop's built-in webcam. To point it at a phone instead (useful if your laptop has no camera, or you want a better vantage point): install an IP-camera app on the phone (e.g. "IP Webcam" on Android), start its stream, then run the backend with:

```bash
# Windows PowerShell
$env:CAMERA_SOURCE="http://<phone-ip>:8080/video"; python server.py

# bash
CAMERA_SOURCE="http://<phone-ip>:8080/video" python server.py
```

Both phone and laptop need to be on the same Wi-Fi network. See `detection-server/README.md` for details.

## Other commands

```bash
npm run build     # production build + typecheck (tsc -b && vite build), output in dist/
npm run preview   # serve the production build locally
npx tsc -b        # typecheck only, no build
npm run lint      # oxlint
```

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- [shadcn/ui](https://ui.shadcn.com) (radix base, "nova" style) — component source lives in `src/components/ui/`, add more with `npx shadcn@latest add <component>`
- [Phosphor Icons](https://phosphoricons.com) (`@phosphor-icons/react`)
- [recharts](https://recharts.org) for charts
- [shadow-plugin](https://shadow.floriankiem.com) for elevation shadows — use `smooth-shadow-*` / `smooth-shadow-ring-*` classes, never a raw `shadow-[...]` value or a `border` stacked under a `shadow`

Theme is orange/white, light mode only (no dark mode). Tokens live in `src/index.css`.

## Human detection backend

`detection-server/` (repo root, sibling to this folder) is a small FastAPI server that owns the camera, runs the trained YOLOv8n model (`SIH2026_MineRescue/` has the training details) on every frame, and serves the annotated video + detection JSON to this dashboard. It's a stand-in for the monocopter's camera feed — once the hardware is ready, that's the piece that gets swapped, not the dashboard. See `detection-server/README.md`.

## Project structure

```
src/
  components/
    ui/            shadcn primitives (don't hand-edit unless necessary — prefer the CLI)
    shared/        cross-page components (e.g. StatusBanner)
    <module>/      components scoped to one dashboard module (live-feed/, gas-trends/, battery/, ...)
  pages/           one file per routed page/tab
  hooks/           data feeds — use-detection-feed.ts is real (polls detection-server), the rest are use-mock-*.ts (each has a comment marking where the real backend hooks in)
  data/            mock data + config (thresholds, seed generators)
  lib/             shared types/utils (status.ts, pages.ts, detection-api.ts, detection-types.ts, utils.ts)
```

Routing is a plain `useState<PageKey>` switch in `App.tsx` — no router library, the app is small enough not to need one yet.

## Mock data

Modules 2–5 (Gas Trends, Battery, Environment Insights, Monocopter Health) run on simulated data (random-walk sensor feeds) so they're demoable without real sensors or the monocopter connected. Each `use-mock-*` hook in `src/hooks/` has a `ponytail:` comment noting what it should be replaced with once the real backend is ready — the data shape it returns is meant to stay the same, so swapping the hook shouldn't require touching the components. Module 1 (Live Feed) is no longer mocked — see above.

See `MODULES.md` for what's built so far and what each module still needs from the backend.
