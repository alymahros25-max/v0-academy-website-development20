import { requireAdmin } from "@/lib/api-auth"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { siteContentRepository } from "@/lib/repositories"
import { revalidateContentChanges } from "@/lib/api-revalidate"

const localeSchema = z.enum(["ar", "en", "fr", "all"])
const contentWriteSchema = z.object({
  key: z.string().trim().min(1).max(180),
  content_ar: z.string().max(20000).nullable().optional(),
  content_en: z.string().max(20000).nullable().optional(),
  content_fr: z.string().max(20000).nullable().optional(),
  section: z.string().trim().min(1).max(100).optional().default("general"),
  type: z.string().trim().min(1).max(40).optional().default("text"),
  is_active: z.boolean().optional().default(true),
}).strict().refine((value) => Boolean(value.content_ar || value.content_en || value.content_fr), {
  message: "At least one language content is required",
})

export async function GET(request: NextRequest) {
  if (!siteContentRepository) return NextResponse.json({ error: "Database not configured", data: [] }, { status: 503 })
  const { searchParams } = request.nextUrl
  const localeResult = searchParams.has("locale") ? localeSchema.safeParse(searchParams.get("locale")) : { success: true as const, data: "all" as const }
  if (!localeResult.success) return NextResponse.json({ error: "Invalid locale" }, { status: 400 })
  const key = searchParams.get("key")?.trim() || undefined
  const section = searchParams.get("section")?.trim() || undefined
  if (key && key.length > 180 || section && section.length > 100) return NextResponse.json({ error: "Invalid content filter" }, { status: 400 })

  try {
    const data = await siteContentRepository.list({ key, section })
    const locale = localeResult.data
    const transformedData = data.map((item) => {
      if (locale !== "all") {
        const contentKey = `content_${locale}` as const
        return { key: item.key, content: item[contentKey], section: item.section, type: item.type }
      }
      return item
    })
    return NextResponse.json({ success: true, data: transformedData, count: transformedData.length }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("[CMS Content] read failed", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!siteContentRepository) return NextResponse.json({ error: "Database not configured" }, { status: 503 })

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
  }
  const parsed = contentWriteSchema.safeParse(raw)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid content" }, { status: 400 })

  try {
    const data = await siteContentRepository.upsert({
      key: parsed.data.key,
      content_ar: parsed.data.content_ar ?? null,
      content_en: parsed.data.content_en ?? null,
      content_fr: parsed.data.content_fr ?? null,
      section: parsed.data.section,
      type: parsed.data.type,
      is_active: parsed.data.is_active,
    })
    await revalidateContentChanges()
    return NextResponse.json({ success: true, data, message: "Content saved successfully", revalidated: true }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("[CMS Content] write failed", error)
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!siteContentRepository) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  const key = request.nextUrl.searchParams.get("key")?.trim()
  if (!key || key.length > 180) return NextResponse.json({ error: "Valid content key is required" }, { status: 400 })

  try {
    await siteContentRepository.delete(key)
    await revalidateContentChanges()
    return NextResponse.json({ success: true, message: "Content deleted successfully" }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("[CMS Content] delete failed", error)
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 })
  }
}
