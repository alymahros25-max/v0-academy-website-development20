export type AnalyticsSourceKey =
  | "ga4"
  | "search_console"
  | "internal"
  | "clarity"
  | "vercel"
  | "speed_insights"

export type AnalyticsSourceStatus =
  | "healthy"
  | "delayed"
  | "failed"
  | "disabled"
  | "consent_required"
  | "not_configured"

export type InternalEventName =
  | "contact_form_submit"
  | "whatsapp_click"
  | "telegram_click"
  | "email_click"
  | "trial_booking_click"

export interface AnalyticsSnapshot {
  id?: number
  source_key: AnalyticsSourceKey
  report_type: string
  period_start: string
  period_end: string
  fetched_at: string
  source_updated_at?: string | null
  metrics: Record<string, number | string | null>
  dimensions: Record<string, unknown>
  schema_version: number
  response_hash?: string | null
}

export interface AnalyticsSourceHealth {
  source_key: AnalyticsSourceKey
  display_name: string
  enabled: boolean
  consent_required: boolean
  last_attempt_at?: string | null
  last_success_at?: string | null
  last_status: AnalyticsSourceStatus
  last_error_code?: string | null
  last_error_message?: string | null
  failure_count: number
  updated_at: string
}

export const SOURCE_LABELS: Record<AnalyticsSourceKey, string> = {
  ga4: "Google Analytics 4",
  search_console: "Google Search Console",
  internal: "أحداث الموقع المؤكدة",
  clarity: "Microsoft Clarity",
  vercel: "Vercel Web Analytics",
  speed_insights: "Vercel Speed Insights",
}

export const INTERNAL_EVENT_NAMES: InternalEventName[] = [
  "contact_form_submit",
  "whatsapp_click",
  "telegram_click",
  "email_click",
  "trial_booking_click",
]

export function safeEventMetadata(value: Record<string, unknown> | undefined) {
  if (!value) return {}
  const allowed = new Set(["program", "country_group", "page_path", "source_group", "device_type"])
  return Object.fromEntries(Object.entries(value).filter(([key, item]) => allowed.has(key) && typeof item === "string" && item.length <= 120))
}
