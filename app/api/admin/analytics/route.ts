import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/api-auth"
import { getAnalyticsDashboard, getRange, refreshAnalytics } from "@/lib/analytics-server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError
  const { start, end } = getRange(new URL(request.url).searchParams)
  try {
    const refresh = new URL(request.url).searchParams.get("refresh") === "1"
    const refreshResult = refresh ? await refreshAnalytics(start, end) : []
    const dashboard = await getAnalyticsDashboard(start, end)
    return NextResponse.json({ start, end, ...dashboard, refreshResult })
  } catch (error) {
    console.error("[Analytics API] Dashboard error:", error)
    return NextResponse.json({ error: "Failed to load analytics dashboard" }, { status: 500 })
  }
}
