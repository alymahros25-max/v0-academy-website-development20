import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  const { data, error } = await supabaseAdmin.from("classroom_videos").select("*").eq("is_published", true).order("display_order", { ascending: true }).order("created_at", { ascending: false })
  if (error) {
    console.error("[Public classroom videos] Read failed:", error.message)
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
  return NextResponse.json(data ?? [], { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } })
}
