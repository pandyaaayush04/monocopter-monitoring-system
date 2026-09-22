export type Status = "safe" | "warning" | "danger"

export const STATUS_LABEL: Record<Status, string> = {
  safe: "Safe",
  warning: "Warning",
  danger: "Danger",
}

export const STATUS_BADGE_CLASS: Record<Status, string> = {
  safe: "bg-safe/10 text-safe",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
}

export const STATUS_TEXT_CLASS: Record<Status, string> = {
  safe: "text-safe",
  warning: "text-warning",
  danger: "text-destructive",
}

export const STATUS_LINE_CLASS: Record<Status, string> = {
  safe: "var(--safe)",
  warning: "var(--warning)",
  danger: "var(--destructive)",
}

export const STATUS_BANNER_CLASS: Record<Status, string> = {
  safe: "bg-safe/10 text-safe border-safe/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  danger: "bg-destructive/10 text-destructive border-destructive/20",
}
