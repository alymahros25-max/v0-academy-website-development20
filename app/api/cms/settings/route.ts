import { requireAdmin } from "@/lib/api-auth"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { siteSettingsRepository } from "@/lib/repositories"
import { revalidateThemeSettings } from "@/lib/api-revalidate"

const valueTypeSchema = z.enum(["color", "text", "url", "number", "json"])
const settingSchema = z.object({
  setting_key: z.string().trim().min(1).max(180),
  setting_value: z.string().max(20000),
  value_type: valueTypeSchema.optional().default("text"),
  label: z.string().trim().max(180).nullable().optional().default(null),
  description: z.string().trim().max(1000).nullable().optional().default(null),
  category: z.string().trim().min(1).max(100).optional().default("general"),
}).strict().superRefine((setting, context) => {
  if (setting.value_type === "color" && !/^#[0-9A-F]{6}$/i.test(setting.setting_value)) {
    context.addIssue({ code: "custom", path: ["setting_value"], message: "Invalid color format. Use hex format like #FF0000" })
  }
})
const settingsBatchSchema = z.array(settingSchema).min(1).max(100)

async function revalidateSettings() {
  try {
    await revalidateThemeSettings()
  } catch (error) {
    console.warn("[CMS Settings] revalidation warning:", error)
  }
}

export async function GET(request: NextRequest) {
  if (!siteSettingsRepository) return NextResponse.json({ error: "Database not configured", data: [] }, { status: 503 })
  const key = request.nextUrl.searchParams.get("key")?.trim() || null
  const category = request.nextUrl.searchParams.get("category")?.trim() || null
  if (key && key.length > 180 || category && category.length > 100) return NextResponse.json({ error: "Invalid settings filter" }, { status: 400 })

  try {
    const data = await siteSettingsRepository.list({ key, category })
    const settingsMap = Object.fromEntries(data.map((item) => [item.setting_key, item.setting_value]))
    return NextResponse.json({ success: true, data: key || category ? data : settingsMap, count: data.length }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("[CMS Settings] read failed", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!siteSettingsRepository) return NextResponse.json({ error: "Database not configured" }, { status: 503 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
  }
  const parsed = settingSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid setting" }, { status: 400 })

  try {
    const data = await siteSettingsRepository.upsertMany([parsed.data])
    await revalidateSettings()
    return NextResponse.json({ success: true, data: data[0], message: "Setting saved successfully", revalidated: true }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("[CMS Settings] write failed", error)
    return NextResponse.json({ error: "Failed to save setting" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!siteSettingsRepository) return NextResponse.json({ error: "Database not configured" }, { status: 503 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
  }
  const parsed = settingsBatchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid settings batch" }, { status: 400 })

  try {
    const data = await siteSettingsRepository.upsertMany(parsed.data)
    await revalidateSettings()
    return NextResponse.json({ success: true, data, updated_count: data.length, message: "Settings updated successfully", revalidated: true }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("[CMS Settings] batch update failed", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!siteSettingsRepository) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  const key = request.nextUrl.searchParams.get("key")?.trim()
  if (!key || key.length > 180) return NextResponse.json({ error: "Valid setting key is required" }, { status: 400 })

  try {
    await siteSettingsRepository.delete(key)
    await revalidateSettings()
    return NextResponse.json({ success: true, message: "Setting deleted successfully" }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("[CMS Settings] delete failed", error)
    return NextResponse.json({ error: "Failed to delete setting" }, { status: 500 })
  }
}
