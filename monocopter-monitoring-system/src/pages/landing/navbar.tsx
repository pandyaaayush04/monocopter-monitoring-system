import { useState } from "react"
import { ArrowRightIcon, ListIcon, MoonIcon, SignOutIcon, SunIcon } from "@phosphor-icons/react"

import { MinewatchMark } from "@/components/minewatch-mark"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"

const LINKS = [
  { label: "Home", href: "#top" },
  { label: "System", href: "#system" },
  { label: "Features", href: "#features" },
  { label: "Technology", href: "#technology" },
  { label: "Live Mission", href: "#live" },
  { label: "About", href: "#about" },
]

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function Navbar({
  onExplore,
  theme,
  onToggleTheme,
  onOpenAuth,
}: {
  onExplore: () => void
  theme: "dark" | "light"
  onToggleTheme: () => void
  onOpenAuth: (mode: "login" | "register") => void
}) {
  const [open, setOpen] = useState(false)
  const { user, status, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-transparent bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <MinewatchMark className="h-8 w-8" />
          <span className="flex flex-col leading-none">
            <span className="font-heading text-sm font-semibold tracking-wide">MINEWATCH</span>
            <span className="text-muted-foreground text-[10px] tracking-[0.14em]">SEE DEEPER. SAVE LIVES.</span>
          </span>
        </a>

        <nav className="ml-8 hidden items-center gap-6 lg:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </Button>
          {status === "signed-in" && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hidden items-center gap-2 sm:inline-flex" aria-label="Account menu">
                  <Avatar size="sm">
                    <AvatarFallback>{initialsOf(user.name)}</AvatarFallback>
                  </Avatar>
                  <span className="max-w-28 truncate">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} variant="destructive">
                  <SignOutIcon /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" onClick={() => onOpenAuth("login")} className="hidden sm:inline-flex">
              Login
            </Button>
          )}
          <Button onClick={onExplore} className="hidden sm:inline-flex">
            {status === "signed-in" ? "Explore System" : "Get Started"}
            <ArrowRightIcon />
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                <ListIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col gap-1 pt-12">
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  {l.label}
                </a>
              ))}
              {status === "signed-in" && user ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false)
                    logout()
                  }}
                  className="mt-4"
                >
                  <SignOutIcon /> Sign out ({user.name})
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false)
                    onOpenAuth("login")
                  }}
                  className="mt-4"
                >
                  Login
                </Button>
              )}
              <Button
                onClick={() => {
                  setOpen(false)
                  onExplore()
                }}
              >
                {status === "signed-in" ? "Explore System" : "Get Started"}
                <ArrowRightIcon />
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
