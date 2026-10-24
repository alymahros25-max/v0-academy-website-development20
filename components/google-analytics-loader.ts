export const GA_MEASUREMENT_ID = "G-XPT3R8M0EC"

declare global {
  interface Window {
    dataLayer?: unknown[][]
    gtag?: (...args: unknown[]) => void
    __ga4ScriptLoaded?: boolean
    __ga4ScriptPromise?: Promise<boolean>
  }
}

export function loadGoogleAnalytics(): Promise<boolean> {
  window.dataLayer = window.dataLayer ?? []
  window.gtag = window.gtag ?? ((...args: unknown[]) => window.dataLayer?.push(args))
  if (window.__ga4ScriptLoaded) return Promise.resolve(true)
  if (window.__ga4ScriptPromise) return window.__ga4ScriptPromise

  window.__ga4ScriptPromise = new Promise((resolve) => {
    const existingScript = document.querySelector<HTMLScriptElement>(`script[data-ga-consent="${GA_MEASUREMENT_ID}"]`)
    const script = existingScript ?? document.createElement("script")
    if (existingScript?.dataset.gaLoaded === "true") {
      window.__ga4ScriptLoaded = true
      resolve(true)
      return
    }
    let settled = false
    const finish = (loaded: boolean) => {
      if (settled) return
      settled = true
      if (loaded) {
        script.dataset.gaLoaded = "true"
        window.__ga4ScriptLoaded = true
      } else {
        window.__ga4ScriptPromise = undefined
        script.remove()
      }
      resolve(loaded)
    }

    script.addEventListener("load", () => finish(true), { once: true })
    script.addEventListener("error", () => finish(false), { once: true })

    if (!existingScript) {
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
      script.dataset.gaConsent = GA_MEASUREMENT_ID
      document.head.appendChild(script)
    } else if ((script as HTMLScriptElement & { complete?: boolean }).complete) {
      // A script inserted before this component mounted may have finished
      // loading, so its load event will never fire again.
      finish(true)
    }
  })

  return window.__ga4ScriptPromise
}

export function configureGoogleAnalytics() {
  window.gtag?.("js", new Date())
  window.gtag?.("config", GA_MEASUREMENT_ID, { send_page_view: false })
}

export function sendGoogleAnalyticsPageView(pathname: string) {
  window.gtag?.("event", "page_view", {
    page_path: pathname,
    page_location: `${window.location.origin}${pathname}`,
    page_referrer: safePageReferrer(),
    page_title: "أكاديمية الحافظ المتميز",
  })
}

function safePageReferrer() {
  if (!document.referrer) return undefined
  try {
    return new URL(document.referrer).origin
  } catch {
    return undefined
  }
}
