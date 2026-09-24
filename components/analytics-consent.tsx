"use client"

import { useEffect, useState } from "react"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const CONSENT_COOKIE = "analytics_consent"

function readConsent(): boolean | null {
  if (typeof document === "undefined") return null
  const value = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${CONSENT_COOKIE}=`))
    ?.split("=")[1]
  return value === "granted" ? true : value === "denied" ? false : null
}

export function AnalyticsConsent() {
  const [consent, setConsent] = useState<boolean | null>(null)

  useEffect(() => {
    setConsent(readConsent())
  }, [])

  const chooseConsent = (value: boolean) => {
    document.cookie = `${CONSENT_COOKIE}=${value ? "granted" : "denied"}; Max-Age=31536000; Path=/; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`
    window.dispatchEvent(new CustomEvent("analytics-consent-change", { detail: value }))
    setConsent(value)
  }

  return (
    <>
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
