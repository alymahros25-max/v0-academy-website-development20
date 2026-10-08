import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireAdmin } from "@/lib/api-auth"
import { siteFaqRepository } from "@/lib/repositories"

const faqSchema = z.object({
  question_ar: z.string().trim().min(1).max(500),
  question_en: z.string().trim().max(500).nullable().optional(),
  question_fr: z.string().trim().max(500).nullable().optional(),
  answer_ar: z.string().trim().min(1).max(10000),
  answer_en: z.string().trim().max(10000).nullable().optional(),
  answer_fr: z.string().trim().max(10000).nullable().optional(),
  category: z.string().trim().min(1).max(50).default("general"),
  sort_order: z.number().int().min(0).max(100000).default(0),
  is_active: z.boolean().default(true),
}).strict()
const idSchema = z.coerce.number().int().positive()

function revalidateFaqPages() {
  revalidatePath("/faq")
  revalidatePath("/")
}

export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!siteFaqRepository) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  try {
    return NextResponse.json(await siteFaqRepository.listAdmin(), { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("[Admin FAQ] read failed", error)
    return NextResponse.json({ error: "Failed to load FAQ" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!siteFaqRepository) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) }
  const parsed = faqSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid FAQ data" }, { status: 400 })
  try {
    const item = await siteFaqRepository.create(parsed.data)
    revalidateFaqPages()
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("[Admin FAQ] create failed", error)
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!siteFaqRepository) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) }
  if (!body || typeof body !== "object" || !("id" in body) || !("data" in body)) return NextResponse.json({ error: "ID and data are required" }, { status: 400 })
  const parsedId = idSchema.safeParse(body.id)
  const parsed = faqSchema.partial().safeParse(body.data)
  if (!parsedId.success || !parsed.success || !Object.keys(parsed.data ?? {}).length) return NextResponse.json({ error: "Invalid FAQ update" }, { status: 400 })
  try {
    const item = await siteFaqRepository.update(parsedId.data, parsed.data)
    if (!item) return NextResponse.json({ error: "FAQ not found" }, { status: 404 })
    revalidateFaqPages()
    return NextResponse.json(item)
  } catch (error) {
    console.error("[Admin FAQ] update failed", error)
    return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!siteFaqRepository) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  const parsedId = idSchema.safeParse(new URL(request.url).searchParams.get("id"))
  if (!parsedId.success) return NextResponse.json({ error: "Invalid FAQ id" }, { status: 400 })
  try {
    const deleted = await siteFaqRepository.delete(parsedId.data)
    if (!deleted) return NextResponse.json({ error: "FAQ not found" }, { status: 404 })
    revalidateFaqPages()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Admin FAQ] delete failed", error)
    return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 })
  }
}
