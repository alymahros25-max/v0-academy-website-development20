"use client"

import { useEffect } from "react"
import Clarity from "@microsoft/clarity"

const CONSENT_COOKIE = "analytics_consent"
const PROJECT_ID = "ylvf05htdn"

type ClarityDiagnostic = {
  stage: string
  timestamp: string
  projectId: string
  clarityResources?: string[]
}

type ClarityWindow = Window & {
  __clarityInitialized?: boolean
  __clarityDiagnostics?: ClarityDiagnostic[]
}

function hasAnalyticsConsent() {
  return document.cookie.split(";").some((cookie) => cookie.trim() === `${CONSENT_COOKIE}=granted`)
}

function reportDiagnostic(stage: string) {
  const diagnostic: ClarityDiagnostic = {
    stage,
    timestamp: new Date().toISOString(),
    projectId: PROJECT_ID,
    clarityResources: performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((name) => /clarity/i.test(name))
      .slice(-10),
  }
  const state = window as ClarityWindow
  state.__clarityDiagnostics = [...(state.__clarityDiagnostics ?? []), diagnostic].slice(-20)
  console.info(`[Clarity] ${stage}`, diagnostic)
  window.dispatchEvent(new CustomEvent("clarity-diagnostic", { detail: diagnostic }))
}

function startClarity() {
  if (typeof window === "undefined") return
  if (!hasAnalyticsConsent()) {
    reportDiagnostic("skipped-without-consent")
    return
  }

  const state = window as ClarityWindow
  if (state.__clarityInitialized) return

  try {
    // Official NPM initialization and Consent V2 flow.
    Clarity.init(PROJECT_ID)
    reportDiagnostic("init-called")

    Clarity.consentV2({ ad_Storage: "denied", analytics_Storage: "granted" })
    reportDiagnostic("consent-v2-called")

    // Official APIs used as a harmless diagnostic signal. These create no PII.
    Clarity.setTag("consent_status", "granted")
    Clarity.event("clarity_integration_test")
    reportDiagnostic("diagnostic-event-sent")

    state.__clarityInitialized = true
    window.setTimeout(() => reportDiagnostic("post-init-resource-check"), 2000)
  } catch (error) {
    reportDiagnostic(`initialization-error:${error instanceof Error ? error.name : "unknown"}`)
    console.error("[Clarity] initialization failed", error)
  }
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
