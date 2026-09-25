"use client"

import { useEffect, useState } from "react"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

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
      {consent === true && <><Analytics /><SpeedInsights /></>}
      {consent === null && (
        <aside className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-xl flex-col gap-3 rounded-xl border border-border bg-background p-4 text-sm text-foreground shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <p className="leading-6">نستخدم Google Analytics وMicrosoft Clarity لفهم استخدام الموقع وتحسين الأداء وتجربة المستخدم. يمكنك القبول أو الرفض.</p>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={() => chooseConsent(false)} className="rounded-md border border-border px-3 py-2">رفض</button>
            <button type="button" onClick={() => chooseConsent(true)} className="rounded-md bg-primary px-3 py-2 text-primary-foreground">قبول</button>
          </div>
        </aside>
      )}
    </>
  )
}
