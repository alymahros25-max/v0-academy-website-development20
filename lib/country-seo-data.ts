import type { Metadata } from "next"
import { getAreaLandingData } from "@/lib/country-content"
import { countrySeoPageToMetadata, resolveCountrySeoPlan } from "@/lib/country-seo"

/** Server-side route metadata: DB snapshot when seeded, existing code plan otherwise. */
export async function getCountrySeoMetadataFromDatabase(slug: string): Promise<Metadata> {
  const [areaData, page] = await Promise.all([
    getAreaLandingData(slug),
    Promise.resolve(resolveCountrySeoPlan(slug)),
  ])
  const resolved = resolveCountrySeoPlan(slug, areaData.content) ?? page
  if (!resolved) throw new Error(`Missing SEO plan for country: ${slug}`)
  return countrySeoPageToMetadata(resolved)
}
