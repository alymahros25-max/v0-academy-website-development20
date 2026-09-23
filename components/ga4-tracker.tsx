"use client"

import { useCallback, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

const MEASUREMENT_ID = "G-XPT3R8M0EC"
const CONSENT_COOKIE = "analytics_consent"
const SCRIPT_ID = "ga4-gtag-script"
const LOAD_TIMEOUT_MS = 8000

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
    __ga4Loaded?: boolean
    __ga4LoadPromise?: Promise<boolean>
  }
}

function hasAnalyticsConsent() {
  return document.cookie.split(";").some((cookie) => cookie.trim() === `${CONSENT_COOKIE}=granted`)
}

function ensureGtagQueue() {
  window.dataLayer = window.dataLayer || []
  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => window.dataLayer.push(args)
  }
  if (!window.dataLayer.some((entry) => Array.isArray(entry) && entry[0] === "js")) {
    window.gtag("js", new Date())
    window.gtag("config", MEASUREMENT_ID, { send_page_view: false })
  }
}

function loadGoogleAnalytics(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false)
  if (window.__ga4Loaded) return Promise.resolve(true)
  if (window.__ga4LoadPromise) return window.__ga4LoadPromise

  ensureGtagQueue()
  window.__ga4LoadPromise = new Promise((resolve) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    const script = existing || document.createElement("script")
    let settled = false
    const finish = (loaded: boolean) => {
      if (settled) return
      settled = true
      window.__ga4Loaded = loaded
      if (!loaded) window.__ga4LoadPromise = undefined
      resolve(loaded)
    }

    const timeout = window.setTimeout(() => finish(false), LOAD_TIMEOUT_MS)
    script.addEventListener("load", () => {
      window.clearTimeout(timeout)
      finish(true)
    }, { once: true })
    script.addEventListener("error", () => {
      window.clearTimeout(timeout)
      script.remove()
      finish(false)
    }, { once: true })

    if (!existing) {
      script.id = SCRIPT_ID
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
      document.head.appendChild(script)
    }
  })

  return window.__ga4LoadPromise
}

async function sendFirstPartyPageView(pathname: string) {
  try {
    await fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      keepalive: true,
      body: JSON.stringify({
        pathname,
        page_title: document.title,
        referrer: document.referrer || undefined,
      }),
    })
  } catch {
    // The browser tracker remains available when the optional server fallback is not configured.
  }
}

export function GA4Tracker() {
  const pathname = usePathname()
  const trackedPaths = useRef(new Set<string>())

  const trackPageView = useCallback(async (path: string) => {
    if (!hasAnalyticsConsent() || trackedPaths.current.has(path)) return
    trackedPaths.current.add(path)

    // First-party fallback is independent of third-party script blockers.
    void sendFirstPartyPageView(path)

    const loaded = await loadGoogleAnalytics()
    if (loaded) {
      window.gtag?.("event", "page_view", {
        page_path: path,
        page_title: document.title,
      })
    }
  }, [])

  useEffect(() => {
    const handleConsentChange = (event: Event) => {
      if ((event as CustomEvent<boolean>).detail === true) void trackPageView(window.location.pathname)
    }

    window.addEventListener("analytics-consent-change", handleConsentChange)
    if (hasAnalyticsConsent()) void trackPageView(window.location.pathname)
    return () => window.removeEventListener("analytics-consent-change", handleConsentChange)
  }, [trackPageView])

  useEffect(() => {
    if (hasAnalyticsConsent()) void trackPageView(pathname)
  }, [pathname, trackPageView])

  return null
}

export { MEASUREMENT_ID }
