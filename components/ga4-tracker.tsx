"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

const MEASUREMENT_ID = "G-XPT3R8M0EC"
const CONSENT_COOKIE = "analytics_consent"

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function hasAnalyticsConsent() {
  return document.cookie
    .split(";")
    .some((cookie) => cookie.trim().startsWith(`${CONSENT_COOKIE}=granted`))
}

function loadGoogleAnalytics() {
  if (typeof window === "undefined") return
  if (window.gtag) return

  window.dataLayer = window.dataLayer || []
  window.gtag = (...args: unknown[]) => window.dataLayer.push(args)
  window.gtag("js", new Date())
  window.gtag("config", MEASUREMENT_ID, { send_page_view: false })

  if (document.querySelector(`script[data-ga4="${MEASUREMENT_ID}"]`)) return
  const script = document.createElement("script")
  script.async = true
  script.dataset.ga4 = MEASUREMENT_ID
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)
}

export function GA4Tracker() {
  const pathname = usePathname()
  const hasSentInitialPageView = useRef(false)

  useEffect(() => {
    const sendPageView = () => {
      if (!hasAnalyticsConsent()) return
      loadGoogleAnalytics()
      window.gtag?.("event", "page_view", {
        page_path: window.location.pathname,
        page_title: document.title,
      })
      hasSentInitialPageView.current = true
    }

    const handleConsentChange = (event: Event) => {
      if ((event as CustomEvent<boolean>).detail === true) sendPageView()
    }

    window.addEventListener("analytics-consent-change", handleConsentChange)
    if (hasAnalyticsConsent() && !hasSentInitialPageView.current) sendPageView()

    return () => window.removeEventListener("analytics-consent-change", handleConsentChange)
  }, [])

  useEffect(() => {
    if (!hasSentInitialPageView.current || !hasAnalyticsConsent()) return
    window.gtag?.("event", "page_view", {
      page_path: pathname,
      page_title: document.title,
    })
  }, [pathname])

  return null
}

export { MEASUREMENT_ID }
