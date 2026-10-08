import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import { verifyAdminSession } from "@/lib/admin-auth"
import { z } from "zod"

export const dynamic = "force-dynamic"

const documentSchema = z.object({
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title_ar: z.string().trim().min(1).max(300),
  title_en: z.string().trim().max(300).nullable().optional(),
  title_fr: z.string().trim().max(300).nullable().optional(),
  description_ar: z.string().max(5000).nullable().optional(),
  description_en: z.string().max(5000).nullable().optional(),
  description_fr: z.string().max(5000).nullable().optional(),
  surahs_ar: z.string().max(1000).nullable().optional(),
  author_ar: z.string().max(200).nullable().optional(),
  author_en: z.string().max(200).nullable().optional(),
  author_fr: z.string().max(200).nullable().optional(),
  category: z.string().trim().min(1).max(100),
  tags: z.array(z.string().trim().min(1).max(60)).max(50),
  drive_url: z.string().url().max(2000).refine((value) => {
    try {
      const url = new URL(value)
      return url.protocol === "https:" && ["drive.google.com", "docs.google.com"].includes(url.hostname.toLowerCase())
    } catch { return false }
  }, "Only HTTPS Google Drive or Google Docs links are accepted"),
  file_type: z.enum(["pdf", "document", "text", "image", "audio"]),
  cover_url: z.string().url().max(2000).nullable().optional(),
  is_published: z.boolean().optional(),
  sort_order: z.number().int().min(0).max(100000).optional(),
}).strict()

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null

function unavailable() {
  return NextResponse.json({ error: "Database not configured", data: [] }, { status: 503 })
}

export async function GET(request: NextRequest) {
  const admin = request.nextUrl.searchParams.get("admin") === "true"
  if (admin && !(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!supabase) return unavailable()
  let query = supabase.from("digital_library_documents").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false })
  if (!admin) query = query.eq("is_published", true)
  const category = request.nextUrl.searchParams.get("category")
  if (category) query = query.eq("category", category)
  const { data, error } = await query
  if (error) {
    console.error("[library] Read failed:", error.message)
    return NextResponse.json({ error: "Failed to load library" }, { status: 500 })
  }
  return NextResponse.json({ data: data ?? [] }, { headers: { "Cache-Control": admin ? "no-store" : "public, s-maxage=300, stale-while-revalidate=600" } })
}

export async function POST(request: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!supabase) return unavailable()
  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }) }
  const parsed = documentSchema.safeParse(raw)
  if (!parsed.success) return NextResponse.json({ error: "Invalid document data", issues: parsed.error.issues }, { status: 400 })
  const { data, error } = await supabase.from("digital_library_documents").insert(parsed.data).select().single()
  if (error) return NextResponse.json({ error: error.code === "23505" ? "هذا المعرّف المختصر مستخدم بالفعل" : "تعذر إنشاء المستند" }, { status: error.code === "23505" ? 409 : 500 })
  revalidatePath("/library")
  return NextResponse.json({ success: true, data }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!supabase) return unavailable()
  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }) }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return NextResponse.json({ error: "Invalid document data" }, { status: 400 })
  const body = raw as Record<string, unknown>
  const id = z.string().uuid().safeParse(body.id)
  const { id: _id, ...fields } = body
  const parsed = documentSchema.partial().safeParse(fields)
  if (!id.success || !parsed.success || Object.keys(parsed.success ? parsed.data : {}).length === 0) return NextResponse.json({ error: "Invalid document data", issues: parsed.success ? undefined : parsed.error.issues }, { status: 400 })
  const { data, error } = await supabase.from("digital_library_documents").update({ ...parsed.data, updated_at: new Date().toISOString() }).eq("id", id.data).select().maybeSingle()
  if (error) return NextResponse.json({ error: "تعذر تحديث المستند" }, { status: 500 })
  if (!data) return NextResponse.json({ error: "المستند غير موجود" }, { status: 404 })
  revalidatePath("/library")
  return NextResponse.json({ success: true, data })
}

export async function DELETE(request: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!supabase) return unavailable()
  const id = z.string().uuid().safeParse(request.nextUrl.searchParams.get("id"))
  if (!id.success) return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  const { data, error } = await supabase.from("digital_library_documents").delete().eq("id", id.data).select("id").maybeSingle()
  if (error) return NextResponse.json({ error: "تعذر حذف المستند" }, { status: 500 })
  if (!data) return NextResponse.json({ error: "المستند غير موجود" }, { status: 404 })
  revalidatePath("/library")
  return NextResponse.json({ success: true })
}
