import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { verifyAdminSession } from "@/lib/admin-auth"
import { areaRepository } from "@/lib/repositories"
import { revalidateAreaLandingData } from "@/lib/country-content"
import type { AreaResource } from "@/lib/domain/area-content"

const resourceSchema = z.enum(["content", "packages", "faq", "links", "themes", "cities", "timezones"])
const idSchema = z.coerce.number().int().positive()
const patchSchema = z.object({
  resource: resourceSchema,
  id: idSchema,
  changes: z.record(z.string(), z.unknown()),
}).strict()
const deleteSchema = z.object({ resource: z.literal("packages"), id: idSchema }).strict()
const createPackageSchema = z.object({
  area_id: idSchema,
  program: z.enum(["quran", "arabic", "other"]),
  name_ar: z.string().trim().min(2).max(180),
  price: z.coerce.number().finite().min(0).max(1000000),
  sessions_per_month: z.coerce.number().int().min(1).max(1000),
  duration_minutes: z.coerce.number().int().min(1).max(240),
  description_ar: z.string().trim().max(700).optional().default(""),
  features_ar: z.array(z.string().trim().min(1).max(160)).max(20).optional().default([]),
  is_popular: z.boolean().optional().default(false),
}).strict()

const fieldAllowList: Record<z.infer<typeof resourceSchema>, Set<string>> = {
  content: new Set(["content_ar", "content_en", "content_fr", "content_type", "section", "href", "is_active", "sort_order"]),
  packages: new Set(["program", "name_ar", "name_en", "name_fr", "description_ar", "description_en", "description_fr", "price", "billing_period", "sessions_per_month", "features_ar", "features_en", "features_fr", "is_popular", "is_active", "sort_order"]),
  faq: new Set(["question_ar", "question_en", "question_fr", "answer_ar", "answer_en", "answer_fr", "is_active", "sort_order"]),
  links: new Set(["label_ar", "label_en", "label_fr", "href", "link_type", "is_external", "is_active", "sort_order"]),
  themes: new Set(["theme_name_ar", "theme_name_en", "primary_color", "secondary_color", "accent_color", "background_color", "text_color", "quran_fact_title_ar", "quran_fact_body_ar", "quran_fact_reference_ar", "is_active", "sort_order"]),
  cities: new Set(["name_ar", "name_en", "region_name", "is_active", "sort_order"]),
  timezones: new Set(["timezone_name", "label_ar", "label_en", "is_primary", "is_active", "sort_order"]),
}

const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/)
const enrichmentChangeSchemas = {
  themes: z.object({
    theme_name_ar: z.string().trim().min(1).max(120),
    theme_name_en: z.string().trim().max(120),
    primary_color: hexColorSchema,
    secondary_color: hexColorSchema,
    accent_color: hexColorSchema,
    background_color: hexColorSchema,
    text_color: hexColorSchema,
    quran_fact_title_ar: z.string().trim().min(1).max(160),
    quran_fact_body_ar: z.string().trim().min(1).max(700),
    quran_fact_reference_ar: z.string().trim().min(1).max(120),
    is_active: z.boolean(),
    sort_order: z.number().int().min(0).max(10000),
  }).partial().strict(),
  cities: z.object({
    name_ar: z.string().trim().min(1).max(100),
    name_en: z.string().trim().min(1).max(100),
    region_name: z.string().trim().max(120),
    is_active: z.boolean(),
    sort_order: z.number().int().min(0).max(10000),
  }).partial().strict(),
  timezones: z.object({
    timezone_name: z.string().trim().regex(/^[A-Za-z_+-]+\/[A-Za-z0-9_+/-]+$/).max(100),
    label_ar: z.string().trim().min(1).max(100),
    label_en: z.string().trim().min(1).max(100),
    is_primary: z.boolean(),
    is_active: z.boolean(),
    sort_order: z.number().int().min(0).max(10000),
  }).partial().strict(),
} as const

function safeChanges(resource: AreaResource, changes: Record<string, unknown>) {
  const allowed = fieldAllowList[resource]
  const filtered = Object.fromEntries(Object.entries(changes).filter(([key]) => allowed.has(key)))
  if (resource !== "themes" && resource !== "cities" && resource !== "timezones") return filtered
  const parsed = enrichmentChangeSchemas[resource].safeParse(filtered)
  return parsed.success ? parsed.data : {}
}

async function requireRepository() {
  if (!areaRepository) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  return null
}

export async function GET(request: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const repositoryError = await requireRepository()
  if (repositoryError) return repositoryError

  try {
    const slug = request.nextUrl.searchParams.get("slug")
    const snapshot = await areaRepository!.getAdminSnapshot(slug)
    return NextResponse.json(snapshot, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("[Admin Areas] failed to load", error)
    return NextResponse.json({ error: "Failed to load area data" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const repositoryError = await requireRepository()
  if (repositoryError) return repositoryError
  const parsed = patchSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: "Invalid area update" }, { status: 400 })
  const changes = safeChanges(parsed.data.resource, parsed.data.changes)
  if (!Object.keys(changes).length) return NextResponse.json({ error: "No editable fields supplied" }, { status: 400 })

  try {
    const updated = await areaRepository!.updateRecord(parsed.data.resource, parsed.data.id, changes)
    if (!updated) return NextResponse.json({ error: "Area record not found" }, { status: 404 })
    if (updated.areaSlug) revalidateAreaLandingData(updated.areaSlug)
    return NextResponse.json({ data: updated.record }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("[Admin Areas] failed to update record", error)
    return NextResponse.json({ error: "Failed to update area record" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const repositoryError = await requireRepository()
  if (repositoryError) return repositoryError
  const parsed = createPackageSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: "بيانات الباقة غير صحيحة" }, { status: 400 })

  try {
    const created = await areaRepository!.createPackage(parsed.data)
    if (!created) return NextResponse.json({ error: "الدولة المحددة غير موجودة أو غير نشطة" }, { status: 404 })
    if (created.areaSlug) revalidateAreaLandingData(created.areaSlug)
    return NextResponse.json({ data: created.record }, { status: 201, headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("[Admin Areas] failed to create package", error)
    return NextResponse.json({ error: "تعذر إنشاء الباقة في قاعدة البيانات" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const repositoryError = await requireRepository()
  if (repositoryError) return repositoryError
  const parsed = deleteSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: "Only package records can be deleted" }, { status: 400 })

  try {
    const deleted = await areaRepository!.deletePackage(parsed.data.id)
    if (!deleted) return NextResponse.json({ error: "Package not found" }, { status: 404 })
    if (deleted.areaSlug) revalidateAreaLandingData(deleted.areaSlug)
    return NextResponse.json({ deleted: true, id: deleted.record.id }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("[Admin Areas] failed to delete package", error)
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 })
  }
}
