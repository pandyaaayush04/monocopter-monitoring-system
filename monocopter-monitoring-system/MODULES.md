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

### 6. Actionable Alerts ⬜

**Purpose (from the PDF):** "Know what happened and what to do next" — severity + recommended action. This is the cross-module event feed: a low battery, a gas danger reading, a person detected — anything another module's `Status` goes to `warning`/`danger` should be able to surface here as one alert, not just in its own tab.

**Planned content:**
- A scrollable feed of alert cards, newest first, each with: severity (`warning`/`danger`, reuse `Status`), a one-line title ("Battery critical — 18%"), a short detail sentence, which module/sensor it came from, a timestamp, and a recommended action sentence (e.g. "Return to base immediately").
- Filter/tab by severity or by source module (optional, nice-to-have not required for v1).
- An acknowledge/dismiss action per alert (local state is fine for v1 — no backend persistence needed yet).
- Empty state: "No active alerts" — don't fake an alert just to have something to show.

**Data shape to design around:**
```ts
type AlertEvent = {
  id: string
  severity: "warning" | "danger"
  title: string
  detail: string
  source: "battery" | "gas" | "detection" | "monocopter" | ...
  time: string
  recommendedAction: string
  acknowledged: boolean
}
```

**Reuse:** `Status`/`STATUS_*` from `src/lib/status.ts`, `Badge`, `Card`. This module has no sensor of its own — it's a rollup, so building it well means reading the `Status` each existing module already computes (battery %, gas readings, detection state) rather than re-deriving thresholds. Worth deciding whether it polls each module's hook directly or whether there should be a shared "alerts bus" — that's an open design call for whoever builds this.

- Stub: `src/pages/alerts-page.tsx`, `src/data/mock-alerts.ts`, `src/hooks/use-mock-alerts-feed.ts`, `src/components/alerts/`

### 7. Mapping & Location ⬜

**Has a wireframe** — `Dashboard Features.pdf` page 2, "Live Mine Mapping & Monocopter Location." Follow it closely, it's detailed:

**Planned content (from the wireframe):**
- Main panel: a top-down mine map (tunnels as line-art, dark background) showing: the monocopter's current position (icon), its flight path so far (dashed line), waypoints (numbered circles, WP-1/WP-2/...), a detected-human marker at its last known position, a hazard-zone marker (hatched area), a blocked-path marker.
- Sector/view selector (dropdown, e.g. "Sector B") and a "3D View" toggle button (can stay a disabled/"coming soon" button for v1 — no need to build actual 3D).
- Right rail: "Monocopter Location & Status" card — current X/Y/Z coordinates, current sector, flight mode (Autonomous/Manual), battery level (reuse the battery gauge/bar styling from Module 3 for consistency), signal strength (reuse Module 5's signal card styling), speed, altitude from ground.
- A map legend (mine tunnel line, flight path line, waypoint marker, detected-human marker, hazard-zone pattern, blocked-path marker, entrance/exit marker).
- Bottom row, three cards: "Sector Information" (name, avg depth, total tunnel length, mapped area, unexplored area), "Quick Actions" (Set Waypoint / Send Monocopter Here / Mark Hazard Zone / Add Note — buttons, can be inert/disabled for v1 since there's no monocopter to command yet), "Key Locations" table (type, name, distance, status — entrance/waypoints/hazards/detected humans as rows).

**Reuse:** the detected-human marker should pull from the same detection data Module 1 already has (`src/lib/detection-types.ts`) rather than inventing a separate shape for "a person was detected here." No real positioning system exists yet (see Module 5's note on GPS not working underground) — mock coordinates are fine, but don't fabricate a precision GPS reading; frame it as inertial/SLAM-estimated position, consistent with Module 5's honesty about navigation.

- Stub: `src/pages/map-page.tsx`, `src/data/mock-map.ts`, `src/hooks/use-mock-map-feed.ts`, `src/components/map/`

### 8. Mission Status ⬜

**Purpose:** no PDF wireframe or highlight bullet for this one — just the section name. Reasonable scope for v1, open to revision when actually built:

**Planned content:**
- Mission phase badge (e.g. Idle / En Route / Searching / Returning / Complete).
- Elapsed mission time (can reuse the same real-wall-clock pattern as Module 3's "Mission Flight Time").
- Current objective / current waypoint or sector.
- An objective checklist with progress (e.g. "Reach Sector B" ✓, "Scan for survivors" ✓, "Return to base" ○).
- Consider whether this overlaps with Module 11 (Flight Path & Mission History) — Mission Status is "what's happening now," History is "what happened on past missions." Keep them distinct rather than merging.

- Stub: `src/pages/mission-page.tsx`, `src/data/mock-mission.ts`, `src/hooks/use-mock-mission-feed.ts`, `src/components/mission/`

### 9. Thermal View & Detection ⬜

**Purpose:** thermal-camera counterpart to Module 1's RGB detection, once real thermal hardware exists.

**Likely composition:** Module 1's `VideoPanel` (`src/components/live-feed/video-panel.tsx`) already has an RGB/Thermal tab that currently shows an honest "Thermal camera not connected" placeholder. The straightforward path is to make that tab real (point it at a thermal stream + thermal-based detections) rather than building a whole separate page — avoid duplicating the video-panel/detection-card/history-table pattern Module 1 already has.

**Planned content, if/when there's a real thermal feed:**
- False-color heatmap video (same MJPEG-from-backend pattern `detection-server/` already uses for RGB — the backend would need a second camera source and a temperature-to-color mapping).
- A temperature-range legend (color gradient with min/max °C).
- Heat-signature detection markers with confidence, similar shape to `DetectionEvent` in `src/lib/detection-types.ts`.

Don't fake a thermal filter over RGB footage to simulate this — that would misrepresent a sensor reading that doesn't exist. Keep the honest "not connected" state until real thermal hardware is wired in.

- Stub: `src/pages/thermal-page.tsx`, `src/data/mock-thermal.ts`, `src/hooks/use-mock-thermal-feed.ts`, `src/components/thermal/`

### 10. Communication & Connectivity ⬜

**Likely composition:** Module 5 (Monocopter Health) already has a `SignalStrengthCard` (`src/components/monocopter/signal-strength-card.tsx`) for the base-station comms link. This module is probably that card's fuller expansion, best added as a third tab on the Monocopter page rather than a new standalone route.

**Planned content:**
- Everything `SignalStrengthCard` already shows (link %, status), plus: latency, packet loss %, uplink/downlink data rate, and a connection-quality history chart over time (reuse the `recharts` line/area-with-reference-lines pattern from Module 2/3's trend charts).
- A connection-events log (link dropped / reconnected, timestamped) — similar shape to `DetectionEvent`'s history pattern.

- Stub: `src/pages/communication-page.tsx`, `src/data/mock-communication.ts`, `src/hooks/use-mock-communication-feed.ts`, `src/components/communication/`

### 11. Flight Path & Mission History ⬜

**Purpose:** a log of *past* missions, distinct from Module 8's "what's happening right now."

**Planned content:**
- A list/table of past mission sessions: date, duration, distance covered, sectors visited, number of detections made, number of alerts triggered, outcome.
- Clicking a session could show its flight path replayed on a static map (reuse Module 7's map rendering once that exists, rather than building a second map component).
- Pairs naturally with Module 6 (Alerts) — a past mission's alert count could link to the specific `AlertEvent`s from that session, if alert data ends up persisted anywhere.

- Stub: `src/pages/history-page.tsx`, `src/data/mock-history.ts`, `src/hooks/use-mock-history-feed.ts`, `src/components/history/`

### 12. Rescue Intelligence & Recommended Actions ⬜

**Purpose (from the PDF's value proposition):** "Act → Alerts, victim location & recommended actions." This heavily overlaps with Module 6 (Actionable Alerts) — read that section first. The distinction to design for: Module 6 is a *feed* of individual events; this module is meant to be the single, composite, highest-priority synthesis — e.g. combining "Person detected in Sector B" + "Gas: Danger" + "Anomaly: Detected" into one strategic recommendation ("Do not send a rescue team without gas masks; prioritize evacuation of Sector B"), matching the worked example in the original project brief.

**Planned content:**
- A single prominent panel (not a feed) for the current highest-priority situation, if any: victim location, contributing factors (which sensors triggered it), and a recommended course of action in plain language.
- Empty state when nothing rises to this level: don't show a fabricated "all clear, recommend nothing" card, just omit the panel or show a quiet "no active rescue situation."

**Before building this:** decide with whoever builds Module 6 whether this is a separate page/component that *reads* the same alert data, or a special "priority" rendering mode inside Module 6's feed. Building both independently risks two different definitions of "how bad is bad enough."

- Stub: `src/pages/rescue-intel-page.tsx`, `src/data/mock-rescue-intel.ts`, `src/hooks/use-mock-rescue-intel-feed.ts`, `src/components/rescue-intel/`

## Shared infrastructure (not a module, used by all of them)

- `src/lib/status.ts` — the `Status` (`safe`/`warning`/`danger`) type and its color/label tokens. Every module's risk indicators route through this, not a per-module copy.
- `src/components/shared/status-banner.tsx` — the banner used by every module's top-of-page risk/readiness summary.
- `src/lib/pages.ts` — page routing keys + titles, consumed by `App.tsx` and the sidebar.
