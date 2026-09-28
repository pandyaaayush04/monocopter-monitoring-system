import { useEffect, useState } from "react"
import { ArrowUpIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"

const SHOW_AFTER_PX = 600

/** Floating back-to-top control with a smooth appear + smooth scroll. */
export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function scrollTop() {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    window.scrollTo({ top: 0, behavior })
  }

  return (
    <Button
      size="icon"
      onClick={scrollTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      className={`fixed right-6 bottom-6 z-40 rounded-full shadow-lg transition-all duration-300 ${
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-3 scale-95 opacity-0"
      }`}
    >
      <ArrowUpIcon weight="bold" />
    </Button>
  )
}
