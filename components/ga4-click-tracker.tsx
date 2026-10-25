"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { trackGa4Event } from "@/components/ga4-events"

function isWhatsAppUrl(href: string) {
  try {
    const host = new URL(href, window.location.origin).hostname.toLowerCase()
    return host === "wa.me" || host.endsWith(".whatsapp.com") || host === "whatsapp.com"
  } catch {
    return false
  }
}

export function Ga4ClickTracker() {
  const pathname = usePathname() || "/"

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      const target = event.target
      if (!(target instanceof Element)) return
      const link = target.closest("a[href]")
      if (!(link instanceof HTMLAnchorElement) || !isWhatsAppUrl(link.href)) return

      trackGa4Event("whatsapp_click", {
        method: "whatsapp",
        location: pathname,
        link_text: (link.innerText || link.getAttribute("aria-label") || "WhatsApp").trim().slice(0, 80),
      })
    }

    document.addEventListener("click", onDocumentClick, true)
    return () => document.removeEventListener("click", onDocumentClick, true)
  }, [pathname])

  return null
}
