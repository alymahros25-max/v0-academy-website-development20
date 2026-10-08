import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/api-auth"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { revalidateThemeSettings } from "@/lib/api-revalidate"

export const dynamic = "force-dynamic"

const whatsappSchema = z.object({
  position: z.enum(["left", "right"]),
  phone: z.string().trim().regex(/^\+?[0-9]{8,15}$/),
  size: z.enum(["small", "medium", "large"]),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  showLabel: z.boolean(),
  labelAr: z.string().trim().max(80),
  labelEn: z.string().trim().max(80),
  labelFr: z.string().trim().max(80),
}).strict()

const navbarSchema = z.object({
  items: z.array(z.enum(["home", "about", "quran", "arabic", "teachers", "reviews", "library", "classroom", "games", "faq", "blog", "contact", "account"])).max(30),
}).strict()

const writeSchema = z.object({
  widget_type: z.enum(["whatsapp_button", "navbar"]),
  config_json: z.unknown(),
  is_enabled: z.boolean().optional(),
  display_order: z.number().int().min(0).max(10000).optional(),
}).strict()

function parseBody(body: unknown) {
  const base = writeSchema.safeParse(body)
  if (!base.success) return { error: "Invalid widget payload", issues: base.error.issues } as const
  const config = base.data.widget_type === "whatsapp_button"
    ? whatsappSchema.safeParse(base.data.config_json)
    : navbarSchema.safeParse(base.data.config_json)
  if (!config.success) return { error: "Invalid widget configuration", issues: config.error.issues } as const
  return { data: { ...base.data, config_json: config.data } } as const
}

export async function GET(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured", data: [], storageConfigured: false }, { status: 503 })
  const type = request.nextUrl.searchParams.get("type")
  if (type && type !== "whatsapp_button" && type !== "navbar") return NextResponse.json({ error: "Invalid widget type" }, { status: 400 })
  let query = supabaseAdmin.from("widget_configs").select("id,widget_type,config_json,is_enabled,display_order,updated_at").order("display_order", { ascending: true })
  if (type) query = query.eq("widget_type", type)
  const { data, error } = await query
  if (error) {
    console.error("[CMS widgets] Read failed:", error.message)
    return NextResponse.json({ error: "Failed to load widget settings" }, { status: 500 })
  }
  return NextResponse.json({ data: data ?? [], storageConfigured: true })
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }) }
  const parsed = parseBody(raw)
  if ("error" in parsed) return NextResponse.json({ error: parsed.error, issues: parsed.issues }, { status: 400 })
  const { data, error } = await supabaseAdmin.from("widget_configs").upsert({
    widget_type: parsed.data.widget_type,
    config_json: parsed.data.config_json,
    is_enabled: parsed.data.is_enabled ?? true,
    display_order: parsed.data.display_order ?? 0,
    updated_at: new Date().toISOString(),
  }, { onConflict: "widget_type" }).select("id,widget_type,config_json,is_enabled,display_order,updated_at").single()
  if (error) {
    console.error("[CMS widgets] Save failed:", error.message)
    return NextResponse.json({ error: "Failed to save widget settings" }, { status: 500 })
  }
  await revalidateThemeSettings()
  return NextResponse.json({ success: true, data }, { status: 200 })
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  const type = request.nextUrl.searchParams.get("type")
  if (type !== "whatsapp_button" && type !== "navbar") return NextResponse.json({ error: "Invalid widget type" }, { status: 400 })
  const { error } = await supabaseAdmin.from("widget_configs").delete().eq("widget_type", type)
  if (error) return NextResponse.json({ error: "Failed to delete widget settings" }, { status: 500 })
  await revalidateThemeSettings()
  return NextResponse.json({ success: true })
}
