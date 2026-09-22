import { useState } from "react"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { LiveFeedPage } from "@/pages/live-feed-page"
import { EnvironmentPage } from "@/pages/environment-page"
import { MonocopterPage } from "@/pages/monocopter-page"
import { PAGE_META, type PageKey } from "@/lib/pages"

export default function App() {
  const [page, setPage] = useState<PageKey>("live-feed")
  const meta = PAGE_META[page]

  return (
    <TooltipProvider delayDuration={200}>
      <SidebarProvider>
        <AppSidebar page={page} onNavigate={setPage} />
        <SidebarInset>
          <TopBar title={meta.title} subtitle={meta.subtitle} />
          {page === "live-feed" && <LiveFeedPage />}
          {page === "environment" && <EnvironmentPage />}
          {page === "monocopter" && <MonocopterPage />}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
