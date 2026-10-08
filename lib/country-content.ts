import { revalidatePath, revalidateTag, unstable_cache } from "next/cache"
import { getCountryFallback } from "@/lib/country-fallbacks"
import { areaRepository } from "@/lib/repositories"
import { countryLandingCacheTag, isCountrySlug, packageDuration, resolveCountryLandingData } from "@/lib/country-data-resolution.mjs"
import type {
  AreaCity,
  AreaContentItem,
  AreaDisplayPlan,
  AreaFaqItem,
  AreaLandingSnapshot,
  AreaLink,
  AreaPackage,
  AreaTheme,
  AreaTimezone,
  SiteArea,
} from "@/lib/domain/area-content"

export type {
  AreaCity,
  AreaContentItem,
  AreaDisplayPlan,
  AreaFaqItem,
  AreaLandingSnapshot,
  AreaLink,
  AreaPackage,
  AreaTheme,
  AreaTimezone,
  SiteArea,
} from "@/lib/domain/area-content"
export { packageDuration } from "@/lib/country-data-resolution.mjs"

export async function getSiteArea(slug: string): Promise<SiteArea | null> {
  if (!areaRepository || !isCountrySlug(slug)) return null
  try {
    return await areaRepository.getAreaBySlug(slug)
  } catch (error) {
    console.warn("[Country Content] area read failed:", error instanceof Error ? error.message : error)
    return null
  }
}

export async function getAreaPackages(slug: string) {
  const data = await getAreaLandingData(slug)
  return { area: data.area, packages: data.packages }
}

export async function getAreaFaq(slug: string) {
  const data = await getAreaLandingData(slug)
  return { area: data.area, faq: data.faq }
}

export async function getAreaContent(slug: string, section?: string) {
  const data = await getAreaLandingData(slug)
  return { area: data.area, content: section ? data.content.filter((item) => item.section === section) : data.content }
}

function emptyAreaLandingData(): AreaLandingSnapshot {
  return { area: null, packages: [], faq: [], content: [], links: [], theme: null, cities: [], timezones: [] }
}

async function loadAreaLandingData(slug: string): Promise<AreaLandingSnapshot> {
  if (!areaRepository) return emptyAreaLandingData()
  const data = await areaRepository.getSnapshot(slug)
  if (!data.area) return data
  return {
    ...data,
    packages: data.packages.filter((pkg) => Number(pkg.duration_minutes ?? packageDuration(pkg.package_key)) === 30 && (!data.area?.currency_code || pkg.currency_code === data.area.currency_code)),
  }
}

function getCachedAreaLandingData(slug: string) {
  return unstable_cache(
    () => loadAreaLandingData(slug),
    ["country-landing-data", slug],
    { revalidate: 3600, tags: [countryLandingCacheTag(slug)] },
  )()
}

export async function getAreaLandingData(slug: string): Promise<AreaLandingSnapshot> {
  if (!isCountrySlug(slug)) return emptyAreaLandingData()
  const fallback = getCountryFallback(slug)
  try {
    const data = await getCachedAreaLandingData(slug)
    return resolveCountryLandingData<AreaLandingSnapshot>(slug, data, fallback)
  } catch (error) {
    console.warn(`[Country Content] landing fallback used for ${slug}:`, error instanceof Error ? error.message : error)
    return resolveCountryLandingData(slug, emptyAreaLandingData(), fallback)
  }
}

/** Expire only the edited country's cached snapshot and rerender its route. */
export function revalidateAreaLandingData(slug: string) {
  if (!isCountrySlug(slug)) return
  revalidateTag(countryLandingCacheTag(slug), { expire: 0 })
  revalidatePath(`/${slug}`)
}

export function areaLocalized(value: { content_ar?: string | null; content_en?: string | null; content_fr?: string | null } | undefined, locale = "ar") {
  if (!value) return ""
  return (locale === "en" ? value.content_en : locale === "fr" ? value.content_fr : value.content_ar)?.trim() || ""
}

export function packageFeatures(pkg: { features_ar?: unknown; features_en?: unknown; features_fr?: unknown }, locale = "ar"): string[] {
  const key = locale === "en" ? "features_en" : locale === "fr" ? "features_fr" : "features_ar"
  const value = pkg[key as keyof typeof pkg]
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []
}

export function packageWeeklySessions(sessionsPerMonth: number | null | undefined): number {
  return Math.max(1, Math.round((sessionsPerMonth ?? 4) / 4))
}

export function getAreaLinkHref(links: Array<Partial<AreaLink>> | undefined, linkKey: string, fallback: string): string {
  const match = links?.find((link) => link.link_key === linkKey && typeof link.href === "string" && link.href.trim())
  return match?.href?.trim() || fallback
}

export function getAreaWhatsAppUrl(links: Array<Partial<AreaLink>> | undefined, planName: string, fallback: string, customMessage?: string): string {
  const configured = getAreaLinkHref(links, "whatsapp", fallback)
  const base = configured.replace(/[?&]text=[^&]*/g, "")
  const separator = base.includes("?") ? "&" : "?"
  const message = customMessage ?? `السلام عليكم، أرغب في حجز باقة ${planName}.`
  return `${base}${separator}text=${encodeURIComponent(message)}`
}

export function toAreaDisplayPlan(pkg: AreaPackage): AreaDisplayPlan {
  return {
    id: String(pkg.id),
    program: pkg.program === "arabic" ? "arabic" : "quran",
    duration: Number(pkg.duration_minutes ?? packageDuration(pkg.package_key)),
    monthlySessions: pkg.sessions_per_month ?? 4,
    weeklySessions: packageWeeklySessions(pkg.sessions_per_month),
    price: Number(pkg.price),
    name: areaLocalized({ content_ar: pkg.name_ar, content_en: pkg.name_en, content_fr: pkg.name_fr }) || pkg.name_ar,
    description: areaLocalized({ content_ar: pkg.description_ar, content_en: pkg.description_en, content_fr: pkg.description_fr }) || "",
    features: packageFeatures(pkg),
    popular: Boolean(pkg.is_popular),
  }
}

export async function getAreaLinks(slug: string) {
  const data = await getAreaLandingData(slug)
  return { area: data.area, links: data.links }
}
