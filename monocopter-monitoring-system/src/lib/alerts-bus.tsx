import { createContext, useContext, type ReactNode } from "react"

import { useMockAlertsFeed } from "@/hooks/use-mock-alerts-feed"

type AlertsBus = ReturnType<typeof useMockAlertsFeed>

const AlertsBusContext = createContext<AlertsBus | null>(null)

/**
 * Shared alerts bus (resolves Module 6's open design call): Modules 6 and
 * 12 read the SAME live alert stream, so there is exactly one definition
 * of "how bad is bad enough" (see overallAlertStatus in mock-alerts.ts).
 * Mount once in App.tsx — never instantiate useMockAlertsFeed directly in
 * a page, always consume useAlertsBus().
 */
export function AlertsProvider({ children }: { children: ReactNode }) {
  const bus = useMockAlertsFeed()
  return <AlertsBusContext.Provider value={bus}>{children}</AlertsBusContext.Provider>
}

export function useAlertsBus(): AlertsBus {
  const bus = useContext(AlertsBusContext)
  if (!bus) throw new Error("useAlertsBus must be used inside <AlertsProvider>")
  return bus
}
