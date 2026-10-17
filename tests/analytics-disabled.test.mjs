import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const layout = readFileSync(path.join(root, "app/layout.tsx"), "utf8")
const deferredIntegrations = readFileSync(path.join(root, "components/deferred-client-integrations.tsx"), "utf8")
const packageJson = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"))

test("visitor analytics UI and trackers are disabled", () => {
  assert.doesNotMatch(layout, /AnalyticsConsent|GoogleAnalytics|google-consent-mode|consentModeScript/)
  assert.doesNotMatch(deferredIntegrations, /ClarityTracker|clarity\.ms/)
  assert.equal(existsSync(path.join(root, "app/api/analytics/pageview/route.ts")), false, "public pageview collection endpoint should be removed")
  for (const dependency of ["@microsoft/clarity", "@next/third-parties", "@vercel/analytics", "@vercel/speed-insights"]) {
    assert.equal(packageJson.dependencies?.[dependency], undefined, `${dependency} should not be installed`)
  }
})
