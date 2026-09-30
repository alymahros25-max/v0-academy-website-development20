"use client"

import { useEffect } from "react"

const CONSENT_COOKIE = "analytics_consent"
const PROJECT_ID = "ylvf05htdn"
const SCRIPT_ID = "clarity-script"
const MAX_LOAD_ATTEMPTS = 3
const RETRY_DELAY_MS = 1500

type ClarityApi = ((command: string, ...args: unknown[]) => void) & {
  v?: unknown
  q?: unknown[]
}

type ClarityDiagnostic = {
  stage: string
  timestamp: string
  projectId: string
  clarityResources?: string[]
}

type ClarityWindow = Window & {
  __clarityInitialized?: boolean
  __clarityLoading?: boolean
  __clarityLoadAttempts?: number
  __clarityDiagnostics?: ClarityDiagnostic[]
  clarity?: ClarityApi
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

function sendConsentSignal() {
  const clarity = (window as ClarityWindow).clarity
  if (!clarity) {
    reportDiagnostic("script-loaded-without-api")
    return
  }

  // Clarity ConsentV2 is the current Microsoft-supported consent API.
  clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" })
  clarity("set", "consent_status", "granted")
  reportDiagnostic("consent-v2-called")
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
  reportDiagnostic("bootstrap-installed")
  return clarity
}

function startClarity(attempt = 1) {
  if (typeof window === "undefined") return
  if (!hasAnalyticsConsent()) {
    reportDiagnostic("skipped-without-consent")
    return
  }

  const state = window as ClarityWindow
  if (state.__clarityInitialized || state.__clarityLoading) return
  if (attempt > MAX_LOAD_ATTEMPTS) {
    reportDiagnostic("load-abandoned-after-retries")
    return
  }

  try {
    installClarityBootstrap()
    state.__clarityLoading = true
    state.__clarityLoadAttempts = attempt

    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    const script = existingScript || document.createElement("script")
    let settled = false
    const finish = (loaded: boolean) => {
      if (settled) return
      settled = true
      state.__clarityLoading = false
      if (loaded) {
        state.__clarityInitialized = true
        reportDiagnostic("script-loaded")
        sendConsentSignal()
      } else if (attempt < MAX_LOAD_ATTEMPTS) {
        reportDiagnostic(`script-load-error-retry-${attempt}`)
        script.remove()
        state.clarity = undefined
        window.setTimeout(() => startClarity(attempt + 1), RETRY_DELAY_MS)
      } else {
        reportDiagnostic("script-load-error-final")
      }
    }

    const timeoutId = window.setTimeout(() => finish(false), 8000)
    script.addEventListener("load", () => {
      window.clearTimeout(timeoutId)
      finish(true)
    }, { once: true })
    script.addEventListener("error", () => {
      window.clearTimeout(timeoutId)
      finish(false)
    }, { once: true })

    if (!existingScript) {
      script.id = SCRIPT_ID
      script.async = true
      script.src = `https://www.clarity.ms/tag/${PROJECT_ID}`
      document.head.appendChild(script)
      reportDiagnostic(`script-injected-${attempt}`)
    }
  } catch (error) {
    state.__clarityLoading = false
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
