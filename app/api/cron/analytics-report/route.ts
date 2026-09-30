import { NextRequest, NextResponse } from "next/server"
import { getAnalyticsDashboard, refreshAnalytics } from "@/lib/analytics-server"
import { buildAnalyticsReport, reportHtml, reportSubject } from "@/lib/analytics-report"

export const dynamic = "force-dynamic"
export const maxDuration = 60

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10)
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET?.trim()
  const authorization = request.headers.get("authorization")
  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const resendKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.ANALYTICS_REPORT_FROM?.trim() || process.env.FROM_EMAIL?.trim() || process.env.CONTACT_FROM_EMAIL?.trim()
  const to = process.env.ANALYTICS_REPORT_TO?.trim() || "alymahros25@gmail.com"
  if (!resendKey || !from) {
    return NextResponse.json({ error: "Report email is not configured" }, { status: 500 })
  }

  const end = dateOnly(new Date())
  const start = dateOnly(new Date(Date.now() - 24 * 60 * 60 * 1000))

  try {
    const refreshResult = await refreshAnalytics(start, end)
    const dashboard = await getAnalyticsDashboard(start, end)
    const text = buildAnalyticsReport(dashboard, start, end)
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: reportSubject(start, end),
        html: reportHtml(text),
        text,
      }),
    })
    if (!response.ok) {
      const detail = await response.text()
      throw new Error(`Resend ${response.status}: ${detail.slice(0, 240)}`)
    }
    return NextResponse.json({ ok: true, start, end, to, sources: refreshResult.map((item) => ({ source: item.source, error: item.error })) })
  } catch (error) {
    console.error("[Analytics Report Cron]", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Report failed" }, { status: 500 })
  }
}
