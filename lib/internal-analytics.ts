import { createHash, randomBytes } from "crypto"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import type { InternalEventName } from "@/lib/analytics-types"
import { INTERNAL_EVENT_NAMES, safeEventMetadata } from "@/lib/analytics-types"

export async function recordInternalAnalyticsEvent(input: {
  eventName: InternalEventName
  pagePath?: string
  program?: string
  countryGroup?: string
  sourceGroup?: string
  deviceType?: string
  consentState?: string
}) {
  if (!supabaseAdmin || !INTERNAL_EVENT_NAMES.includes(input.eventName)) return { saved: false, reason: "not_configured" as const }

  const occurredAt = new Date().toISOString()
  const eventId = createHash("sha256")
    .update(`${input.eventName}:${occurredAt}:${input.pagePath ?? ""}:${randomBytes(12).toString("hex")}`)
    .digest("hex")
    .slice(0, 32)

  const metadata = safeEventMetadata({
    page_path: input.pagePath,
    program: input.program,
    country_group: input.countryGroup,
    source_group: input.sourceGroup,
    device_type: input.deviceType,
  })

  const { error } = await supabaseAdmin.from("internal_analytics_events").insert({
    event_id: eventId,
    event_name: input.eventName,
    occurred_at: occurredAt,
    page_path: typeof input.pagePath === "string" ? input.pagePath.split("?")[0].slice(0, 500) : null,
    program: input.program?.slice(0, 80) ?? null,
    country_group: input.countryGroup?.slice(0, 40) ?? null,
    source_group: input.sourceGroup?.slice(0, 80) ?? null,
    device_type: input.deviceType?.slice(0, 40) ?? null,
    consent_state: input.consentState?.slice(0, 40) ?? null,
    metadata,
  })

  if (error) {
    console.error("[Analytics] Failed to save internal event:", error.message)
    return { saved: false, reason: "database_error" as const }
  }

  return { saved: true, eventId }
}
