import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { glob } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const rootUrl = new URL('../', import.meta.url)
const root = fileURLToPath(rootUrl)
const read = (path) => readFile(new URL(path, rootUrl), 'utf8')

async function countryRoutes() {
  const routes = []
  for await (const entry of glob('app/*/page.tsx', { cwd: root })) {
    const source = await read(entry)
    if (source.includes('CountryLandingEngine')) routes.push([entry, source])
  }
  return routes
}

test('all public country routes use ISR and do not force dynamic rendering', async () => {
  const routes = await countryRoutes()
  assert.equal(routes.length, 40)
  for (const [path, source] of routes) {
    assert.match(source, /export const revalidate = 3600/, `${path} must use one-hour ISR`)
    assert.doesNotMatch(source, /force-dynamic/, `${path} must not force dynamic rendering`)
  }
})

test('country articles publish route-specific social metadata and Article JSON-LD', async () => {
  const source = await read('app/blog/country/[slug]/[topic]/page.tsx')
  for (const field of ['openGraph', 'url: canonical', 'siteName', 'twitter', "'@type': 'BlogPosting'", 'mainEntityOfPage']) {
    assert.match(source, new RegExp(field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing ${field}`)
  }
  assert.match(source, /export const revalidate = 3600/)
})

test('shared and exceptional pages provide complete Open Graph URLs and site names', async () => {
  const metadataUtils = await read('lib/metadata-utils.ts')
  const games = await read('app/games/layout.tsx')
  const refund = await read('app/refund-policy/page.tsx')
  assert.match(metadataUtils, /siteName: 'أكاديمية الحافظ المتميز'/)
  assert.match(games, /url: "https:\/\/quran-elhafez\.com\/games"/)
  assert.match(games, /siteName: "أكاديمية الحافظ المتميز"/)
  assert.match(refund, /url: 'https:\/\/quran-elhafez\.com\/refund-policy'/)
  assert.match(refund, /siteName: 'أكاديمية الحافظ المتميز'/)
  assert.match(refund, /twitter:/)
})
