import type { Status } from "@/lib/status"

export type EnvKey = "temperature" | "humidity"
export type EnvPoint = { t: number; value: number }

export type EnvConfig = {
  key: EnvKey
  label: string
  unit: string
  start: number
  volatility: number
  statusFor: (value: number) => Status
  interpretation: Record<Status, string>
}

export const ENV_CONFIG: Record<EnvKey, EnvConfig> = {
  temperature: {
    key: "temperature",
    label: "Ambient Temperature",
    unit: "°C",
    start: 24,
    volatility: 0.4,
    statusFor: (v) => (v > 35 || v < 10 ? "danger" : v > 28 || v < 15 ? "warning" : "safe"),
    interpretation: {
      safe: "Temperature is within normal operating range. No action needed.",
      warning: "Temperature is elevated — ventilation may be reduced. Monitor closely.",
      danger: "Extreme temperature — high risk of heat stress for personnel. Consider evacuation.",
    },
  },
  humidity: {
    key: "humidity",
    label: "Relative Humidity",
    unit: "%",
    start: 55,
    volatility: 1.2,
    statusFor: (v) => (v > 90 || v < 15 ? "danger" : v > 70 || v < 30 ? "warning" : "safe"),
    interpretation: {
      safe: "Humidity is within normal operating range. No action needed.",
      warning: "Humidity trending outside normal range — watch for condensation on equipment.",
      danger: "Critical humidity level — equipment reliability and visibility may be severely impacted.",
    },
  },
}

const SERIES_LENGTH = 20

export function seedEnvSeries(cfg: EnvConfig): EnvPoint[] {
  const points: EnvPoint[] = []
  let value = cfg.start
  const now = Date.now()
  for (let i = SERIES_LENGTH - 1; i >= 0; i--) {
    value = walkEnv(value, cfg)
    points.push({ t: now - i * 3000, value: Number(value.toFixed(1)) })
  }
  return points
}

export function walkEnv(value: number, cfg: EnvConfig): number {
  return value + (Math.random() - 0.5) * cfg.volatility
}
