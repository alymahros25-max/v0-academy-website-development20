"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { createWhatsAppMessage, getAnalyticsCountry, trackGa4Event } from "@/components/ga4-events"
import { createWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE_TEMPLATE_AR, DEFAULT_WHATSAPP_PHONE } from "@/lib/whatsapp"
import { getPublicWhatsAppSettings } from "@/lib/public-widgets-client"

function isWhatsAppUrl(href: string) {
  try {
    const host = new URL(href, window.location.origin).hostname.toLowerCase()
    return host === "wa.me" || host === "whatsapp.com" || host.endsWith(".whatsapp.com")
  } catch {
    return false
  }
}

function isTrialBooking(label: string, message: string) {
  return /حجز|احجز|تجريب|book.{0,20}trial|free trial|reserve|réserv|essai/i.test(`${label} ${message}`)
}

export function Ga4ClickTracker() {
  const pathname = usePathname() || "/"
  const country = getAnalyticsCountry(pathname)
  const [whatsAppSettings, setWhatsAppSettings] = useState({ phone: DEFAULT_WHATSAPP_PHONE, messageTemplateAr: DEFAULT_WHATSAPP_MESSAGE_TEMPLATE_AR })

  useEffect(() => {
    let active = true
    void getPublicWhatsAppSettings().then((settings) => { if (active) setWhatsAppSettings(settings) }).catch(() => undefined)
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (country) {
      trackGa4Event("view_country_page", { country, page_path: pathname })
    }
    if (pathname === "/quran" || pathname === "/arabic") {
      const program = pathname === "/quran" ? "quran" : "arabic"
      trackGa4Event("view_program_page", { program, page_path: pathname })
      trackGa4Event("view_pricing_page", { program, page_path: pathname })
    }
  }, [country, pathname])

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      const target = event.target
      if (!(target instanceof Element)) return
      const link = target.closest("a[href]")
      if (!(link instanceof HTMLAnchorElement)) return

      const label = (link.innerText || link.getAttribute("aria-label") || "").trim().slice(0, 80)
      const pagePath = window.location.pathname

      if (isWhatsAppUrl(link.href)) {
        let message = ""
        try {
          message = new URL(link.href).searchParams.get("text") ?? ""
        } catch {
          // Keep the existing destination if it is not a valid absolute URL.
        }

        const currentCountry = getAnalyticsCountry(pagePath)
        const messageText = createWhatsAppMessage(currentCountry, whatsAppSettings.messageTemplateAr)
        link.href = createWhatsAppUrl(whatsAppSettings.phone, messageText)

        trackGa4Event("whatsapp_click", {
          method: "whatsapp",
          page_path: pagePath,
          country: currentCountry,
          link_text: label || "WhatsApp",
        })
        if (isTrialBooking(label, message)) {
          trackGa4Event("book_trial_click", {
            method: "whatsapp",
            page_path: pagePath,
            country: currentCountry,
          })
        }
        return
      }

      const href = link.href.toLowerCase()
      if (href.startsWith("mailto:")) {
        trackGa4Event("email_click", { page_path: pagePath })
        return
      }

      try {
        const host = new URL(link.href).hostname.toLowerCase()
        if (host === "t.me" || host === "telegram.me" || host.endsWith(".telegram.org")) {
          trackGa4Event("telegram_click", { page_path: pagePath })
        }
      } catch {
        // Ignore malformed and non-navigation links.
      }
    }

    document.addEventListener("click", onDocumentClick, true)
    return () => document.removeEventListener("click", onDocumentClick, true)
  }, [pathname, whatsAppSettings])

  return null
}
