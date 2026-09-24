"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Activity, AlertTriangle, BarChart3, Check, CheckCircle2, Clipboard, ExternalLink, RefreshCw, Search, ShieldCheck } from "lucide-react"

type Snapshot = {
  id: number
  source_key: string
  report_type: string
  period_start: string
  period_end: string
  fetched_at: string
  metrics: Record<string, number | string | null>
  dimensions: { rows?: Array<Record<string, string | number>> }
}

type Health = {
  source_key: string
  display_name: string
  last_status: string
  last_attempt_at?: string | null
  last_success_at?: string | null
  last_error_message?: string | null
  failure_count: number
}

type DashboardData = { snapshots: Snapshot[]; health: Health[]; internalEvents: Array<Record<string, string | null>>; storageConfigured: boolean; refreshResult?: Array<{ source: string; error?: string }> }

const sourceLabels: Record<string, string> = {
  ga4: "Google Analytics 4",
  search_console: "Google Search Console",
  internal: "أحداث الموقع المؤكدة | Confirmed site events",
  clarity: "Microsoft Clarity",
  vercel: "Vercel Web Analytics",
  speed_insights: "Vercel Speed Insights",
}

const statusLabels: Record<string, string> = {
  healthy: "يعمل | Healthy",
  failed: "فشل | Failed",
  delayed: "متأخر | Delayed",
  not_configured: "غير مهيأ | Not configured",
  consent_required: "يتطلب موافقة | Consent required",
  disabled: "متوقف | Disabled",
}

const columnLabels: Record<string, string> = {
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

function dateInput(daysAgo: number) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().slice(0, 10)
}

function fmt(value: unknown) {
  return typeof value === "number" ? new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 2 }).format(value) : String(value ?? "—")
}

function snapshot(data: DashboardData | null, source: string, reportType: string) {
  return data?.snapshots.find((item) => item.source_key === source && item.report_type === reportType)
}

function reportText(data: DashboardData | null, start: string, end: string) {
  if (!data) return "لا توجد بيانات تقرير متاحة | No report data available."
  const overview = snapshot(data, "ga4", "overview")
  const gsc = snapshot(data, "search_console", "performance")
  const pages = snapshot(data, "ga4", "top_pages")?.dimensions.rows ?? []
  const traffic = snapshot(data, "ga4", "traffic")?.dimensions.rows ?? []
  const table = (title: string, columns: string[], rows: Array<Record<string, unknown>>) => [title, columns.map((column) => columnLabels[column] || column).join("\t"), ...(rows.length ? rows.map((row) => columns.map((column) => String(row[column] ?? "—")).join("\t")) : ["لا توجد بيانات | No data"]), ""]
  const lines = ["تقرير تحليلات الموقع | Website analytics report", `الموقع | Website\tquran-elhafez.com`, `الفترة | Period\t${start}\t${end}`, `تاريخ الإنشاء | Generated at\t${new Date().toLocaleString("en-GB")}`, "", "ملخص المؤشرات | KPI summary", "المؤشر | Metric\tالقيمة | Value\tالمصدر | Source", `Sessions\t${overview?.metrics.sessions ?? "—"}\tGoogle Analytics 4`, `Active Users\t${overview?.metrics.activeUsers ?? "—"}\tGoogle Analytics 4`, `Views\t${overview?.metrics.screenPageViews ?? "—"}\tGoogle Analytics 4`, `Events\t${overview?.metrics.eventCount ?? "—"}\tGoogle Analytics 4`, `Clicks\t${gsc?.metrics.clicks ?? "—"}\tGoogle Search Console`, `Impressions\t${gsc?.metrics.impressions ?? "—"}\tGoogle Search Console`, `CTR\t${typeof gsc?.metrics.ctr === "number" ? `${(gsc.metrics.ctr * 100).toFixed(2)}%` : "—"}\tGoogle Search Console`, `Average Position\t${gsc?.metrics.averagePosition ?? "—"}\tGoogle Search Console`, "", ...table("أهم الصفحات | Top pages", ["path", "title", "views", "activeUsers"], pages.slice(0, 100)), ...table("مصادر الجلسات | Session sources", ["source", "medium", "sessions", "activeUsers", "eventCount"], traffic.slice(0, 100)), ...table("استعلامات البحث والصفحات | Search queries and pages", ["query", "page", "clicks", "impressions", "ctr", "position"], (snapshot(data, "search_console", "performance")?.dimensions.rows ?? []).slice(0, 100)), ...table("الأحداث الداخلية | Internal events", ["event_name", "occurred_at", "page_path", "program", "country_group"], (data.internalEvents ?? []).slice(0, 100)), "حالة المصادر | Source health", "المصدر | Source\tالحالة | Status\tآخر نجاح | Last success\tعدد الإخفاقات | Failures\tالتفاصيل | Details", ...(data.health ?? []).map((item) => [item.display_name || sourceLabels[item.source_key], statusLabels[item.last_status] || item.last_status, item.last_success_at ? new Date(item.last_success_at).toISOString() : "—", String(item.failure_count), item.last_error_message || "—"].join("\t"))]
  return lines.join("\n")
}

export default function AnalyticsAdminPage() {
  const router = useRouter()
  const [start, setStart] = useState(dateInput(28))
  const [end, setEnd] = useState(dateInput(0))
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const load = useCallback(async (refresh = false) => {
    setError("")
    if (refresh) setRefreshing(true)
    else setLoading(true)
    try {
      const response = await fetch(`/api/admin/analytics?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}${refresh ? "&refresh=1" : ""}`, { cache: "no-store" })
      const body = await response.json()
      if (response.status === 401) { router.push("/admin/login"); return }
      if (!response.ok) throw new Error(body.error || "تعذر تحميل بيانات التحليلات")
      setData(body)
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تحميل البيانات")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [router, start, end])

  useEffect(() => { void load() }, [load])

  const copyReport = async () => {
    await navigator.clipboard.writeText(reportText(data, start, end))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const gaOverview = useMemo(() => snapshot(data, "ga4", "overview"), [data])
  const gscPerformance = useMemo(() => snapshot(data, "search_console", "performance"), [data])
  const gaPages = useMemo(() => snapshot(data, "ga4", "top_pages")?.dimensions.rows ?? [], [data])
  const gaTraffic = useMemo(() => snapshot(data, "ga4", "traffic")?.dimensions.rows ?? [], [data])

  return (
    <main dir="rtl" className="min-h-screen bg-background p-4 text-foreground sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-primary"><BarChart3 className="h-6 w-6" /><span className="text-sm font-semibold">مركز التحليلات متعدد المصادر | Multi-source Analytics Center</span></div>
            <h1 className="text-2xl font-extrabold">تحليلات الموقع | Website Analytics</h1>
            <p className="mt-1 text-sm text-muted-foreground">كل رقم يحتفظ بمصدره وتعريفه ووقت آخر مزامنة | Every metric keeps its source, definition, and last sync time.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin" className="rounded-lg border border-border px-3 py-2 text-sm font-semibold">العودة للوحة الإدارة | Back to Admin</Link>
            <button type="button" onClick={() => void copyReport()} disabled={!data} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold disabled:opacity-60">{copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}{copied ? "تم النسخ | Copied" : "نسخ التقرير | Copy report"}</button>
            <button type="button" onClick={() => void load(true)} disabled={refreshing} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"><RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />{refreshing ? "جاري التحديث | Refreshing" : "تحديث المصادر | Refresh sources"}</button>
          </div>
        </header>

        <section className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4">
          <label className="text-sm">من | From<input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1 block rounded-lg border border-border bg-background px-3 py-2" /></label>
          <label className="text-sm">إلى | To<input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="mt-1 block rounded-lg border border-border bg-background px-3 py-2" /></label>
          <p className="text-xs text-muted-foreground">الفترة تؤثر في تقارير GA4 وSearch Console واللقطات الداخلية | The date range affects GA4, Search Console, and internal snapshots.</p>
        </section>

        {error && <div role="alert" className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"><AlertTriangle className="h-5 w-5" />{error}</div>}
        {data?.refreshResult?.some((item) => item.error) && <div role="alert" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-900"><div className="flex items-center gap-2 font-bold"><AlertTriangle className="h-5 w-5" />نتيجة التحديث</div><ul className="mt-2 list-disc space-y-1 pr-6">{data.refreshResult.filter((item) => item.error).map((item) => <li key={item.source}><strong>{sourceLabels[item.source] || item.source}:</strong> {item.error}</li>)}</ul></div>}
        {loading && <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">جاري تحميل مصادر البيانات | Loading data sources...</div>}

        {!loading && <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="GA4 Sessions" source="Google Analytics 4" value={gaOverview?.metrics.sessions} icon={<Activity className="h-5 w-5" />} />
            <MetricCard label="GA4 Active Users" source="Google Analytics 4" value={gaOverview?.metrics.activeUsers} icon={<Activity className="h-5 w-5" />} />
            <MetricCard label="Search Console Clicks" source="Google Search Console" value={gscPerformance?.metrics.clicks} icon={<Search className="h-5 w-5" />} />
            <MetricCard label="Search Console Impressions" source="Google Search Console" value={gscPerformance?.metrics.impressions} icon={<Search className="h-5 w-5" />} />
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <ReportCard title="Google Analytics 4" source="ga4" fetchedAt={gaOverview?.fetched_at}>
              <div className="grid grid-cols-2 gap-3 text-sm"><Stat label="Sessions" value={gaOverview?.metrics.sessions} /><Stat label="Views" value={gaOverview?.metrics.screenPageViews} /><Stat label="Active Users" value={gaOverview?.metrics.activeUsers} /><Stat label="Events" value={gaOverview?.metrics.eventCount} /></div>
              <h3 className="mt-5 mb-2 font-bold">أهم الصفحات | Top pages — GA4 screenPageViews</h3><Rows rows={gaPages.slice(0, 10)} columns={["path", "views"]} />
              <h3 className="mt-5 mb-2 font-bold">مصادر الجلسات | Session sources — GA4 sessions</h3><Rows rows={gaTraffic.slice(0, 10)} columns={["source", "medium", "sessions"]} />
            </ReportCard>
            <ReportCard title="Google Search Console" source="search_console" fetchedAt={gscPerformance?.fetched_at}>
              <div className="grid grid-cols-2 gap-3 text-sm"><Stat label="Clicks" value={gscPerformance?.metrics.clicks} /><Stat label="Impressions" value={gscPerformance?.metrics.impressions} /><Stat label="CTR" value={typeof gscPerformance?.metrics.ctr === "number" ? `${(gscPerformance.metrics.ctr * 100).toFixed(2)}%` : undefined} /><Stat label="Average Position" value={gscPerformance?.metrics.averagePosition} /></div>
              <h3 className="mt-5 mb-2 font-bold">استعلامات وصفحات البحث | Search queries and pages — Search Console</h3><Rows rows={gscPerformance?.dimensions.rows?.slice(0, 20) ?? []} columns={["query", "page", "clicks", "impressions"]} />
            </ReportCard>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-bold">حالة المصادر | Source health</h2><p className="text-sm text-muted-foreground">حالة كل خدمة وآخر نتيجة ناجحة | Status and latest successful sync for each service.</p></div><ShieldCheck className="h-6 w-6 text-primary" /></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-right text-sm"><thead><tr className="border-b border-border text-muted-foreground"><th className="p-3">المصدر</th><th className="p-3">الحالة</th><th className="p-3">آخر نجاح</th><th className="p-3">الفشل</th><th className="p-3">التفاصيل</th><th className="p-3">الإجراء</th></tr></thead><tbody>{(data?.health ?? []).map((item) => <tr key={item.source_key} className="border-b border-border/60"><td className="p-3 font-semibold">{item.display_name || sourceLabels[item.source_key]}</td><td className="p-3"><Status status={item.last_status} /></td><td className="p-3 text-muted-foreground">{item.last_success_at ? new Date(item.last_success_at).toLocaleString("ar-EG") : "لا توجد نتيجة ناجحة"}</td><td className="p-3">{item.failure_count}</td><td className="max-w-[360px] p-3 text-xs text-amber-800">{item.last_error_message || "—"}</td><td className="p-3">{item.source_key === "clarity" ? <a href="https://clarity.microsoft.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary underline">فتح Clarity <ExternalLink className="h-3 w-3" /></a> : item.source_key === "vercel" || item.source_key === "speed_insights" ? <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary underline">فتح Vercel <ExternalLink className="h-3 w-3" /></a> : "—"}</td></tr>)}</tbody></table></div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm"><h2 className="text-lg font-bold">الأحداث الداخلية المؤكدة | Confirmed internal events</h2><p className="mb-4 text-sm text-muted-foreground">لا نخزن محتوى النماذج أو بيانات الاتصال الشخصية | Form content and personal contact details are not stored.</p><Rows rows={data?.internalEvents?.slice(0, 20) ?? []} columns={["event_name", "occurred_at", "page_path", "program", "country_group"]} empty="لم تصل أحداث مؤكدة ضمن الفترة | No confirmed events in this period." /></section>
        </>}
      </div>
    </main>
  )
}

function MetricCard({ label, source, value, icon }: { label: string; source: string; value: unknown; icon: React.ReactNode }) { return <div className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="mb-3 flex items-center justify-between text-primary">{icon}<span className="text-[11px] text-muted-foreground">{source}</span></div><p className="text-2xl font-extrabold">{fmt(value)}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div> }
function Stat({ label, value }: { label: string; value: unknown }) { return <div className="rounded-xl bg-muted/50 p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-lg font-bold">{fmt(value)}</p></div> }
function ReportCard({ title, source, fetchedAt, children }: { title: string; source: string; fetchedAt?: string; children: ReactNode }) { return <section className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="mb-4 flex items-start justify-between"><div><h2 className="text-lg font-bold">{title}</h2><p className="text-xs text-muted-foreground">المصدر | Source: {source} · آخر مزامنة | Last sync: {fetchedAt ? new Date(fetchedAt).toLocaleString("ar-EG") : "لا توجد | None"}</p></div></div>{children}</section> }
function Rows({ rows, columns, empty = "لا توجد بيانات لهذا المصدر | No data for this source." }: { rows: Array<Record<string, unknown>>; columns: string[]; empty?: string }) { if (!rows.length) return <p className="rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">{empty}</p>; return <div className="overflow-x-auto"><table className="w-full text-right text-xs"><thead><tr className="border-b border-border">{columns.map((column) => <th key={column} className="p-2 text-muted-foreground">{columnLabels[column] || column}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={`${index}-${String(row[columns[0]])}`} className="border-b border-border/50">{columns.map((column) => <td key={column} className="max-w-[280px] truncate p-2">{fmt(row[column])}</td>)}</tr>)}</tbody></table></div> }
function Status({ status }: { status: string }) { const healthy = status === "healthy"; return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${healthy ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700"}`}>{healthy ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}{statusLabels[status] || status}</span> }
