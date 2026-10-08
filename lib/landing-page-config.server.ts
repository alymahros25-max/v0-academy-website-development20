import "server-only"
import { defaultLandingPageConfigs, landingPageConfigSchema, type LandingPageConfig, type LandingPageSlug } from "@/lib/domain/landing-page-config"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function getLandingPageConfig(slug: LandingPageSlug): Promise<LandingPageConfig> {
  const fallback = defaultLandingPageConfigs[slug]
  if (!supabaseAdmin) return fallback
  try {
    const { data, error } = await supabaseAdmin
      .from("landing_page_configs")
      .select("config_json")
      .eq("slug", slug)
      .maybeSingle()
    if (error || !data?.config_json || typeof data.config_json !== "object") return fallback
    const candidate = data.config_json as Partial<LandingPageConfig>
    const parsed = landingPageConfigSchema.safeParse({
      ...fallback,
      ...candidate,
      seo: { ...fallback.seo, ...(candidate.seo ?? {}) },
    })
    return parsed.success ? parsed.data : fallback
  } catch (error) {
    console.warn(`[Landing Page Config] Fallback used for ${slug}:`, error instanceof Error ? error.message : error)
    return fallback
  }
}
