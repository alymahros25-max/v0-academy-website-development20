import test from "node:test"
import assert from "node:assert/strict"
import {
  countryLandingCacheTag,
  isCountrySlug,
  packageDuration,
  resolveCountryLandingData,
} from "../lib/country-data-resolution.mjs"

function snapshot(slug, currency, suffix) {
  return {
    area: { slug, currency_code: currency },
    packages: [
      { package_key: "quran-4", currency_code: currency, price: suffix * 100 + 4 },
      { package_key: "arabic-8", currency_code: currency, price: suffix * 100 + 8 },
    ],
    faq: [{ question: `faq-${slug}`, answer: suffix }],
    content: [{ key: `intro-${slug}`, value: suffix }],
    links: [{ key: "whatsapp", href: `https://example.test/${slug}` }],
    theme: { primary: `#${String(suffix).padStart(6, "0")}` },
    cities: [{ name: `city-${slug}` }],
    timezones: [{ name: `zone-${slug}` }],
  }
}

const mockDatabase = {
  colombia: snapshot("colombia", "COP", 1),
  austria: snapshot("austria", "EUR", 2),
  australia: snapshot("australia", "AUD", 3),
}
const mockFallbacks = {
  colombia: snapshot("colombia", "COP", 11),
  austria: snapshot("austria", "EUR", 12),
  australia: snapshot("australia", "AUD", 13),
}

test("supports legacy seed keys and explicit lesson-duration keys", () => {
  assert.equal(packageDuration("quran-4"), 30)
  assert.equal(packageDuration("arabic-16"), 30)
  assert.equal(packageDuration("quran-30-8"), 30)
  assert.equal(packageDuration("arabic-60-12"), 60)
  assert.equal(packageDuration("arabic-30-8-1750000000000"), 30)
  assert.equal(packageDuration("quran-monthly"), 0)
})

test("keeps packages, currency, FAQ, links, theme, cities and timezones isolated by slug", () => {
  for (const slug of Object.keys(mockDatabase)) {
    const resolved = resolveCountryLandingData(slug, mockDatabase[slug], mockFallbacks[slug])
    assert.equal(resolved.area.slug, slug)
    assert.ok(resolved.packages.every((item) => item.currency_code === resolved.area.currency_code))
    assert.deepEqual(resolved.faq, [{ question: `faq-${slug}`, answer: Object.keys(mockDatabase).indexOf(slug) + 1 }])
    assert.equal(resolved.links[0].href, `https://example.test/${slug}`)
    assert.equal(resolved.cities[0].name, `city-${slug}`)
    assert.equal(resolved.timezones[0].name, `zone-${slug}`)
    assert.ok(resolved.content[0].key.endsWith(slug))
  }
})

test("rejects a database snapshot whose area slug differs from the requested country", () => {
  const resolved = resolveCountryLandingData("austria", mockDatabase.australia, mockFallbacks.austria)
  assert.equal(resolved.area.slug, "austria")
  assert.equal(resolved.links[0].href, "https://example.test/austria")
  assert.equal(resolved.faq[0].question, "faq-austria")
  assert.ok(resolved.packages.every((item) => item.currency_code === "EUR"))
})

test("uses only the requested country's fallback when the database has no area or rows", () => {
  const emptyRead = {
    area: null,
    packages: [],
    faq: [],
    content: [],
    links: [],
    theme: null,
    cities: [],
    timezones: [],
  }
  const resolved = resolveCountryLandingData("colombia", emptyRead, mockFallbacks.colombia)
  assert.equal(resolved.area.slug, "colombia")
  assert.equal(resolved.packages[0].currency_code, "COP")
  assert.equal(resolved.links[0].href, "https://example.test/colombia")
  assert.equal(resolved.faq[0].question, "faq-colombia")
})

test("does not display package prices in a currency different from the area", () => {
  const wrongCurrency = snapshot("australia", "AUD", 3)
  wrongCurrency.packages = [{ package_key: "quran-4", currency_code: "NZD", price: 999 }]
  const wrongFallback = snapshot("australia", "NZD", 14)
  const resolved = resolveCountryLandingData("australia", wrongCurrency, wrongFallback)
  assert.deepEqual(resolved.packages, [])
})

test("updates to one country's mock record do not alter another country's data or cache tag", () => {
  const beforeAustralia = resolveCountryLandingData("australia", mockDatabase.australia, mockFallbacks.australia)
  mockDatabase.austria.faq[0].answer = "updated"
  const afterAustralia = resolveCountryLandingData("australia", mockDatabase.australia, mockFallbacks.australia)
  assert.deepEqual(afterAustralia, beforeAustralia)
  assert.notEqual(countryLandingCacheTag("austria"), countryLandingCacheTag("australia"))
})

test("accepts only normalized country slugs for database access", () => {
  assert.equal(isCountrySlug("south-africa"), true)
  assert.equal(isCountrySlug("../austria"), false)
  assert.equal(isCountrySlug("South-Africa"), false)
})
