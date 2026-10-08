import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  if (!supabaseAdmin) return NextResponse.json({ data: [], source: "unconfigured" }, { headers: { "Cache-Control": "no-store" } })
  const { data, error } = await supabaseAdmin.from("widget_configs").select("widget_type,config_json,is_enabled,display_order").eq("is_enabled", true).order("display_order", { ascending: true })
  if (error) {
    console.error("[Public widgets] Read failed:", error.message)
    return NextResponse.json({ error: "Widgets temporarily unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } })
  }
  return NextResponse.json({ data: data ?? [], source: "database" }, { headers: { "Cache-Control": "no-store" } })
}
