import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/api-auth"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { revalidateDynamicPages } from "@/lib/api-revalidate"
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/youtube-utils"

export const dynamic = "force-dynamic"

const videoSchema = z.object({
  id: z.string().uuid().optional(),
  title_ar: z.string().trim().min(1).max(200),
  title_en: z.string().trim().min(1).max(200),
  title_fr: z.string().trim().min(1).max(200),
  description_ar: z.string().max(5000).optional(),
  description_en: z.string().max(5000).optional(),
  description_fr: z.string().max(5000).optional(),
  teacher_name_ar: z.string().max(160).optional(),
  teacher_name_en: z.string().max(160).optional(),
  teacher_name_fr: z.string().max(160).optional(),
  youtube_url: z.string().url().max(1000),
  youtube_embed_id: z.string().optional(),
  thumbnail_url: z.string().url().max(2000).nullable().optional(),
  category: z.string().trim().min(1).max(80).optional(),
  duration_seconds: z.number().int().min(0).max(86400).nullable().optional(),
  is_published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  show_on_landing_pages: z.boolean().optional(),
  display_order: z.number().int().min(0).max(100000).optional(),
}).strict()

type VideoInput = z.infer<typeof videoSchema>

export async function GET(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured", data: [] }, { status: 503 })
  const params = request.nextUrl.searchParams
  const limitValue = params.get("limit")
  const limit = limitValue === null ? 50 : Number(limitValue)
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) return NextResponse.json({ error: "Invalid limit" }, { status: 400 })
  let query = supabaseAdmin.from("classroom_videos").select("*").order("display_order", { ascending: true }).order("created_at", { ascending: false }).limit(limit)
  const id = params.get("id")
  const category = params.get("category")
  const featured = params.get("featured")
  const published = params.get("published")
  if (id) query = query.eq("id", id)
  if (category) query = query.eq("category", category)
  if (featured === "true") query = query.eq("is_featured", true)
  if (published === "true" || published === "false") query = query.eq("is_published", published === "true")
  const { data, error } = await query
  if (error) {
    console.error("[CMS classroom videos] Read failed:", error.message)
    return NextResponse.json({ error: "Failed to fetch videos", data: [] }, { status: 500 })
  }
  return NextResponse.json({ data: data ?? [] })
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }) }
  const parsed = videoSchema.safeParse(raw)
  if (!parsed.success) return NextResponse.json({ error: "Invalid video data", issues: parsed.error.issues }, { status: 400 })
  const body: VideoInput = parsed.data
  const embedId = extractYouTubeId(body.youtube_url)
  if (!embedId) return NextResponse.json({ error: "Invalid YouTube URL format" }, { status: 400 })
  const { data: last } = await supabaseAdmin.from("classroom_videos").select("display_order").order("display_order", { ascending: false }).limit(1).maybeSingle()
  const { data, error } = await supabaseAdmin.from("classroom_videos").insert({
    title_ar: body.title_ar,
    title_en: body.title_en,
    title_fr: body.title_fr,
    description_ar: body.description_ar ?? "",
    description_en: body.description_en ?? "",
    description_fr: body.description_fr ?? "",
    teacher_name_ar: body.teacher_name_ar ?? "",
    teacher_name_en: body.teacher_name_en ?? "",
    teacher_name_fr: body.teacher_name_fr ?? "",
    youtube_url: body.youtube_url,
    youtube_embed_id: embedId,
    thumbnail_url: body.thumbnail_url ?? getYouTubeThumbnail(embedId, "high"),
    category: body.category ?? "عام",
    duration_seconds: body.duration_seconds ?? null,
    is_published: body.is_published ?? false,
    is_featured: body.is_featured ?? false,
    show_on_landing_pages: body.show_on_landing_pages ?? false,
    display_order: body.display_order ?? Number(last?.display_order ?? -1) + 1,
  }).select("*").single()
  if (error) return NextResponse.json({ error: error.code === "23505" ? "This video already exists" : "Failed to create video" }, { status: error.code === "23505" ? 409 : 500 })
  await revalidateDynamicPages()
  return NextResponse.json({ success: true, data }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  const id = z.string().uuid().safeParse(request.nextUrl.searchParams.get("id"))
  if (!id.success) return NextResponse.json({ error: "A valid video ID is required" }, { status: 400 })
  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }) }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return NextResponse.json({ error: "Invalid video data" }, { status: 400 })
  const bodyObject = raw as Record<string, unknown>
  const { id: _bodyId, youtube_embed_id: _clientEmbedId, ...fields } = bodyObject
  const parsed = videoSchema.omit({ id: true, youtube_embed_id: true }).partial().safeParse(fields)
  if (!parsed.success || Object.keys(parsed.success ? parsed.data : {}).length === 0) return NextResponse.json({ error: "Invalid video data", issues: parsed.success ? undefined : parsed.error.issues }, { status: 400 })
  const update = parsed.data
  const updateData: Record<string, unknown> = { ...update, updated_at: new Date().toISOString() }
  if (update.youtube_url) {
    const embedId = extractYouTubeId(update.youtube_url)
    if (!embedId) return NextResponse.json({ error: "Invalid YouTube URL format" }, { status: 400 })
    updateData.youtube_embed_id = embedId
    if (update.thumbnail_url === undefined) updateData.thumbnail_url = getYouTubeThumbnail(embedId, "high")
  }
  const { data, error } = await supabaseAdmin.from("classroom_videos").update(updateData).eq("id", id.data).select("*").maybeSingle()
  if (error) return NextResponse.json({ error: error.code === "23505" ? "This video already exists" : "Failed to update video" }, { status: error.code === "23505" ? 409 : 500 })
  if (!data) return NextResponse.json({ error: "Video not found" }, { status: 404 })
  await revalidateDynamicPages()
  return NextResponse.json({ success: true, data })
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  const id = z.string().uuid().safeParse(request.nextUrl.searchParams.get("id"))
  if (!id.success) return NextResponse.json({ error: "A valid video ID is required" }, { status: 400 })
  const { data, error } = await supabaseAdmin.from("classroom_videos").delete().eq("id", id.data).select("id").maybeSingle()
  if (error) return NextResponse.json({ error: "Failed to delete video" }, { status: 500 })
  if (!data) return NextResponse.json({ error: "Video not found" }, { status: 404 })
  await revalidateDynamicPages()
  return NextResponse.json({ success: true })
}
