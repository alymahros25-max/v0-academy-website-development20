import type { AnalyticsSnapshot, AnalyticsSourceHealth } from "@/lib/analytics-types"

type ReportData = {
  snapshots: AnalyticsSnapshot[]
  health: AnalyticsSourceHealth[]
  internalEvents: Array<Record<string, string | null>>
}

const labels: Record<string, string> = {
  path: "المسار | Path",
  title: "العنوان | Title",
  views: "المشاهدات | Views",
  activeUsers: "المستخدمون النشطون | Active users",
  source: "المصدر | Source",
  medium: "الوسيط | Medium",
  sessions: "الجلسات | Sessions",
  eventCount: "الأحداث | Events",
  query: "عبارة البحث | Query",
  page: "الصفحة | Page",
  clicks: "النقرات | Clicks",
  impressions: "الظهور | Impressions",
  ctr: "نسبة النقر | CTR",
  position: "الموضع | Position",
  event_name: "اسم الحدث | Event name",
  occurred_at: "وقت الحدث | Occurred at",
  page_path: "مسار الصفحة | Page path",
  program: "البرنامج | Program",
  country_group: "الدولة/المجموعة | Country group",
}

function snapshot(data: ReportData, source: string, reportType: string) {
  return data.snapshots.find((item) => item.source_key === source && item.report_type === reportType)
}

function table(title: string, columns: string[], rows: Array<Record<string, unknown>>) {
  return [title, columns.map((column) => labels[column] || column).join("\t"), ...(rows.length ? rows.map((row) => columns.map((column) => String(row[column] ?? "—")).join("\t")) : ["لا توجد بيانات | No data"]), ""]
}

export function buildAnalyticsReport(data: ReportData, start: string, end: string) {
  const overview = snapshot(data, "ga4", "overview")
  const gsc = snapshot(data, "search_console", "performance")
  const pages = (snapshot(data, "ga4", "top_pages")?.dimensions.rows ?? []) as Array<Record<string, unknown>>
  const traffic = (snapshot(data, "ga4", "traffic")?.dimensions.rows ?? []) as Array<Record<string, unknown>>
  const queries = (gsc?.dimensions.rows ?? []) as Array<Record<string, unknown>>
  const lines = [
    "تقرير تحليلات الموقع | Website analytics report",
    `الموقع | Website\tquran-elhafez.com`,
    `الفترة | Period\t${start}\t${end}`,
    `تاريخ الإنشاء | Generated at\t${new Date().toISOString()}`,
    "",
    "ملخص المؤشرات | KPI summary",
    "المؤشر | Metric\tالقيمة | Value\tالمصدر | Source",
    `Sessions\t${overview?.metrics.sessions ?? "—"}\tGoogle Analytics 4`,
    `Active Users\t${overview?.metrics.activeUsers ?? "—"}\tGoogle Analytics 4`,
    `Views\t${overview?.metrics.screenPageViews ?? "—"}\tGoogle Analytics 4`,
    `Events\t${overview?.metrics.eventCount ?? "—"}\tGoogle Analytics 4`,
    `Clicks\t${gsc?.metrics.clicks ?? "—"}\tGoogle Search Console`,
    `Impressions\t${gsc?.metrics.impressions ?? "—"}\tGoogle Search Console`,
    `CTR\t${typeof gsc?.metrics.ctr === "number" ? `${(gsc.metrics.ctr * 100).toFixed(2)}%` : "—"}\tGoogle Search Console`,
    `Average Position\t${gsc?.metrics.averagePosition ?? "—"}\tGoogle Search Console`,
    "",
    ...table("أهم الصفحات | Top pages", ["path", "title", "views", "activeUsers"], pages.slice(0, 100)),
    ...table("مصادر الجلسات | Session sources", ["source", "medium", "sessions", "activeUsers", "eventCount"], traffic.slice(0, 100)),
    ...table("استعلامات البحث والصفحات | Search queries and pages", ["query", "page", "clicks", "impressions", "ctr", "position"], queries.slice(0, 100)),
    ...table("الأحداث الداخلية | Internal events", ["event_name", "occurred_at", "page_path", "program", "country_group"], (data.internalEvents ?? []).slice(0, 100)),
    "حالة المصادر | Source health",
    "المصدر | Source\tالحالة | Status\tآخر نجاح | Last success\tعدد الإخفاقات | Failures\tالتفاصيل | Details",
    ...(data.health ?? []).map((item) => [item.display_name, item.last_status, item.last_success_at ? new Date(item.last_success_at).toISOString() : "—", String(item.failure_count), item.last_error_message || "—"].join("\t")),
  ]
  return lines.join("\n")
}

export function reportSubject(start: string, end: string) {
  return `تقرير تحليلات الموقع | Website analytics report | ${start} إلى ${end}`
}

export function reportHtml(text: string) {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  return `<div dir="rtl" style="font-family:Arial,sans-serif;white-space:pre-wrap;line-height:1.8">${escaped}</div>`
}
