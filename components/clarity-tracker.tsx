"use client"

import { useEffect } from "react"

const CONSENT_COOKIE = "analytics_consent"
const PROJECT_ID = "ylvf05htdn"
const SCRIPT_ID = "clarity-script"

type ClarityApi = ((command: string, ...args: unknown[]) => void) & { v?: unknown; q?: unknown[] }
type ClarityWindow = Window & { __clarityInitialized?: boolean; __clarityDiagnostics?: ClarityDiagnostic[]; clarity?: ClarityApi }
type ClarityDiagnostic = { stage: string; timestamp: string; projectId: string; clarityResources?: string[] }

function hasAnalyticsConsent() {
  return document.cookie.split(";").some((cookie) => cookie.trim() === `${CONSENT_COOKIE}=granted`)
}

function reportDiagnostic(stage: string) {
  const diagnostic: ClarityDiagnostic = {
    stage,
    timestamp: new Date().toISOString(),
    projectId: PROJECT_ID,
    clarityResources: performance.getEntriesByType("resource").map((entry) => entry.name).filter((name) => /clarity/i.test(name)).slice(-10),
  }
  const state = window as ClarityWindow
  state.__clarityDiagnostics = [...(state.__clarityDiagnostics ?? []), diagnostic].slice(-20)
  console.info(`[Clarity] ${stage}`, diagnostic)
  window.dispatchEvent(new CustomEvent("clarity-diagnostic", { detail: diagnostic }))
}

function sendConsentAndDiagnosticEvent(attempt = 0) {
  const clarity = (window as ClarityWindow).clarity
  if (!clarity) {
    if (attempt < 20) window.setTimeout(() => sendConsentAndDiagnosticEvent(attempt + 1), 250)
    else reportDiagnostic("manual-script-loaded-without-api")
    return
  }

  clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" })
  reportDiagnostic("consent-v2-called")
  clarity("set", "consent_status", "granted")
  clarity("event", "clarity_integration_test")
  reportDiagnostic("diagnostic-event-sent")
}

function installClarityBootstrap() {
  const state = window as ClarityWindow
  if (state.clarity) return state.clarity
  const clarity = ((...args: unknown[]) => {
    clarity.q = clarity.q ?? []
    clarity.q.push(args)
  }) as ClarityApi
  clarity.q = []
  state.clarity = clarity
  reportDiagnostic("manual-bootstrap-installed")
  return clarity
}

function startClarity() {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return
  const state = window as ClarityWindow
  if (state.__clarityInitialized) return

  try {
    installClarityBootstrap()
    const existingScript = document.getElementById(SCRIPT_ID)
    if (existingScript) {
      sendConsentAndDiagnosticEvent()
    } else {
      const script = document.createElement("script")
      script.id = SCRIPT_ID
      script.async = true
      script.src = `https://www.clarity.ms/tag/${PROJECT_ID}?ref=manual`
      script.addEventListener("load", () => {
        reportDiagnostic("manual-script-loaded")
        sendConsentAndDiagnosticEvent()
      }, { once: true })
      script.addEventListener("error", () => reportDiagnostic("manual-script-load-error"), { once: true })
      document.head.appendChild(script)
      reportDiagnostic("manual-script-injected")
    }
    state.__clarityInitialized = true
    window.setTimeout(() => reportDiagnostic("post-init-resource-check"), 2000)
  } catch (error) {
    reportDiagnostic(`initialization-error:${error instanceof Error ? error.name : "unknown"}`)
    console.error("[Clarity] initialization failed", error)
  }
}

export function ClarityTracker() {
  useEffect(() => {
    let interacted = false
    const interactionEvents = ["pointerdown", "keydown", "touchstart", "scroll"] as const
    const handleInteraction = () => {
      if (interacted) return
      interacted = true
      startClarity()
      interactionEvents.forEach((event) => window.removeEventListener(event, handleInteraction))
    }
    const handleConsentChange = (event: Event) => {
      if ((event as CustomEvent<boolean>).detail === true && interacted) startClarity()
    }

    interactionEvents.forEach((event) => window.addEventListener(event, handleInteraction, { passive: true, once: true }))
    window.addEventListener("analytics-consent-change", handleConsentChange)
    return () => {
      interactionEvents.forEach((event) => window.removeEventListener(event, handleInteraction))
      window.removeEventListener("analytics-consent-change", handleConsentChange)
    }
  }, [])

  return null
}

export { PROJECT_ID }
