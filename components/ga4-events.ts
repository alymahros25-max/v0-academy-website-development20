"use client"

const CONSENT_COOKIE = "analytics_consent"
const CONSENT_STORAGE_KEY = "analytics_consent"

export type GA4EventName = "form_start" | "generate_lead" | "whatsapp_click" | "whatsapp_chat_start"

type GA4EventParams = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function hasAnalyticsConsent() {
  if (typeof window === "undefined") return false

  const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY)
  if (stored === "granted") return true
  if (stored === "denied") return false

  return document.cookie
    .split(";")
    .some((cookie) => cookie.trim() === `${CONSENT_COOKIE}=granted`)
}

export function trackGA4Event(name: GA4EventName, params: GA4EventParams = {}) {
  if (!hasAnalyticsConsent()) return

  window.gtag?.("event", name, params)
}
