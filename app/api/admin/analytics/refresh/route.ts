import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/api-auth"
import { getRange, refreshAnalytics } from "@/lib/analytics-server"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  const { start, end } = getRange(new URL(request.url).searchParams)
  try {
    const result = await refreshAnalytics(start, end)
    return NextResponse.json({ start, end, result })
  } catch (error) {
    console.error("[Analytics API] Refresh error:", error)
    return NextResponse.json({ error: "Failed to refresh analytics" }, { status: 500 })
  }
}
