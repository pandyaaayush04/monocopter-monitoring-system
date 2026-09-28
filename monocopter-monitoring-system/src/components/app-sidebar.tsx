import {
  VideoCameraIcon,
  MapTrifoldIcon,
  WindIcon,
  DroneIcon,
  ClipboardTextIcon,
  BellIcon,
  ClockCounterClockwiseIcon,
  SirenIcon,
  GlobeIcon,
} from "@phosphor-icons/react"

import { MinewatchMark } from "@/components/minewatch-mark"

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
  { key: "map", title: "Map", icon: MapTrifoldIcon, enabled: true },
  { key: "environment", title: "Environment", icon: WindIcon, enabled: true },
  { key: "monocopter", title: "Monocopter", icon: DroneIcon, enabled: true },
  { key: "mission", title: "Mission", icon: ClipboardTextIcon, enabled: true },
  { key: "alerts", title: "Alerts", icon: BellIcon, enabled: true },
  { key: "history", title: "History", icon: ClockCounterClockwiseIcon, enabled: true },
  { key: "rescue", title: "Rescue", icon: SirenIcon, enabled: true },
]

export function AppSidebar({
  page,
  onNavigate,
  onBackToSite,
}: {
  page: PageKey
  onNavigate: (page: PageKey) => void
  onBackToSite?: () => void
}) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="items-center py-4">
        <div className="flex items-center gap-2 px-2 group-data-[collapsible=icon]:px-0">
          <div className="flex size-9 shrink-0 items-center justify-center">
            <MinewatchMark className="size-8" />
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
        {onBackToSite && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={onBackToSite} tooltip="Back to site">
                <GlobeIcon />
                <span>Site</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
