import type { SupabaseClient } from "@supabase/supabase-js"
import type {
  AreaAdminSnapshot,
  AreaLandingSnapshot,
  AreaResource,
  SiteArea,
} from "@/lib/domain/area-content"
import type { AreaRepository, NewAreaPackage } from "@/lib/repositories/area-repository"

const areaColumns = "id, slug, area_type, country_code, name_ar, name_en, name_fr, currency_code, currency_symbol, is_active"
const resourceTables: Record<AreaResource, string> = {
  content: "area_content",
  packages: "area_packages",
  faq: "area_faq_items",
  links: "area_links",
  themes: "area_themes",
  cities: "area_cities",
  timezones: "area_timezones",
}

const emptyAdminSnapshot = (): AreaAdminSnapshot => ({
  areas: [], content: [], packages: [], faq: [], links: [], themes: [], cities: [], timezones: [],
})

function throwDatabaseError(operation: string, error: { message?: string } | null) {
  if (error) throw new Error(`[AreaRepository] ${operation}: ${error.message ?? "database error"}`)
}

export function createSupabaseAreaRepository(client: SupabaseClient): AreaRepository {
  async function getAreaBySlug(slug: string): Promise<SiteArea | null> {
    const { data, error } = await client
      .from("site_areas")
      .select(areaColumns)
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle()
    throwDatabaseError("get area", error)
    return (data as SiteArea | null) ?? null
  }

  async function getSnapshot(slug: string): Promise<AreaLandingSnapshot> {
    const area = await getAreaBySlug(slug)
    if (!area) return { area: null, packages: [], faq: [], content: [], links: [], theme: null, cities: [], timezones: [] }

    const [packagesResult, faqResult, contentResult, linksResult, themesResult, citiesResult, timezonesResult] = await Promise.all([
      client.from("area_packages").select("id, area_id, program, package_key, name_ar, name_en, name_fr, description_ar, description_en, description_fr, duration_minutes, price, currency_code, billing_period, sessions_per_month, features_ar, features_en, features_fr, is_popular, is_active, sort_order").eq("area_id", area.id).eq("is_active", true).order("sort_order", { ascending: true }),
      client.from("area_faq_items").select("id, area_id, question_key, question_ar, question_en, question_fr, answer_ar, answer_en, answer_fr, is_active, sort_order").eq("area_id", area.id).eq("is_active", true).order("sort_order", { ascending: true }),
      client.from("area_content").select("id, area_id, content_key, content_ar, content_en, content_fr, content_type, section, href, is_active, sort_order").eq("area_id", area.id).eq("is_active", true).order("sort_order", { ascending: true }),
      client.from("area_links").select("id, area_id, link_key, label_ar, label_en, label_fr, href, link_type, is_external, is_active, sort_order").eq("area_id", area.id).eq("is_active", true).order("sort_order", { ascending: true }),
      client.from("area_themes").select("id, area_id, theme_name_ar, theme_name_en, primary_color, secondary_color, accent_color, background_color, text_color, quran_fact_title_ar, quran_fact_body_ar, quran_fact_reference_ar, is_active, sort_order").eq("area_id", area.id).eq("is_active", true).order("sort_order", { ascending: true }).limit(1),
      client.from("area_cities").select("id, area_id, city_key, name_ar, name_en, region_name, is_active, sort_order").eq("area_id", area.id).eq("is_active", true).order("sort_order", { ascending: true }),
      client.from("area_timezones").select("id, area_id, timezone_name, label_ar, label_en, is_primary, is_active, sort_order").eq("area_id", area.id).eq("is_active", true).order("sort_order", { ascending: true }),
    ])
    throwDatabaseError("load area packages", packagesResult.error)
    throwDatabaseError("load area FAQ", faqResult.error)
    throwDatabaseError("load area content", contentResult.error)
    throwDatabaseError("load area links", linksResult.error)
    throwDatabaseError("load area theme", themesResult.error)
    throwDatabaseError("load area cities", citiesResult.error)
    throwDatabaseError("load area timezones", timezonesResult.error)

    return {
      area,
      packages: (packagesResult.data ?? []).filter((item) => item.currency_code === area.currency_code),
      faq: faqResult.data ?? [],
      content: contentResult.data ?? [],
      links: linksResult.data ?? [],
      theme: themesResult.data?.[0] ?? null,
      cities: citiesResult.data ?? [],
      timezones: timezonesResult.data ?? [],
    } as AreaLandingSnapshot
  }

  async function getAdminSnapshot(slug?: string | null): Promise<AreaAdminSnapshot> {
    let areaQuery = client.from("site_areas").select(areaColumns).order("area_type", { ascending: true }).order("slug", { ascending: true })
    if (slug) areaQuery = areaQuery.eq("slug", slug)
    const { data: areasData, error: areasError } = await areaQuery
    throwDatabaseError("list areas", areasError)
    const areas = (areasData ?? []) as SiteArea[]
    if (!areas.length) return emptyAdminSnapshot()

    const areaIds = areas.map((area) => area.id)
    const [content, packages, faq, links, themes, cities, timezones] = await Promise.all([
      client.from("area_content").select("id, area_id, content_key, content_ar, content_en, content_fr, content_type, section, href, is_active, sort_order").in("area_id", areaIds).order("sort_order", { ascending: true }),
      client.from("area_packages").select("id, area_id, program, package_key, name_ar, name_en, name_fr, description_ar, description_en, description_fr, duration_minutes, price, currency_code, billing_period, sessions_per_month, features_ar, features_en, features_fr, is_popular, is_active, sort_order").in("area_id", areaIds).order("sort_order", { ascending: true }),
      client.from("area_faq_items").select("id, area_id, question_key, question_ar, question_en, question_fr, answer_ar, answer_en, answer_fr, is_active, sort_order").in("area_id", areaIds).order("sort_order", { ascending: true }),
      client.from("area_links").select("id, area_id, link_key, label_ar, label_en, label_fr, href, link_type, is_external, is_active, sort_order").in("area_id", areaIds).order("sort_order", { ascending: true }),
      client.from("area_themes").select("id, area_id, theme_name_ar, theme_name_en, primary_color, secondary_color, accent_color, background_color, text_color, quran_fact_title_ar, quran_fact_body_ar, quran_fact_reference_ar, is_active, sort_order").in("area_id", areaIds).order("sort_order", { ascending: true }),
      client.from("area_cities").select("id, area_id, city_key, name_ar, name_en, region_name, is_active, sort_order").in("area_id", areaIds).order("sort_order", { ascending: true }),
      client.from("area_timezones").select("id, area_id, timezone_name, label_ar, label_en, is_primary, is_active, sort_order").in("area_id", areaIds).order("sort_order", { ascending: true }),
    ])
    throwDatabaseError("load admin area content", content.error)
    throwDatabaseError("load admin area packages", packages.error)
    throwDatabaseError("load admin area FAQ", faq.error)
    throwDatabaseError("load admin area links", links.error)
    throwDatabaseError("load admin area themes", themes.error)
    throwDatabaseError("load admin area cities", cities.error)
    throwDatabaseError("load admin area timezones", timezones.error)

    return {
      areas,
      content: content.data ?? [],
      packages: packages.data ?? [],
      faq: faq.data ?? [],
      links: links.data ?? [],
      themes: themes.data ?? [],
      cities: cities.data ?? [],
      timezones: timezones.data ?? [],
    } as AreaAdminSnapshot
  }

  async function areaSlugById(areaId: number): Promise<string | null> {
    const { data, error } = await client.from("site_areas").select("slug").eq("id", areaId).maybeSingle()
    throwDatabaseError("resolve area slug", error)
    return data?.slug ?? null
  }

  async function updateRecord(resource: AreaResource, id: number, changes: Record<string, unknown>) {
    const { data, error } = await client.from(resourceTables[resource]).update({ ...changes, updated_at: new Date().toISOString() }).eq("id", id).select("*").maybeSingle()
    throwDatabaseError("update area record", error)
    if (!data) return null
    return { record: data as Record<string, unknown>, areaSlug: typeof data.area_id === "number" ? await areaSlugById(data.area_id) : null }
  }

  async function createPackage(input: NewAreaPackage) {
    const { data: area, error: areaError } = await client.from("site_areas").select("id, slug, currency_code").eq("id", input.area_id).eq("is_active", true).maybeSingle()
    throwDatabaseError("load package area", areaError)
    if (!area) return null

    const packageKey = `${input.program}-${input.duration_minutes}-${input.sessions_per_month}-${Date.now()}`
    const { data, error } = await client.from("area_packages").insert({
      area_id: input.area_id,
      program: input.program,
      package_key: packageKey,
      name_ar: `${input.name_ar} — ${input.duration_minutes} دقيقة`,
      description_ar: input.description_ar || `${input.duration_minutes} دقيقة للحصة مع متابعة فردية وتجويد ومراجعة.`,
      price: input.price,
      currency_code: area.currency_code,
      billing_period: "month",
      sessions_per_month: input.sessions_per_month,
      duration_minutes: input.duration_minutes,
      features_ar: input.features_ar,
      is_popular: input.is_popular,
      is_active: true,
      sort_order: 0,
    }).select("*").single()
    throwDatabaseError("create area package", error)
    return { record: data as Record<string, unknown>, areaSlug: area.slug as string }
  }

  async function deletePackage(id: number) {
    const { data: before, error: lookupError } = await client.from("area_packages").select("id, area_id").eq("id", id).maybeSingle()
    throwDatabaseError("find package for deletion", lookupError)
    if (!before) return null
    const { data, error } = await client.from("area_packages").delete().eq("id", id).select("id").maybeSingle()
    throwDatabaseError("delete area package", error)
    if (!data) return null
    return { record: data as Record<string, unknown>, areaSlug: await areaSlugById(before.area_id) }
  }

  return { getAreaBySlug, getSnapshot, getAdminSnapshot, updateRecord, createPackage, deletePackage }
}
