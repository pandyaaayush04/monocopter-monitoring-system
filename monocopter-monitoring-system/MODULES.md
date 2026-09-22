# Dashboard Modules

Tracks the 12 dashboard sections from `Dashboard Features.pdf` against what's actually built in `monocopter-monitoring-system/`. **Built through Module 5** (Monocopter Health) as of this writing — everything after that is not started.

Module 1 (Live Feed) runs the real trained YOLOv8n model via `detection-server/` at the repo root — see below. Modules 2–5 still run on mock data (random-walk sensor simulations) — see the `ponytail:` comment in each module's `use-mock-*` hook in `src/hooks/` for the swap-to-real-backend note. None of the sensor/monocopter modules are wired to real hardware yet.

## Status legend

- ✅ Built — UI complete, verified in-browser, mock data
- ⬜ Not started

| # | Section (from PDF) | Status | Nav location |
|---|---|---|---|
| 1 | Live Camera & Human Detection | ✅ | Sidebar → Live Feed |
| 2 | Gas Trends | ✅ | Sidebar → Environment → "Gas Trends" tab |
| 3 | Battery Intelligence | ✅ | Sidebar → Monocopter → "Battery" tab |
| 4 | Environment Insights | ✅ | Sidebar → Environment → "Environment Insights" tab |
| 5 | Monocopter Health | ✅ | Sidebar → Monocopter → "System Status" tab |
| 6 | Actionable Alerts | ⬜ | not routed — stub at `alerts-page.tsx` |
| 7 | Mapping & Location | ⬜ | not routed — stub at `map-page.tsx` |
| 8 | Mission Status | ⬜ | not routed — stub at `mission-page.tsx` |
| 9 | Thermal View & Detection | ⬜ | not routed — stub at `thermal-page.tsx` |
| 10 | Communication & Connectivity | ⬜ | not routed — stub at `communication-page.tsx` |
| 11 | Flight Path & Mission History | ⬜ | not routed — stub at `history-page.tsx` |
| 12 | Rescue Intelligence & Recommended Actions | ⬜ | not routed — stub at `rescue-intel-page.tsx` |

## Module detail

### 1. Live Camera & Human Detection ✅ (real model, not mocked)

Wireframe-matched, and running the **actual trained YOLOv8n model** — not mock data. `detection-server/` (repo root) owns the camera (laptop webcam or a phone via `CAMERA_SOURCE`, see its README), runs inference every frame, and burns the bounding box into the MJPEG stream server-side; the dashboard just displays `<img src=".../video_feed">` and polls `/api/detection/current` + `/api/detection/history` for the side cards. Real Snapshot (downloads the current annotated frame from the backend) and Fullscreen (native API). RGB/Thermal toggle — Thermal shows an honest "not connected" state rather than a fake filter over RGB footage, since there's no thermal camera yet.

Run `npm run dev:all` from `monocopter-monitoring-system/` to start both the dashboard and the detection backend together. Without the backend running, the module honestly shows "Detection service offline" rather than falling back to fake data.

- Pages: `src/pages/live-feed-page.tsx`
- Components: `src/components/live-feed/`
- Data layer: `src/lib/detection-types.ts` (shared types), `src/lib/detection-api.ts` (fetch client), `src/hooks/use-detection-feed.ts` (polling hook, real — no `ponytail:` mock-swap note needed here, it's already the real thing)
- Backend: `detection-server/` at the repo root (FastAPI + Ultralytics + OpenCV) — see its own README
- Needs from hardware: the monocopter's actual video feed, to replace the laptop-webcam-or-phone stand-in `detection-server/` currently uses. Point `CAMERA_SOURCE` at it when it's ready — nothing else in the pipeline should need to change.

### 2. Gas Trends ✅

Methane (CH4), Carbon Monoxide (CO), Oxygen (O2 — inverted, low is dangerous) with mine-safety-realistic thresholds. Risk banner rolls up worst status across all three. Click a summary card to drive the big trend chart with warning/danger reference lines.

- Page: `src/pages/gas-trends-page.tsx` (rendered as a tab inside `environment-page.tsx`)
- Components: `src/components/gas-trends/`
- Mock: `src/data/mock-gas.ts`, `src/hooks/use-mock-gas-feed.ts`
- Needs from backend: gas sensor readings (ppm/%) over time, ideally timestamped

### 3. Battery Intelligence ✅

Custom SVG radial gauge (no chart library) for battery %. Estimated flight time remaining and battery voltage are derived from the mock % via realistic formulas (4S LiPo discharge curve). Mission flight time is real wall-clock elapsed since the page mounted, not mocked. Discharge chart with warning/critical reference lines.

- Page: `src/pages/battery-page.tsx` (rendered as a tab inside `monocopter-page.tsx`)
- Components: `src/components/battery/`
- Mock: `src/data/mock-battery.ts`, `src/hooks/use-mock-battery-feed.ts`
- Needs from backend: battery % (and ideally raw voltage) telemetry from the flight controller

### 4. Environment Insights ✅

Temperature and humidity, each with a plain-language interpretation sentence per risk level (this is the PDF's stated differentiator from Gas Trends — "understand what the readings mean", not just show a number).

- Page: `src/pages/environment-insights-content.tsx` (tab inside `environment-page.tsx`)
- Components: `src/components/environment/`
- Mock: `src/data/mock-environment.ts`, `src/hooks/use-mock-environment-feed.ts`
- Needs from backend: temperature + humidity sensor readings

### 5. Monocopter Health ✅

Pre-flight checklist (motors, IMU, navigation, camera, obstacle sensors, comms link) with per-item status + plain-language detail. Deliberately has **no GPS item** — GPS doesn't work underground, so the checklist shows "Inertial/SLAM Navigation" instead of faking a GPS lock. Signal strength card for the base-station comms link. Readiness banner rolls up worst status across the checklist + signal.

- Page: `src/pages/system-status-content.tsx` (tab inside `monocopter-page.tsx`)
- Components: `src/components/monocopter/`
- Mock: `src/data/mock-system-status.ts`, `src/hooks/use-mock-signal-feed.ts`
- Needs from backend: flight-controller pre-flight diagnostic report, comms link RSSI/quality

### 6–12. Not started ⬜

No functionality written yet — placeholder files only, scaffolded so file structure stays consistent no matter who picks up a module. Each stub page renders a "not yet built" message and is not wired into `App.tsx`/the sidebar. Mapping & Location has a wireframe in `Dashboard Features.pdf` (page 2); the rest don't, so their layout will be designed fresh when we get to them, same approach as modules 2–5.

| # | Section | Slug | Stub page | Stub data | Stub hook | Components folder |
|---|---|---|---|---|---|---|
| 6 | Actionable Alerts | `alerts` | `src/pages/alerts-page.tsx` | `src/data/mock-alerts.ts` | `src/hooks/use-mock-alerts-feed.ts` | `src/components/alerts/` |
| 7 | Mapping & Location | `map` | `src/pages/map-page.tsx` | `src/data/mock-map.ts` | `src/hooks/use-mock-map-feed.ts` | `src/components/map/` |
| 8 | Mission Status | `mission` | `src/pages/mission-page.tsx` | `src/data/mock-mission.ts` | `src/hooks/use-mock-mission-feed.ts` | `src/components/mission/` |
| 9 | Thermal View & Detection | `thermal` | `src/pages/thermal-page.tsx` | `src/data/mock-thermal.ts` | `src/hooks/use-mock-thermal-feed.ts` | `src/components/thermal/` |
| 10 | Communication & Connectivity | `communication` | `src/pages/communication-page.tsx` | `src/data/mock-communication.ts` | `src/hooks/use-mock-communication-feed.ts` | `src/components/communication/` |
| 11 | Flight Path & Mission History | `history` | `src/pages/history-page.tsx` | `src/data/mock-history.ts` | `src/hooks/use-mock-history-feed.ts` | `src/components/history/` |
| 12 | Rescue Intelligence & Recommended Actions | `rescue-intel` | `src/pages/rescue-intel-page.tsx` | `src/data/mock-rescue-intel.ts` | `src/hooks/use-mock-rescue-intel-feed.ts` | `src/components/rescue-intel/` |

Note some of these will likely end up composed as a tab inside an existing nav page rather than a standalone route — e.g. Thermal probably folds into Live Feed's existing RGB/Thermal toggle, and Communication probably folds into Monocopter (which already has a signal-strength card). That's a wiring decision to make when actually building each one, same as how Gas Trends and Environment Insights ended up sharing the "Environment" nav item. The stub page/component folder exists either way — worst case it stays a thin wrapper that composes into a tab.

## Shared infrastructure (not a module, used by all of them)

- `src/lib/status.ts` — the `Status` (`safe`/`warning`/`danger`) type and its color/label tokens. Every module's risk indicators route through this, not a per-module copy.
- `src/components/shared/status-banner.tsx` — the banner used by every module's top-of-page risk/readiness summary.
- `src/lib/pages.ts` — page routing keys + titles, consumed by `App.tsx` and the sidebar.
