import { createHash } from "crypto"
import { google } from "googleapis"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { getGoogleServiceAccountAuth } from "@/lib/google-auth"
import type { AnalyticsSnapshot, AnalyticsSourceHealth, AnalyticsSourceKey } from "@/lib/analytics-types"
import { SOURCE_LABELS } from "@/lib/analytics-types"

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID?.trim()
const rawGscSite = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL?.trim() || process.env.GOOGLE_SEARCH_CONSOLE_DOMAIN?.trim() || "sc-domain:quran-elhafez.com"
const GSC_SITE_URL = rawGscSite.startsWith("sc-domain:") || rawGscSite.startsWith("http") ? rawGscSite : `sc-domain:${rawGscSite}`
const GOOGLE_SCOPES = ["https://www.googleapis.com/auth/analytics.readonly", "https://www.googleapis.com/auth/webmasters.readonly"]

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10)
}

function getRange(searchParams?: URLSearchParams) {
  const end = searchParams?.get("end") || dateOnly(new Date())
  const start = searchParams?.get("start") || dateOnly(new Date(Date.now() - 28 * 24 * 60 * 60 * 1000))
  return { start, end }
}

function getAuth() {
  return getGoogleServiceAccountAuth(GOOGLE_SCOPES)
}

function asNumber(value: string | number | null | undefined) {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

async function updateHealth(sourceKey: AnalyticsSourceKey, patch: Partial<AnalyticsSourceHealth>) {
  if (!supabaseAdmin) return
  await supabaseAdmin.from("analytics_sources").upsert({
    source_key: sourceKey,
    display_name: SOURCE_LABELS[sourceKey],
    enabled: true,
    consent_required: sourceKey === "ga4" || sourceKey === "clarity" || sourceKey === "vercel",
    ...patch,
    updated_at: new Date().toISOString(),
  }, { onConflict: "source_key" })
}

async function saveSnapshot(snapshot: AnalyticsSnapshot) {
  if (!supabaseAdmin) return
  const responseHash = createHash("sha256").update(JSON.stringify({ metrics: snapshot.metrics, dimensions: snapshot.dimensions })).digest("hex")
  await supabaseAdmin.from("analytics_sync_snapshots").upsert({
    source_key: snapshot.source_key,
    report_type: snapshot.report_type,
    period_start: snapshot.period_start,
    period_end: snapshot.period_end,
    fetched_at: snapshot.fetched_at,
    source_updated_at: snapshot.source_updated_at ?? null,
    metrics: snapshot.metrics,
    dimensions: snapshot.dimensions,
    schema_version: snapshot.schema_version,
    response_hash: responseHash,
  }, { onConflict: "source_key,report_type,period_start,period_end,schema_version" })
}

async function fetchGa4(start: string, end: string): Promise<AnalyticsSnapshot[]> {
  if (!GA4_PROPERTY_ID) throw new Error("GA4_PROPERTY_ID is not configured")
  const auth = getAuth()
  const analyticsData = google.analyticsdata({ version: "v1beta", auth: auth as any })
  const property = `properties/${GA4_PROPERTY_ID}`

  const overview = await analyticsData.properties.runReport({
    property,
    requestBody: {
      dateRanges: [{ startDate: start, endDate: end }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }, { name: "eventCount" }],
    },
  })
  const row = overview.data.rows?.[0]?.metricValues ?? []
  const overviewSnapshot: AnalyticsSnapshot = {
    source_key: "ga4",
    report_type: "overview",
    period_start: start,
    period_end: end,
    fetched_at: new Date().toISOString(),
    metrics: {
      activeUsers: asNumber(row[0]?.value),
      sessions: asNumber(row[1]?.value),
      screenPageViews: asNumber(row[2]?.value),
      eventCount: asNumber(row[3]?.value),
    },
    dimensions: {},
    schema_version: 1,
  }

  const traffic = await analyticsData.properties.runReport({
    property,
    requestBody: {
      dateRanges: [{ startDate: start, endDate: end }],
      dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }, { name: "eventCount" }],
      limit: "100",
    },
  })
  const trafficRows = (traffic.data.rows ?? []).map((item) => ({
    source: item.dimensionValues?.[0]?.value || "(unknown)",
    medium: item.dimensionValues?.[1]?.value || "(unknown)",
    sessions: asNumber(item.metricValues?.[0]?.value),
    activeUsers: asNumber(item.metricValues?.[1]?.value),
    eventCount: asNumber(item.metricValues?.[2]?.value),
  }))

  const topPages = await analyticsData.properties.runReport({
    property,
    requestBody: {
      dateRanges: [{ startDate: start, endDate: end }],
      dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
      metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
      limit: "100",
    },
  })
  const pageRows = (topPages.data.rows ?? []).map((item) => ({
    path: item.dimensionValues?.[0]?.value || "/",
    title: item.dimensionValues?.[1]?.value || "",
    views: asNumber(item.metricValues?.[0]?.value),
    activeUsers: asNumber(item.metricValues?.[1]?.value),
  }))

  return [overviewSnapshot, {
    ...overviewSnapshot,
    report_type: "traffic",
    metrics: { rowCount: trafficRows.length },
    dimensions: { rows: trafficRows },
  }, {
    ...overviewSnapshot,
    report_type: "top_pages",
    metrics: { rowCount: pageRows.length },
    dimensions: { rows: pageRows },
  }]
}

async function fetchSearchConsole(start: string, end: string): Promise<AnalyticsSnapshot[]> {
  const auth = getAuth()
  const searchconsole = google.searchconsole({ version: "v1", auth: auth as any })
  const response = await searchconsole.searchanalytics.query({
    siteUrl: GSC_SITE_URL,
    requestBody: {
      startDate: start,
      endDate: end,
      dimensions: ["query", "page"],
      rowLimit: 250,
      dataState: "final",
    },
  })
  const rows = response.data.rows ?? []
  const clicks = rows.reduce((sum, item) => sum + asNumber(item.clicks), 0)
  const impressions = rows.reduce((sum, item) => sum + asNumber(item.impressions), 0)
  const weightedPosition = rows.reduce((sum, item) => sum + asNumber(item.position) * asNumber(item.impressions), 0)
  const ctr = impressions ? clicks / impressions : 0
  const pages = rows.slice(0, 100).map((item) => ({
    query: item.keys?.[0] || "",
    page: item.keys?.[1] || "",
    clicks: asNumber(item.clicks),
    impressions: asNumber(item.impressions),
    ctr: asNumber(item.ctr),
    position: asNumber(item.position),
  }))

  return [{
    source_key: "search_console",
    report_type: "performance",
    period_start: start,
    period_end: end,
    fetched_at: new Date().toISOString(),
    metrics: {
      clicks,
      impressions,
      ctr,
      averagePosition: impressions ? weightedPosition / impressions : 0,
      rows: rows.length,
    },
    dimensions: { rows: pages },
    schema_version: 1,
  }]
}

export async function refreshAnalytics(start: string, end: string) {
  const result: { source: AnalyticsSourceKey; snapshots: AnalyticsSnapshot[]; error?: string }[] = []
  const now = new Date().toISOString()

  for (const source of ["ga4", "search_console"] as const) {
    try {
      await updateHealth(source, { last_attempt_at: now, last_status: "not_configured", last_error_code: null, last_error_message: null })
      const snapshots = source === "ga4" ? await fetchGa4(start, end) : await fetchSearchConsole(start, end)
      for (const snapshot of snapshots) await saveSnapshot(snapshot)
      await updateHealth(source, { last_attempt_at: now, last_success_at: now, last_status: "healthy", failure_count: 0, last_error_code: null, last_error_message: null })
      result.push({ source, snapshots })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown analytics error"
      await updateHealth(source, { last_attempt_at: now, last_status: message.includes("not configured") ? "not_configured" : "failed", last_error_code: message.includes("not configured") ? "NOT_CONFIGURED" : "FETCH_FAILED", last_error_message: message.slice(0, 240), failure_count: 1 })
      result.push({ source, snapshots: [], error: message })
    }
  }

  return result
}

export async function getAnalyticsDashboard(start: string, end: string) {
  if (!supabaseAdmin) {
    return { snapshots: [], health: [], internalEvents: [], storageConfigured: false }
  }
  const [snapshotsResponse, healthResponse, eventsResponse] = await Promise.all([
    supabaseAdmin.from("analytics_sync_snapshots").select("*").gte("period_start", start).lte("period_end", end).order("fetched_at", { ascending: false }).limit(100),
    supabaseAdmin.from("analytics_sources").select("*").order("source_key", { ascending: true }).limit(20),
    supabaseAdmin.from("internal_analytics_events").select("event_name, occurred_at, page_path, program, country_group, source_group").gte("occurred_at", `${start}T00:00:00.000Z`).lte("occurred_at", `${end}T23:59:59.999Z`).order("occurred_at", { ascending: false }).limit(100),
  ])
  if (snapshotsResponse.error) throw snapshotsResponse.error
  if (healthResponse.error) throw healthResponse.error
  if (eventsResponse.error) throw eventsResponse.error
  return {
    snapshots: snapshotsResponse.data ?? [],
    health: healthResponse.data ?? [],
    internalEvents: eventsResponse.data ?? [],
    storageConfigured: true,
  }
}

export { getRange }
