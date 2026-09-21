"use client"

import { useEffect } from "react"
import Clarity from "@microsoft/clarity"

const CONSENT_COOKIE = "analytics_consent"
const PROJECT_ID = "ylvf05htdn"

function hasAnalyticsConsent() {
  return document.cookie.split(";").some((cookie) => cookie.trim() === `${CONSENT_COOKIE}=granted`)
}

function startClarity() {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return
  const state = window as typeof window & { __clarityInitialized?: boolean }
  if (state.__clarityInitialized) return

  Clarity.init(PROJECT_ID)
  Clarity.consentV2({ ad_Storage: "denied", analytics_Storage: "granted" })
  state.__clarityInitialized = true
}

export function ClarityTracker() {
  useEffect(() => {
    const handleConsentChange = (event: Event) => {
      if ((event as CustomEvent<boolean>).detail === true) startClarity()
    }

    window.addEventListener("analytics-consent-change", handleConsentChange)
    startClarity()
    return () => window.removeEventListener("analytics-consent-change", handleConsentChange)
  }, [])

  return null
}

export { PROJECT_ID }
