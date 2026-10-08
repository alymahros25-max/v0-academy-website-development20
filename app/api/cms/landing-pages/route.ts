import { NextRequest, NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { z } from "zod"
import { requireAdmin } from "@/lib/api-auth"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { defaultLandingPageConfigs, landingPageConfigSchema, landingPageSlugs, type LandingPageSlug } from "@/lib/domain/landing-page-config"

export const dynamic = "force-dynamic"

const slugSchema = z.enum(landingPageSlugs)

export async function GET(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  const parsedSlug = slugSchema.safeParse(request.nextUrl.searchParams.get("slug"))
  if (!parsedSlug.success) return NextResponse.json({ error: "Invalid landing page slug" }, { status: 400 })
  const slug = parsedSlug.data
  if (!supabaseAdmin) return NextResponse.json({ data: defaultLandingPageConfigs[slug], storageConfigured: false })
  const { data, error } = await supabaseAdmin.from("landing_page_configs").select("config_json,updated_at").eq("slug", slug).maybeSingle()
  if (error) {
    console.error("[CMS landing pages] Read failed:", error.message)
    return NextResponse.json({ error: "Failed to load landing page settings" }, { status: 500 })
  }
  const merged = data?.config_json && typeof data.config_json === "object"
    ? { ...defaultLandingPageConfigs[slug], ...(data.config_json as object), seo: { ...defaultLandingPageConfigs[slug].seo, ...((data.config_json as { seo?: object }).seo ?? {}) } }
    : defaultLandingPageConfigs[slug]
  const validated = landingPageConfigSchema.safeParse(merged)
  return NextResponse.json({ data: validated.success ? validated.data : defaultLandingPageConfigs[slug], storageConfigured: true, updatedAt: data?.updated_at ?? null })
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!supabaseAdmin) return NextResponse.json({ error: "Database is not configured" }, { status: 503 })
  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }) }
  const envelope = z.object({ slug: slugSchema, config: landingPageConfigSchema }).strict().safeParse(raw)
  if (!envelope.success) return NextResponse.json({ error: "Invalid landing page settings", issues: envelope.error.issues }, { status: 400 })
  const { slug, config } = envelope.data
  const { data, error } = await supabaseAdmin.from("landing_page_configs")
    .upsert({ slug, config_json: config, updated_at: new Date().toISOString() }, { onConflict: "slug" })
    .select("slug,config_json,updated_at").single()
  if (error) {
    console.error("[CMS landing pages] Save failed:", error.message)
    return NextResponse.json({ error: "Failed to save landing page settings" }, { status: 500 })
  }
  const route = slug === "uae" ? "/united-arab-emirates" : "/saudi-arabia"
  revalidateTag(`landing-page:${slug}`, { expire: 0 })
  revalidatePath(route)
  return NextResponse.json({ success: true, data: data.config_json, updatedAt: data.updated_at })
}
