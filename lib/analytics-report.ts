import type { AnalyticsSnapshot, AnalyticsSourceHealth } from "@/lib/analytics-types"

type ReportData = {
  snapshots: AnalyticsSnapshot[]
  health: AnalyticsSourceHealth[]
  internalEvents: Array<Record<string, string | null>>
}

function snapshot(data: ReportData, source: string, reportType: string) {
  return data.snapshots.find((item) => item.source_key === source && item.report_type === reportType)
}

export function buildAnalyticsReport(data: ReportData, start: string, end: string) {
  const overview = snapshot(data, "ga4", "overview")
  const gsc = snapshot(data, "search_console", "performance")
  const pages = (snapshot(data, "ga4", "top_pages")?.dimensions.rows ?? []) as Array<Record<string, string | number>>
  const traffic = (snapshot(data, "ga4", "traffic")?.dimensions.rows ?? []) as Array<Record<string, string | number>>
  const lines = [
    "تقرير تحليلات quran-elhafez.com",
    `الفترة: ${start} إلى ${end}`,
    `تاريخ الإنشاء: ${new Date().toISOString()}`,
    "",
    "Google Analytics 4",
    `Sessions: ${overview?.metrics.sessions ?? "—"}`,
    `Active Users: ${overview?.metrics.activeUsers ?? "—"}`,
    `Views: ${overview?.metrics.screenPageViews ?? "—"}`,
    `Events: ${overview?.metrics.eventCount ?? "—"}`,
    "",
    "أهم الصفحات",
    ...pages.slice(0, 20).map((row) => `${row.path ?? "—"}: ${row.views ?? "—"} مشاهدة`),
    "",
    "مصادر الجلسات",
    ...traffic.slice(0, 20).map((row) => `${row.source ?? "—"} / ${row.medium ?? "—"}: ${row.sessions ?? "—"} جلسة`),
    "",
    "Google Search Console",
    `Clicks: ${gsc?.metrics.clicks ?? "—"}`,
    `Impressions: ${gsc?.metrics.impressions ?? "—"}`,
    `CTR: ${typeof gsc?.metrics.ctr === "number" ? `${(gsc.metrics.ctr * 100).toFixed(2)}%` : "—"}`,
    `Average Position: ${gsc?.metrics.averagePosition ?? "—"}`,
    "",
    `الأحداث الداخلية المؤكدة: ${data.internalEvents.length}`,
    "",
    "حالة المصادر",
    ...data.health.map((item) => `${item.display_name}: ${item.last_status}${item.last_error_message ? ` — ${item.last_error_message}` : ""}`),
  ]
  return lines.join("\n")
}

export function reportSubject(start: string, end: string) {
  return `تقرير تحليلات الموقع | ${start} إلى ${end}`
}

export function reportHtml(text: string) {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  return `<div dir="rtl" style="font-family:Arial,sans-serif;white-space:pre-wrap;line-height:1.8">${escaped}</div>`
}
