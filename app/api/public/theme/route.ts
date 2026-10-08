import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const dynamic = "force-dynamic"
export const revalidate = 0

const defaultTheme = {
  primary_color: "#1a4d2e",
  accent_color: "#d4af37",
  background_color: "#ffffff",
  foreground_color: "#171717",
}

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ data: defaultTheme, source: "fallback" }, { headers: { "Cache-Control": "no-store" } })
  }
  const { data, error } = await supabaseAdmin.from("theme_customizations").select("primary_color,accent_color,background_color,foreground_color,updated_at").eq("id", 1).maybeSingle()
  if (error) {
    console.error("[Public theme] Read failed:", error.message)
    return NextResponse.json({ error: "Theme temporarily unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } })
  }
  return NextResponse.json({ data: data ?? defaultTheme, source: data ? "database" : "fallback" }, { headers: { "Cache-Control": "no-store" } })
}
