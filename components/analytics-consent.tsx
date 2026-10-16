"use client"

import { useEffect, useState } from "react"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GoogleAnalytics } from "@next/third-parties/google"

const CONSENT_COOKIE = "analytics_consent"
const CONSENT_STORAGE_KEY = "analytics_consent"

type ConsentValue = "granted" | "denied"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function readConsent(): boolean | null {
  if (typeof window === "undefined") return null

  const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY)
  if (stored === "granted" || stored === "denied") return stored === "granted"

  const cookie = document.cookie
    .split("; ")
    .find((value) => value.startsWith(`${CONSENT_COOKIE}=`))
    ?.split("=")[1]

  return cookie === "granted" ? true : cookie === "denied" ? false : null
}

function updateGoogleConsent(value: ConsentValue) {
  window.gtag?.("consent", "update", {
    ad_storage: value,
    analytics_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  })
}

export function AnalyticsConsent() {
  const [consent, setConsent] = useState<boolean | null>(null)
  const [googleAnalyticsReady, setGoogleAnalyticsReady] = useState(false)

  useEffect(() => {
    type IdleWindow = Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number
      cancelIdleCallback?: (handle: number) => void
    }

    const idleWindow = window as IdleWindow
    let idleHandle: number | undefined
    let fallbackHandle: number | undefined
    let loadFallbackHandle: number | undefined
    let disposed = false
    let scheduled = false

    const scheduleAnalytics = () => {
      if (disposed || scheduled) return
      scheduled = true
      if (loadFallbackHandle !== undefined) window.clearTimeout(loadFallbackHandle)

      const markReady = () => {
        if (!disposed) setGoogleAnalyticsReady(true)
      }

      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(markReady, { timeout: 2000 })
      } else {
        fallbackHandle = window.setTimeout(markReady, 750)
      }
    }

    if (document.readyState === "complete") {
      scheduleAnalytics()
    } else {
      window.addEventListener("load", scheduleAnalytics, { once: true })
      loadFallbackHandle = window.setTimeout(scheduleAnalytics, 2500)
    }

    return () => {
      disposed = true
      window.removeEventListener("load", scheduleAnalytics)
      if (idleHandle !== undefined) idleWindow.cancelIdleCallback?.(idleHandle)
      if (fallbackHandle !== undefined) window.clearTimeout(fallbackHandle)
      if (loadFallbackHandle !== undefined) window.clearTimeout(loadFallbackHandle)
    }
  }, [])

  useEffect(() => {
    const savedConsent = readConsent()
    setConsent(savedConsent)
    if (savedConsent !== null) updateGoogleConsent(savedConsent ? "granted" : "denied")
  }, [])

  const chooseConsent = (value: boolean) => {
    const consentValue: ConsentValue = value ? "granted" : "denied"
    const secure = window.location.protocol === "https:" ? "; Secure" : ""

    window.localStorage.setItem(CONSENT_STORAGE_KEY, consentValue)
    document.cookie = `${CONSENT_COOKIE}=${consentValue}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`
    updateGoogleConsent(consentValue)
    window.dispatchEvent(new CustomEvent("analytics-consent-change", { detail: value }))
    setConsent(value)
  }

  return (
    <>
      {googleAnalyticsReady && <GoogleAnalytics gaId="G-XPT3R8M0EC" />}
      {consent === true && <><Analytics /><SpeedInsights /></>}
      {consent === null && (
        <aside className="fixed bottom-3 right-3 left-3 z-50 mx-auto flex max-w-lg flex-col gap-3 rounded-2xl border border-border/80 bg-background/95 p-3 text-sm text-foreground shadow-md backdrop-blur sm:bottom-5 sm:right-5 sm:left-auto sm:p-4">
          <p className="leading-6 text-muted-foreground">نستخدم Google Analytics وMicrosoft Clarity لفهم استخدام الموقع وتحسين الأداء. يمكنك القبول أو الرفض في أي وقت.</p>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => chooseConsent(true)} className="order-first rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground transition-transform active:scale-95">قبول</button>
            <button type="button" onClick={() => chooseConsent(false)} className="rounded-md border border-border px-4 py-2 transition-colors hover:bg-muted active:scale-95">رفض</button>
          </div>
        </aside>
      )}
    </>
  )
}
