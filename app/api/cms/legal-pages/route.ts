import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/api-auth"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const dynamic = "force-dynamic"
const pageSlugSchema = z.enum(["terms", "privacy", "refund-policy"])
const localeSchema = z.enum(["ar", "en", "fr"])

export async function GET(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!supabaseAdmin) return NextResponse.json({ error: "Database is not configured" }, { status: 503 })
  const parsed = pageSlugSchema.safeParse(request.nextUrl.searchParams.get("page"))
  if (!parsed.success) return NextResponse.json({ error: "Invalid legal page" }, { status: 400 })
  const { data, error } = await supabaseAdmin.from("legal_pages")
    .select("id,page_slug,locale,title,content,created_at,updated_at")
    .eq("page_slug", parsed.data).order("locale", { ascending: true })
  if (error) {
    console.error("[CMS legal pages] Read failed:", error.message)
    return NextResponse.json({ error: "Failed to load legal pages" }, { status: 500 })
  }
  return NextResponse.json(data ?? [], { headers: { "Cache-Control": "no-store" } })
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!supabaseAdmin) return NextResponse.json({ error: "Database is not configured" }, { status: 503 })
  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }) }
  const parsed = z.object({
    page_slug: pageSlugSchema,
    locale: localeSchema,
    title: z.string().trim().min(1).max(180),
    content: z.string().max(100000),
  }).strict().safeParse(raw)
  if (!parsed.success) return NextResponse.json({ error: "Invalid legal page content", issues: parsed.error.issues }, { status: 400 })
  const { data, error } = await supabaseAdmin.from("legal_pages")
    .upsert({ ...parsed.data, updated_at: new Date().toISOString() }, { onConflict: "page_slug,locale" })
    .select("id,page_slug,locale,title,content,created_at,updated_at").single()
  if (error) {
    console.error("[CMS legal pages] Save failed:", error.message)
    return NextResponse.json({ error: "Failed to save legal page" }, { status: 500 })
  }
  return NextResponse.json({ success: true, data }, { headers: { "Cache-Control": "no-store" } })
}
