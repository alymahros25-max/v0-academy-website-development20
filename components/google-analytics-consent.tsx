"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { configureGoogleAnalytics, GA_MEASUREMENT_ID, loadGoogleAnalytics, sendGoogleAnalyticsPageView } from "@/components/google-analytics-loader"

const CONSENT_KEY = "analytics_consent"
const CONSENT_EXPIRY_KEY = `${CONSENT_KEY}_expires_at`
const CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 180

type ConsentChoice = "unknown" | "granted" | "denied"

declare global {
  interface Window {
    dataLayer?: unknown[][]
    gtag?: (...args: unknown[]) => void
    __ga4ScriptLoaded?: boolean
    __ga4ScriptPromise?: Promise<boolean>
  }
}

const text = {
  title: "نحترم خصوصيتك",
  message: "نستخدم Google Analytics لقياس الزيارات وتحسين تجربة الموقع.",
  privacy: "تفاصيل الخصوصية",
  accept: "قبول",
  reject: "رفض",
  region: "اختيار تحليلات الزيارة",
}

function getSavedConsent(): ConsentChoice {
  try {
    const stored = window.localStorage.getItem(CONSENT_KEY)
    const expiresAt = Number(window.localStorage.getItem(CONSENT_EXPIRY_KEY))
    if ((stored === "granted" || stored === "denied") && expiresAt > Date.now()) return stored
    if (stored === "granted" || stored === "denied") {
      window.localStorage.removeItem(CONSENT_KEY)
      window.localStorage.removeItem(CONSENT_EXPIRY_KEY)
    }
  } catch {
    // Continue to the first-party cookie if localStorage is unavailable.
  }

  const cookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${CONSENT_KEY}=`))

  if (cookie === `${CONSENT_KEY}=granted`) return "granted"
  if (cookie === `${CONSENT_KEY}=denied`) return "denied"
  return "unknown"
}

function saveConsent(choice: Exclude<ConsentChoice, "unknown">) {
  const expiresAt = Date.now() + CONSENT_COOKIE_MAX_AGE * 1000
  try {
    window.localStorage.setItem(CONSENT_KEY, choice)
    window.localStorage.setItem(CONSENT_EXPIRY_KEY, String(expiresAt))
  } catch {
    // The consent cookie remains as a fallback when localStorage is unavailable.
  }

  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${CONSENT_KEY}=${choice}; Max-Age=${CONSENT_COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`
}

function clearGoogleAnalyticsCookies() {
  const names = document.cookie
    .split(";")
    .map((item) => item.trim().split("=")[0])
    .filter((name) => name === "_ga" || name === "_gid" || name === "_gat" || name.startsWith("_ga_"))
  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  const onAcademyDomain = window.location.hostname === "quran-elhafez.com" || window.location.hostname.endsWith(".quran-elhafez.com")
  const domain = onAcademyDomain ? "; Domain=.quran-elhafez.com" : ""

  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${secure}`
    if (domain) document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain}${secure}`
  }
}

function stopGoogleAnalytics() {
  window.gtag?.("consent", "update", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  })
  clearGoogleAnalyticsCookies()
  document.querySelector(`script[data-ga-consent="${GA_MEASUREMENT_ID}"]`)?.remove()
  delete window.gtag
  delete window.dataLayer
  delete window.__ga4ScriptLoaded
  delete window.__ga4ScriptPromise
}

export function GoogleAnalyticsConsent() {
  const pathname = usePathname() || "/"
  const [choice, setChoice] = useState<ConsentChoice>("unknown")
  const [ready, setReady] = useState(false)
  const [bannerOpen, setBannerOpen] = useState(false)
  const configured = useRef(false)

  useEffect(() => {
    const saved = getSavedConsent()
    setChoice(saved)
    setBannerOpen(saved === "unknown")
    setReady(true)

    const openSettings = () => setBannerOpen(true)
    window.addEventListener("analytics:open-settings", openSettings)
    return () => window.removeEventListener("analytics:open-settings", openSettings)
  }, [])

  useEffect(() => {
    if (!ready) return

    if (choice !== "granted") {
      if (choice === "denied" && configured.current) {
        stopGoogleAnalytics()
        configured.current = false
      }
      return
    }

    let cancelled = false
    void loadGoogleAnalytics().then((loaded) => {
      if (!loaded || cancelled || choice !== "granted") {
        if (!loaded) console.warn("Google Analytics could not load; no analytics event was sent.")
        return
      }
      if (!configured.current) {
        configureGoogleAnalytics()
        configured.current = true
      }
      sendGoogleAnalyticsPageView(pathname)
    })
    return () => {
      cancelled = true
    }
  }, [choice, pathname, ready])

  function choose(choice: Exclude<ConsentChoice, "unknown">) {
    saveConsent(choice)
    setChoice(choice)
    setBannerOpen(false)
  }

  if (!ready || !bannerOpen) return null

  return (
    <aside
      aria-label={text.region}
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-[80] rounded-none border border-[#e0e5de] bg-white/95 p-4 text-start shadow-[0_14px_42px_rgba(17,42,31,0.18)] backdrop-blur-sm sm:bottom-4 sm:left-1/4 sm:right-1/4 sm:rounded-2xl sm:p-4"
    >
      <p className="text-center text-base font-extrabold leading-5 text-[#174d3a] sm:text-lg">{text.title}</p>
      <p className="mx-auto mt-1 max-w-3xl text-center text-xs leading-5 text-[#56645c] sm:text-sm">
        {text.message}{" "}
        <a className="font-semibold text-[#315f4a] underline decoration-[#a9b9ad] underline-offset-2" href="/privacy">
          {text.privacy}
        </a>
      </p>
      <div className="mt-3 flex items-center gap-4" dir="rtl">
        <button
          className="min-h-10 flex-[2] rounded-lg bg-[#174d3a] px-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#103a2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174d3a] sm:text-sm"
          onClick={() => choose("granted")}
          type="button"
        >
          {text.accept}
        </button>
        <button
          className="min-h-10 min-w-[4.75rem] rounded-lg border border-[#cfd8d1] bg-white px-3 text-xs font-bold text-[#26352d] transition hover:bg-[#f4f7f3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174d3a] sm:text-sm"
          onClick={() => choose("denied")}
          type="button"
        >
          {text.reject}
        </button>
      </div>
    </aside>
  )
}
