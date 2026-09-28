import { useState } from "react"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { LiveFeedPage } from "@/pages/live-feed-page"
import { EnvironmentPage } from "@/pages/environment-page"
import { MonocopterPage } from "@/pages/monocopter-page"
import { AlertsPage } from "@/pages/alerts-page"
import { MapPage } from "@/pages/map-page"
import { MissionPage } from "@/pages/mission-page"
import { HistoryPage } from "@/pages/history-page"
import { RescueIntelPage } from "@/pages/rescue-intel-page"
import { LandingPage } from "@/pages/landing/landing-page"
import { AlertsProvider } from "@/lib/alerts-bus"
import { AuthProvider } from "@/lib/auth-context"
import { ErrorBoundary } from "@/components/error-boundary"
import { PAGE_META, type PageKey } from "@/lib/pages"

function AppShell() {
  const [view, setView] = useState<"site" | "console">("site")
  const [page, setPage] = useState<PageKey>("live-feed")
  const meta = PAGE_META[page]

  if (view === "site") {
    return <LandingPage onExplore={() => setView("console")} />
  }

  return (
    <TooltipProvider delayDuration={200}>
      <AlertsProvider>
      <SidebarProvider>
        <AppSidebar page={page} onNavigate={setPage} onBackToSite={() => setView("site")} />
        <SidebarInset>
          <TopBar title={meta.title} subtitle={meta.subtitle} />
          {page === "live-feed" && <LiveFeedPage />}
          {page === "environment" && <EnvironmentPage />}
          {page === "monocopter" && <MonocopterPage />}
          {page === "alerts" && <AlertsPage />}
          {page === "map" && <MapPage />}
          {page === "mission" && <MissionPage />}
          {page === "history" && <HistoryPage />}
          {page === "rescue" && <RescueIntelPage />}
        </SidebarInset>
      </SidebarProvider>
      </AlertsProvider>
    </TooltipProvider>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ErrorBoundary>
  )
}
