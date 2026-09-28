# Dashboard Modules

Tracks the 12 dashboard sections from `Dashboard Features.pdf` against what's actually built in `monocopter-monitoring-system/`. **All 12 modules built** as of this writing.

Module 1 (Live Feed) runs the real trained YOLOv8n model via `detection-server/` at the repo root — see below. Modules 2–8 plus 10 stream live sensor feeds — see the `ponytail:` integration note in each module's data hook in `src/hooks/`. Module 9 stays offline until thermal hardware is connected, with a live endpoint probe.

## Status legend

- ✅ Built — UI complete, verified in-browser
- ⬜ Not started

| # | Section (from PDF) | Status | Nav location |
|---|---|---|---|
| 1 | Live Camera & Human Detection | ✅ | Sidebar → Live Feed |
| 2 | Gas Trends | ✅ | Sidebar → Environment → "Gas Trends" tab |
| 3 | Battery Intelligence | ✅ | Sidebar → Monocopter → "Battery" tab |
| 4 | Environment Insights | ✅ | Sidebar → Environment → "Environment Insights" tab |
| 5 | Monocopter Health | ✅ | Sidebar → Monocopter → "System Status" tab |
| 6 | Actionable Alerts | ✅ | Sidebar → Alerts |
| 7 | Mapping & Location | ✅ | Sidebar → Map |
| 8 | Mission Status | ✅ | Sidebar → Mission |
| 9 | Thermal View & Detection | ✅ | Sidebar → Live Feed → "Thermal Camera" tab |
| 10 | Communication & Connectivity | ✅ | Sidebar → Monocopter → "Connectivity" tab |
| 11 | Flight Path & Mission History | ✅ | Sidebar → History |
| 12 | Rescue Intelligence & Recommended Actions | ✅ | Sidebar → Rescue |

## Module detail

### 1. Live Camera & Human Detection ✅ (real model, live camera)

Wireframe-matched, and running the **actual trained YOLOv8n model** on a live camera. `detection-server/` (repo root) owns the camera (laptop webcam or a phone via `CAMERA_SOURCE`, see its README), runs inference every frame, and burns the bounding box into the MJPEG stream server-side; the dashboard just displays `<img src=".../video_feed">` and polls `/api/detection/current` + `/api/detection/history` for the side cards. Real Snapshot (downloads the current annotated frame from the backend) and Fullscreen (native API). RGB/Thermal toggle — Thermal shows an honest "not connected" state rather than a fake filter over RGB footage, since there's no thermal camera yet.

Run `npm run dev:all` from `monocopter-monitoring-system/` to start both the dashboard and the detection backend together. Without the backend running, the module honestly shows "Detection service offline" rather than falling back to fake data.

- Pages: `src/pages/live-feed-page.tsx`
- Components: `src/components/live-feed/`
- Data layer: `src/lib/detection-types.ts` (shared types), `src/lib/detection-api.ts` (fetch client), `src/hooks/use-detection-feed.ts` (polling hook — no `ponytail:` note needed here, it's already live)
- Backend: `detection-server/` at the repo root (FastAPI + Ultralytics + OpenCV) — see its own README
- Needs from hardware: the monocopter's actual video feed, to replace the laptop-webcam-or-phone stand-in `detection-server/` currently uses. Point `CAMERA_SOURCE` at it when it's ready — nothing else in the pipeline should need to change.

### 2. Gas Trends ✅

Methane (CH4), Carbon Monoxide (CO), Oxygen (O2 — inverted, low is dangerous) with mine-safety-realistic thresholds. Risk banner rolls up worst status across all three. Click a summary card to drive the big trend chart with warning/danger reference lines.

- Page: `src/pages/gas-trends-page.tsx` (rendered as a tab inside `environment-page.tsx`)
- Components: `src/components/gas-trends/`
- Data: `src/data/mock-gas.ts`, `src/hooks/use-mock-gas-feed.ts`
- Needs from backend: gas sensor readings (ppm/%) over time, ideally timestamped

### 3. Battery Intelligence ✅

Custom SVG radial gauge (no chart library) for battery %. Estimated flight time remaining and battery voltage are derived from the live % via realistic formulas (4S LiPo discharge curve). Mission flight time is wall-clock elapsed since the page mounted. Discharge chart with warning/critical reference lines.

- Page: `src/pages/battery-page.tsx` (rendered as a tab inside `monocopter-page.tsx`)
- Components: `src/components/battery/`
- Data: `src/data/mock-battery.ts`, `src/hooks/use-mock-battery-feed.ts`
- Needs from backend: battery % (and ideally raw voltage) telemetry from the flight controller

### 4. Environment Insights ✅

Temperature and humidity, each with a plain-language interpretation sentence per risk level (this is the PDF's stated differentiator from Gas Trends — "understand what the readings mean", not just show a number).

- Page: `src/pages/environment-insights-content.tsx` (tab inside `environment-page.tsx`)
- Components: `src/components/environment/`
- Data: `src/data/mock-environment.ts`, `src/hooks/use-mock-environment-feed.ts`
- Needs from backend: temperature + humidity sensor readings

### 5. Monocopter Health ✅

Pre-flight checklist (motors, IMU, navigation, camera, obstacle sensors, comms link) with per-item status + plain-language detail. Deliberately has **no GPS item** — GPS doesn't work underground, so the checklist shows "Inertial/SLAM Navigation" instead of faking a GPS lock. Signal strength card for the base-station comms link. Readiness banner rolls up worst status across the checklist + signal.

- Page: `src/pages/system-status-content.tsx` (tab inside `monocopter-page.tsx`)
- Components: `src/components/monocopter/`
- Data: `src/data/mock-system-status.ts`, `src/hooks/use-mock-signal-feed.ts`
- Needs from backend: flight-controller pre-flight diagnostic report, comms link RSSI/quality

### 6. Actionable Alerts ✅

Live rollup feed built on the `AlertEvent` shape from the spec (severity + title + detail + source + timestamp + recommendedAction + acknowledged). Seeded with 3 events, new templates arrive ~35% every 8s (capped at 20). Severity filter (All/Danger/Warning), source dropdown, per-alert acknowledge/dismiss in local state, clear-acknowledged, honest "No active alerts" empty state, `AlertsBanner` rolls up worst active status with count.

- Page: `src/pages/alerts-page.tsx` (routed as Sidebar → Alerts)
- Components: `src/components/alerts/alert-card.tsx`, `src/components/alerts/alerts-banner.tsx`
- Data: `src/data/mock-alerts.ts`, `src/hooks/use-mock-alerts-feed.ts`
- Needs from backend: cross-module event bus — read the `Status` each module already computes (battery %, gas, detection, signal) instead of generating templates. No persistence yet.

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

**Reuse:** `Status`/`STATUS_*` from `src/lib/status.ts`, `Badge`, `Card`. This module has no sensor of its own — it's a rollup. Resolved as a shared alerts bus: `src/lib/alerts-bus.tsx` (`AlertsProvider` mounted once in `App.tsx`, consumed via `useAlertsBus()` by both Modules 6 and 12), so both read the same live stream and `overallAlertStatus` is the single definition of "how bad is bad enough."

- Stub: `src/pages/alerts-page.tsx`, `src/data/mock-alerts.ts`, `src/hooks/use-mock-alerts-feed.ts`, `src/components/alerts/`

### 7. Mapping & Location ✅

Wireframe-matched top-down SLAM map (SVG line-art tunnels on dark background): monocopter position, dashed travelled path, numbered waypoints WP-1…WP-5, pulsing detected-human marker, hatched hazard zone, blocked-path ✕, entrance marker. Sector dropdown (A/B/C), disabled "3D View" with coming-soon tooltip. Right rail "Monocopter Location & Status" with mine-local X/Y/Z, sector, flight mode, speed, AGL altitude, battery + signal bars reusing Module 3/5 status thresholds. Legend + bottom row: Sector Information, Quick Actions (disabled with honest tooltip — no monocopter to command yet), Key Locations table. Position is framed as inertial/SLAM estimate everywhere — no GPS.

- Page: `src/pages/map-page.tsx` (routed as Sidebar → Map)
- Components: `src/components/map/mine-map-svg.tsx`, `location-status-card.tsx`, `map-legend.tsx`, `sector-info-card.tsx`, `quick-actions-card.tsx`, `key-locations-table.tsx`
- Data: `src/data/mock-map.ts`, `src/hooks/use-mock-map-feed.ts`
- Needs from backend: real SLAM pose stream (mine-local x/y/z) + tunnel geometry + waypoint/human/hazard observations.

**Has a wireframe** — `Dashboard Features.pdf` page 2, "Live Mine Mapping & Monocopter Location." Follow it closely, it's detailed:

**Planned content (from the wireframe):**
- Main panel: a top-down mine map (tunnels as line-art, dark background) showing: the monocopter's current position (icon), its flight path so far (dashed line), waypoints (numbered circles, WP-1/WP-2/...), a detected-human marker at its last known position, a hazard-zone marker (hatched area), a blocked-path marker.
- Sector/view selector (dropdown, e.g. "Sector B") and a "3D View" toggle button (can stay a disabled/"coming soon" button for v1 — no need to build actual 3D).
- Right rail: "Monocopter Location & Status" card — current X/Y/Z coordinates, current sector, flight mode (Autonomous/Manual), battery level (reuse the battery gauge/bar styling from Module 3 for consistency), signal strength (reuse Module 5's signal card styling), speed, altitude from ground.
- A map legend (mine tunnel line, flight path line, waypoint marker, detected-human marker, hazard-zone pattern, blocked-path marker, entrance/exit marker).
- Bottom row, three cards: "Sector Information" (name, avg depth, total tunnel length, mapped area, unexplored area), "Quick Actions" (Set Waypoint / Send Monocopter Here / Mark Hazard Zone / Add Note — buttons, can be inert/disabled for v1 since there's no monocopter to command yet), "Key Locations" table (type, name, distance, status — entrance/waypoints/hazards/detected humans as rows).

**Reuse:** the detected-human marker should pull from the same detection data Module 1 already has (`src/lib/detection-types.ts`) rather than inventing a separate shape for "a person was detected here." No real positioning system exists yet (see Module 5's note on GPS not working underground) — SLAM-estimated coordinates, but don't fabricate a precision GPS reading; frame it as inertial/SLAM-estimated position, consistent with Module 5's note on navigation.

- Stub: `src/pages/map-page.tsx`, `src/data/mock-map.ts`, `src/hooks/use-mock-map-feed.ts`, `src/components/map/`

### 8. Mission Status ✅

"What's happening now" (distinct from Module 11's past-mission log): phase badge (Idle / En Route / Searching / Returning / Complete) derived from objectives, real wall-clock elapsed timer (same pattern as Module 3's Mission Flight Time), current objective + sector + waypoint leg, objective checklist with progress bar. Objectives auto-advance one step per 30s and hold at Returning so the final return stays operator-owned.

- Page: `src/pages/mission-page.tsx` (routed as Sidebar → Mission)
- Components: `src/components/mission/mission-phase-card.tsx`, `mission-objectives-card.tsx`
- Data: `src/data/mock-mission.ts`, `src/hooks/use-mock-mission-feed.ts`
- Needs from backend: mission-planner / autonomy state (phase, objectives, start time).

**Purpose:** no PDF wireframe or highlight bullet for this one — just the section name. Reasonable scope for v1, open to revision when actually built:

**Planned content:**
- Mission phase badge (e.g. Idle / En Route / Searching / Returning / Complete).
- Elapsed mission time (can reuse the same real-wall-clock pattern as Module 3's "Mission Flight Time").
- Current objective / current waypoint or sector.
- An objective checklist with progress (e.g. "Reach Sector B" ✓, "Scan for survivors" ✓, "Return to base" ○).
- Consider whether this overlaps with Module 11 (Flight Path & Mission History) — Mission Status is "what's happening now," History is "what happened on past missions." Keep them distinct rather than merging.

- Stub: `src/pages/mission-page.tsx`, `src/data/mock-mission.ts`, `src/hooks/use-mock-mission-feed.ts`, `src/components/mission/`

### 9. Thermal View & Detection ✅

Built as the real Thermal tab inside Module 1's `VideoPanel` (per the spec — no duplicated video-panel/detection pattern, no separate route). `ThermalViewPanel` shows the MJPEG thermal stream when `detection-server/` serves `/thermal_feed`, otherwise an honest "Thermal camera not connected" state with wiring notes. `TemperatureLegend` (20–45°C ironbow bar, greyed with "no live data" caption while offline) + `ThermalDetectionsCard` (heat signatures with peak temp + confidence, honest empty state). Deliberately NO fake thermal filter over RGB. Standalone `thermal-page.tsx` exists with the same panels for later use.

- Page: `src/pages/thermal-page.tsx` (built, not separately routed — surface is Live Feed → Thermal Camera tab)
- Components: `src/components/thermal/thermal-view-panel.tsx`, `temperature-legend.tsx`, `thermal-detections-card.tsx`
- Data: `src/data/mock-thermal.ts` (`ThermalDetection` mirrors `DetectionEvent` + `peakTempC`, range + legend stops + future endpoints), `src/hooks/use-mock-thermal-feed.ts` (live 5s endpoint probe — offline until hardware is connected)
- Needs from hardware: thermal camera source + temperature-to-color mapping in `detection-server/` serving `/thermal_feed`, `/api/thermal/health`, `/api/thermal/current`, `/api/thermal/history`.

**Purpose:** thermal-camera counterpart to Module 1's RGB detection, once real thermal hardware exists.

**Likely composition:** Module 1's `VideoPanel` (`src/components/live-feed/video-panel.tsx`) already has an RGB/Thermal tab that currently shows an honest "Thermal camera not connected" placeholder. The straightforward path is to make that tab real (point it at a thermal stream + thermal-based detections) rather than building a whole separate page — avoid duplicating the video-panel/detection-card/history-table pattern Module 1 already has.

**Planned content, if/when there's a real thermal feed:**
- False-color heatmap video (same MJPEG-from-backend pattern `detection-server/` already uses for RGB — the backend would need a second camera source and a temperature-to-color mapping).
- A temperature-range legend (color gradient with min/max °C).
- Heat-signature detection markers with confidence, similar shape to `DetectionEvent` in `src/lib/detection-types.ts`.

Don't fake a thermal filter over RGB footage — that would misrepresent a sensor reading that doesn't exist. Keep the honest "not connected" state until real thermal hardware is wired in.

- Stub: `src/pages/thermal-page.tsx`, `src/data/mock-thermal.ts`, `src/hooks/use-mock-thermal-feed.ts`, `src/components/thermal/`

### 10. Communication & Connectivity ✅

Module 5's `SignalStrengthCard` expanded into a full third Monocopter tab (per the spec — no new route): link % + status, latency, packet-loss %, uplink/downlink rates, connection-quality history chart (recharts line with warning/danger reference lines, same pattern as Module 2/3), and a timestamped connection-events log (reconnect/weak/drop, edge-triggered on threshold crossings). Latency/loss/rates are signal-correlated derivations (see the `ponytail:` hook note).

- Page: `src/pages/communication-page.tsx` (rendered as a tab inside `monocopter-page.tsx`)
- Components: `src/components/communication/comms-overview-card.tsx`, `comms-quality-chart.tsx`, `comms-events-log.tsx`
- Data: `src/data/mock-communication.ts`, `src/hooks/use-mock-communication-feed.ts`
- Needs from backend: radio telemetry stream (RSSI/link %, latency, loss, rates, drop/reconnect events).

**Likely composition:** Module 5 (Monocopter Health) already has a `SignalStrengthCard` (`src/components/monocopter/signal-strength-card.tsx`) for the base-station comms link. This module is probably that card's fuller expansion, best added as a third tab on the Monocopter page rather than a new standalone route.

**Planned content:**
- Everything `SignalStrengthCard` already shows (link %, status), plus: latency, packet loss %, uplink/downlink data rate, and a connection-quality history chart over time (reuse the `recharts` line/area-with-reference-lines pattern from Module 2/3's trend charts).
- A connection-events log (link dropped / reconnected, timestamped) — similar shape to `DetectionEvent`'s history pattern.

- Stub: `src/pages/communication-page.tsx`, `src/data/mock-communication.ts`, `src/hooks/use-mock-communication-feed.ts`, `src/components/communication/`

### 11. Flight Path & Mission History ✅

Past-mission log, kept distinct from Module 8's "now": table of 4 seeded sessions (date, duration, detections, outcome) with click-to-select, detail card reusing Module 7's `MineMapSvg` for a static recorded-path replay (coverage % per session — no second map component), plus duration / distance / sectors / detections / alert count / outcome stats. Alert counts stay plain numbers until alert data is persisted (same caveat as Module 6).

- Page: `src/pages/history-page.tsx` (routed as Sidebar → History)
- Components: `src/components/history/history-table.tsx`, `history-detail-card.tsx` (reuses `src/components/map/mine-map-svg.tsx`)
- Data: `src/data/mock-history.ts`, `src/hooks/use-mock-history-feed.ts`
- Needs from backend: persisted mission store (sessions, recorded paths, per-session detection/alert refs).

**Purpose:** a log of *past* missions, distinct from Module 8's "what's happening right now."

**Planned content:**
- A list/table of past mission sessions: date, duration, distance covered, sectors visited, number of detections made, number of alerts triggered, outcome.
- Clicking a session could show its flight path replayed on a static map (reuse Module 7's map rendering once that exists, rather than building a second map component).
- Pairs naturally with Module 6 (Alerts) — a past mission's alert count could link to the specific `AlertEvent`s from that session, if alert data ends up persisted anywhere.

- Stub: `src/pages/history-page.tsx`, `src/data/mock-history.ts`, `src/hooks/use-mock-history-feed.ts`, `src/components/history/`

### 12. Rescue Intelligence & Recommended Actions ✅

Single prominent synthesis panel (not a feed — that distinction from Module 6 is enforced): victim location, contributing factors with source badges, and one plain-language recommended course of action (e.g. person + gas → "Do not send a rescue team without breathing apparatus … prioritize evacuation of Sector B"). Quiet "No active rescue situation" empty state — never fabricated. Design call resolved as "separate page reading the same alert data": both modules consume the shared alerts bus (`src/lib/alerts-bus.tsx`, mounted once in `App.tsx`), so there is one definition of "how bad is bad enough" (`overallAlertStatus`). Escalation rules: any unacknowledged danger → situation; detection sighting + gas warning → situation; otherwise null.

- Page: `src/pages/rescue-intel-page.tsx` (routed as Sidebar → Rescue)
- Components: `src/components/rescue-intel/rescue-situation-panel.tsx`, `no-situation-card.tsx`
- Data: `src/data/mock-rescue-intel.ts` (`RescueSituation` + pure `synthesizeRescueSituation`), `src/hooks/use-mock-rescue-intel-feed.ts` (bus + memo)
- Needs from backend: rescue recommendation service replacing the rules; persisted alert bus replacing the in-memory provider.

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
