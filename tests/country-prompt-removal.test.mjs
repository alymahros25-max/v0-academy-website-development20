import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const chromeSource = readFileSync(path.join(root, "components/country-pages-chrome.tsx"), "utf8")
const globalStyles = readFileSync(path.join(root, "app/globals.css"), "utf8")

test("country pages chrome does not show a location or currency suggestion banner", () => {
  assert.doesNotMatch(chromeSource, /CountryCurrencySuggestion|country-currency-suggestion|visitor-country/)
  assert.doesNotMatch(globalStyles, /country-currency-suggestion|country-usd-suggestion/)
  assert.match(chromeSource, /export function CountryPagesChrome/)
  assert.match(chromeSource, /country-pages-shell/)
})
