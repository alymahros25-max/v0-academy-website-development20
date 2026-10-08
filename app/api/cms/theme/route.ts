import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/api-auth"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { revalidateThemeSettings } from "@/lib/api-revalidate"

export const dynamic = "force-dynamic"

const themeSchema = z.object({
  primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  accent_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  background_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  foreground_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
}).strict()

const defaultTheme = {
  id: 1,
  primary_color: "#1a4d2e",
  accent_color: "#d4af37",
  background_color: "#ffffff",
  foreground_color: "#171717",
}

export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured", data: defaultTheme, storageConfigured: false }, { status: 503 })
  const { data, error } = await supabaseAdmin.from("theme_customizations").select("id,primary_color,accent_color,background_color,foreground_color,updated_at").eq("id", 1).maybeSingle()
  if (error) {
    console.error("[CMS theme] Read failed:", error.message)
    return NextResponse.json({ error: "Failed to load theme" }, { status: 500 })
  }
  return NextResponse.json({ data: data ?? defaultTheme, storageConfigured: true })
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }) }
  const parsed = themeSchema.safeParse(raw)
  if (!parsed.success) return NextResponse.json({ error: "Invalid theme colors", issues: parsed.error.issues }, { status: 400 })
  const { data, error } = await supabaseAdmin.from("theme_customizations").upsert({ id: 1, ...parsed.data, updated_at: new Date().toISOString() }, { onConflict: "id" }).select("id,primary_color,accent_color,background_color,foreground_color,updated_at").single()
  if (error) {
    console.error("[CMS theme] Save failed:", error.message)
    return NextResponse.json({ error: "Failed to save theme" }, { status: 500 })
  }
  await revalidateThemeSettings()
  return NextResponse.json({ success: true, data })
}
