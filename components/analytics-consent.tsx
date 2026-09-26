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
  const [showSettings, setShowSettings] = useState(false)

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
        <aside
          dir="rtl"
          aria-label="إعدادات الخصوصية والتحليلات"
          className="fixed bottom-3 right-3 left-3 z-50 mx-auto max-w-xl rounded-2xl border border-border/80 bg-background/95 p-4 text-sm text-foreground shadow-2xl backdrop-blur sm:bottom-5 sm:right-5 sm:left-auto sm:p-5"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden="true">
              <span className="text-lg">✓</span>
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-foreground">خصوصيتك مهمة لنا</h2>
              <p className="mt-1 leading-6 text-muted-foreground">
                نستخدم أدوات تحليل وقياس لتحسين أداء الموقع وتجربة الزوار. يمكنك قبول التحليلات أو رفضها، ولن يؤثر اختيارك على استخدام الموقع.
              </p>
            </div>
          </div>
          {showSettings && (
            <div className="mt-3 rounded-xl border border-border bg-muted/40 p-3 leading-6 text-muted-foreground">
              تشمل أدوات القياس Google Analytics وMicrosoft Clarity وVercel Analytics وSpeed Insights. لا تعمل هذه الأدوات قبل موافقتك.
            </div>
          )}
          <div className="mt-4 flex flex-wrap items-center justify-start gap-2">
            <button
              type="button"
              onClick={() => chooseConsent(true)}
              className="rounded-lg bg-primary px-5 py-2.5 font-bold text-primary-foreground shadow-sm transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-95"
            >
              موافقة
            </button>
            <button
              type="button"
              onClick={() => chooseConsent(false)}
              className="rounded-lg border border-border bg-background px-5 py-2.5 font-semibold text-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/30 active:scale-95"
            >
              رفض
            </button>
            <button
              type="button"
              onClick={() => setShowSettings((value) => !value)}
              aria-expanded={showSettings}
              className="rounded-lg px-3 py-2.5 font-medium text-primary underline-offset-4 transition hover:underline focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              إدارة الإعدادات
            </button>
          </div>
        </aside>
      )}
    </>
  )
}
