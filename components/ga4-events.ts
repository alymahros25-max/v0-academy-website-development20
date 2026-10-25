"use client"

type AnalyticsEventParams = Record<string, string | number | boolean | undefined>

type AnalyticsEventName = "generate_lead" | "form_start" | "whatsapp_click" | "whatsapp_chat_start"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function trackGa4Event(name: AnalyticsEventName, params: AnalyticsEventParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return
  window.gtag("event", name, params)
}
