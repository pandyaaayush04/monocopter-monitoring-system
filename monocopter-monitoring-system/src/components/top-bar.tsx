import { useEffect, useState } from "react"
import { WifiHighIcon, UserIcon, GearIcon, SignOutIcon } from "@phosphor-icons/react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export function TopBar({ title, subtitle }: { title: string; subtitle: string }) {
  const now = useClock()
  const time = now.toLocaleTimeString("en-IN", { hour12: false })

  return (
    <header className="bg-background/95 sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b px-4 backdrop-blur supports-backdrop-filter:bg-background/70">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />

      <div className="min-w-0">
        <h1 className="truncate text-sm font-semibold">{title}</h1>
        <p className="text-muted-foreground truncate text-xs">{subtitle}</p>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="border-safe/30 bg-safe/10 text-safe hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium sm:flex">
          <WifiHighIcon weight="bold" className="size-3.5" />
          <span>Connected</span>
          <span className="text-safe/70 font-mono tabular-nums">{time}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="ring-offset-background focus-visible:ring-ring rounded-full focus-visible:ring-2 focus-visible:outline-none"
            >
              <Avatar className="size-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  OP
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <UserIcon />
              Operator profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <GearIcon />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <SignOutIcon />
              End session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
