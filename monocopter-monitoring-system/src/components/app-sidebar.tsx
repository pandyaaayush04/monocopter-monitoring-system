import {
  VideoCameraIcon,
  MapTrifoldIcon,
  WindIcon,
  DroneIcon,
  ClipboardTextIcon,
  BellIcon,
  ClockCounterClockwiseIcon,
} from "@phosphor-icons/react"

import { MonocopterMark } from "@/components/monocopter-mark"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { PageKey } from "@/lib/pages"

const NAV: Array<{ key: PageKey; title: string; icon: typeof VideoCameraIcon; enabled: boolean }> = [
  { key: "live-feed", title: "Live Feed", icon: VideoCameraIcon, enabled: true },
  { key: "map", title: "Map", icon: MapTrifoldIcon, enabled: false },
  { key: "environment", title: "Environment", icon: WindIcon, enabled: true },
  { key: "monocopter", title: "Monocopter", icon: DroneIcon, enabled: true },
  { key: "mission", title: "Mission", icon: ClipboardTextIcon, enabled: false },
  { key: "alerts", title: "Alerts", icon: BellIcon, enabled: false },
  { key: "history", title: "History", icon: ClockCounterClockwiseIcon, enabled: false },
]

export function AppSidebar({
  page,
  onNavigate,
}: {
  page: PageKey
  onNavigate: (page: PageKey) => void
}) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="items-center py-4">
        <div className="flex items-center gap-2 px-2 group-data-[collapsible=icon]:px-0">
          <div className="smooth-shadow-ring-xs flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MonocopterMark className="size-5.5" />
          </div>
          <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-heading text-sm font-semibold">Mine Rescue</span>
            <span className="text-muted-foreground text-xs">Ops Console</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={page === item.key}
                    disabled={!item.enabled}
                    onClick={() => item.enabled && onNavigate(item.key)}
                    tooltip={item.enabled ? item.title : `${item.title} — coming soon`}
                  >
                    <item.icon weight={page === item.key ? "fill" : "regular"} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {!item.enabled && (
                    <SidebarMenuBadge className="text-muted-foreground/60 text-[10px] font-normal">
                      soon
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="pb-4">
        <p className="text-muted-foreground/70 px-2 text-[11px] leading-tight group-data-[collapsible=icon]:hidden">
          Safer Mines, Brighter Tomorrows
        </p>
      </SidebarFooter>
    </Sidebar>
  )
}
