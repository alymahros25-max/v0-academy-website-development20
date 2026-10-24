import assert from "node:assert/strict"
import test from "node:test"

function createBrowser({ existingScript } = {}) {
  const listeners = new Map()
  const script = existingScript ?? {
    dataset: {},
    complete: false,
    addEventListener(type, callback) {
      listeners.set(type, callback)
    },
    remove() {
      this.removed = true
    },
  }
  const document = {
    cookie: "",
    referrer: "",
    querySelector() {
      return existingScript ?? null
    },
    createElement() {
      return script
    },
    head: {
      appendChild(node) {
        node.dataset.gaConsent = "G-XPT3R8M0EC"
        queueMicrotask(() => {
          node.complete = true
          node.dataset.gaLoaded = "true"
          listeners.get("load")?.()
        })
      },
    },
  }
  return { document, script }
}

async function loadModuleWithBrowser(browser) {
  globalThis.window = {}
  globalThis.document = browser.document
  return import(`../components/google-analytics-loader.ts?runtime=${Date.now()}-${Math.random()}`)
}

test("GA4 loader resolves after the first script load and marks it as loaded", async () => {
  const browser = createBrowser()
  const { loadGoogleAnalytics } = await loadModuleWithBrowser(browser)

  assert.equal(await loadGoogleAnalytics(), true)
  assert.equal(browser.script.dataset.gaLoaded, "true")
  assert.equal(window.__ga4ScriptLoaded, true)
})

test("GA4 loader does not wait forever for an already-loaded script", async () => {
  const existingScript = {
    dataset: { gaConsent: "G-XPT3R8M0EC", gaLoaded: "true" },
    complete: true,
    addEventListener() {
      throw new Error("a loaded script must not require a future load event")
    },
    remove() {},
  }
  const browser = createBrowser({ existingScript })
  const { loadGoogleAnalytics } = await loadModuleWithBrowser(browser)

  await assert.doesNotReject(loadGoogleAnalytics())
  assert.equal(await loadGoogleAnalytics(), true)
  assert.equal(window.__ga4ScriptLoaded, true)
})

test("GA4 sends config once and a consented page_view with a clean URL", async () => {
  const browser = createBrowser()
  const { configureGoogleAnalytics, sendGoogleAnalyticsPageView } = await loadModuleWithBrowser(browser)
  const calls = []
  window.location = { origin: "https://quran-elhafez.com" }
  window.gtag = (...args) => calls.push(args)

  configureGoogleAnalytics()
  sendGoogleAnalyticsPageView("/qatar")

  assert.equal(calls[0][0], "js")
  assert.deepEqual(calls[1], ["config", "G-XPT3R8M0EC", { send_page_view: false }])
  assert.deepEqual(calls[2], ["event", "page_view", {
    page_path: "/qatar",
    page_location: "https://quran-elhafez.com/qatar",
    page_referrer: undefined,
    page_title: "أكاديمية الحافظ المتميز",
  }])
})
