export type PageKey =
  | "live-feed"
  | "map"
  | "environment"
  | "monocopter"
  | "mission"
  | "alerts"
  | "history"

export const PAGE_META: Record<PageKey, { title: string; subtitle: string }> = {
  "live-feed": {
    title: "Live Camera Feed & Human Detection",
    subtitle: "Underground Mine Safety, Monitoring and Rescue System",
  },
  environment: {
    title: "Gas Trends & Environment Insights",
    subtitle: "Live sensor readings, trend history and risk status",
  },
  map: { title: "Live Mine Mapping & Monocopter Location", subtitle: "" },
  monocopter: { title: "Monocopter Health", subtitle: "System readiness, signal strength and battery telemetry" },
  mission: { title: "Mission Status", subtitle: "" },
  alerts: { title: "Actionable Alerts", subtitle: "" },
  history: { title: "Flight Path & Mission History", subtitle: "" },
}
