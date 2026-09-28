export type PageKey =
  | "live-feed"
  | "map"
  | "environment"
  | "monocopter"
  | "mission"
  | "alerts"
  | "history"
  | "rescue"

export const PAGE_META: Record<PageKey, { title: string; subtitle: string }> = {
  "live-feed": {
    title: "Live Camera Feed & Human Detection",
    subtitle: "Underground Mine Safety, Monitoring and Rescue System",
  },
  environment: {
    title: "Gas Trends & Environment Insights",
    subtitle: "Live sensor readings, trend history and risk status",
  },
  map: { title: "Live Mine Mapping & Monocopter Location", subtitle: "SLAM map, position estimate and key locations" },
  monocopter: { title: "Monocopter Health", subtitle: "System readiness, signal strength and battery telemetry" },
  mission: { title: "Mission Status", subtitle: "Current phase, elapsed time and objectives" },
  alerts: { title: "Actionable Alerts", subtitle: "Severity, source and recommended action for every event" },
  history: { title: "Flight Path & Mission History", subtitle: "Past missions and recorded flight paths" },
  rescue: { title: "Rescue Intelligence & Recommended Actions", subtitle: "Highest-priority situation and what to do" },
}
