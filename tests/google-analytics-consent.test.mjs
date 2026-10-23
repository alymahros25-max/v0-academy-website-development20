import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const layout = readFileSync(path.join(root, "app/layout.tsx"), "utf8")
const clientProviders = readFileSync(path.join(root, "components/client-providers.tsx"), "utf8")
const deferredIntegrations = readFileSync(path.join(root, "components/deferred-client-integrations.tsx"), "utf8")
const consentManager = readFileSync(path.join(root, "components/google-analytics-consent.tsx"), "utf8")
const eventHelper = readFileSync(path.join(root, "components/ga4-events.ts"), "utf8")
const privacyPage = readFileSync(path.join(root, "app/privacy/page.tsx"), "utf8")
const packageJson = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"))

test("Google Analytics is loaded only after explicit consent", () => {
  assert.match(clientProviders, /<GoogleAnalyticsConsent\s*\/>/)
  const adminBranch = clientProviders.match(/if \(isAdmin\) \{([\s\S]*?)\n  \}/)?.[1]
  assert.ok(adminBranch, "admin layout branch should exist")
  assert.doesNotMatch(adminBranch, /GoogleAnalyticsConsent/)

  const trackingEffect = consentManager.match(/useEffect\(\(\) => \{([\s\S]*?)\n  \}, \[choice, pathname, ready\]\)/)?.[1]
  assert.ok(trackingEffect, "consent-gated tracking effect should exist")
  assert.ok(trackingEffect.indexOf('if (choice !== "granted")') < trackingEffect.indexOf("startGoogleAnalytics()"))
  assert.ok(trackingEffect.indexOf('if (!ready) return') < trackingEffect.indexOf("startGoogleAnalytics()"))
  assert.match(consentManager, /G-XPT3R8M0EC/)
  assert.match(consentManager, /googletagmanager\.com\/gtag\/js\?id=/)
  assert.match(consentManager, /send_page_view: false/)
  assert.doesNotMatch(layout, /gtag|googletagmanager/)
  assert.doesNotMatch(deferredIntegrations, /gtag|googletagmanager/)
})

test("acceptance and rejection are saved, and consent can be reopened", () => {
  assert.match(consentManager, /localStorage\.setItem\(CONSENT_KEY, choice\)/)
  assert.match(consentManager, /const CONSENT_KEY = "analytics_consent"/)
  assert.match(consentManager, /\$\{CONSENT_KEY\}=\$\{choice\}/)
  assert.match(consentManager, /CONSENT_COOKIE_MAX_AGE = 60 \* 60 \* 24 \* 180/)
  assert.match(consentManager, /expiresAt > Date\.now\(\)/)
  assert.match(consentManager, /choose\("granted"\)/)
  assert.match(consentManager, /choose\("denied"\)/)
  assert.match(consentManager, /stopGoogleAnalytics\(\)/)
  assert.match(consentManager, /delete window\.gtag/)
  assert.match(consentManager, /analytics:open-settings/)
  assert.match(privacyPage, /analytics:open-settings/)
  assert.match(privacyPage, /إدارة موافقة التحليلات/)
  assert.match(consentManager, /fixed bottom-0 left-0 right-0/, "mobile banner should span the full screen width")
  assert.match(consentManager, /sm:left-1\/4 sm:right-1\/4/, "desktop banner should use half the screen width")
  assert.match(consentManager, /rounded-none.*sm:.*rounded-2xl/, "mobile and desktop corners should be distinct")
  assert.match(consentManager, /text-center text-base font-extrabold/, "title should be centered and prominent")
  assert.match(consentManager, /flex-\[2\]/, "accept button should receive most of the row")
  assert.match(consentManager, /min-w-\[4\.75rem\] rounded-lg/, "reject button should remain small")
  assert.match(consentManager, /message: .*تحسين تجربة الموقع/, "consent message should stay concise")
  assert.doesNotMatch(consentManager, /سواء اخترت القبول أو الرفض/)

  assert.equal(existsSync(path.join(root, "app/api/analytics/pageview/route.ts")), false)
  assert.equal(packageJson.scripts["test:analytics-disabled"], undefined)
  assert.equal(packageJson.scripts["test:analytics-consent"], "node --test tests/google-analytics-consent.test.mjs")
})

test("analytics events are consent-guarded and page URLs omit query parameters", () => {
  assert.match(eventHelper, /if \(!hasAnalyticsConsent\(\)\) return/)
  assert.match(eventHelper, /expiresAt > Date\.now\(\)/)
  assert.match(consentManager, /page_location: `\$\{window\.location\.origin\}\$\{pathname\}`/)
  assert.match(consentManager, /return referrer\.origin/)
  assert.doesNotMatch(consentManager, /window\.location\.href/)
  assert.match(privacyPage, /لا نرسل إليه الاسم أو البريد الإلكتروني/)
})
