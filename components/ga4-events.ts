"use client"

const CONSENT_COOKIE = "analytics_consent"
const CONSENT_STORAGE_KEY = "analytics_consent"
const CONSENT_EXPIRY_KEY = "analytics_consent_expires_at"

export type GA4EventName =
  | "form_start"
  | "generate_lead"
  | "whatsapp_click"
  | "whatsapp_chat_start"
  | "country_suggestion_shown"
  | "country_suggestion_yes"
  | "country_suggestion_no"
  | "usd_pricing_quran_click"
  | "usd_pricing_arabic_click"

type GA4EventParams = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function hasAnalyticsConsent() {
  if (typeof window === "undefined") return false

  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    const expiresAt = Number(window.localStorage.getItem(CONSENT_EXPIRY_KEY))
    if (expiresAt > Date.now()) {
      if (stored === "granted") return true
      if (stored === "denied") return false
    }
  } catch {
    // Fall back to the first-party consent cookie.
  }

  return document.cookie
    .split(";")
    .some((cookie) => cookie.trim() === `${CONSENT_COOKIE}=granted`)
}

export function trackGA4Event(name: GA4EventName, params: GA4EventParams = {}) {
  if (!hasAnalyticsConsent()) return

  window.gtag?.("event", name, params)
}
