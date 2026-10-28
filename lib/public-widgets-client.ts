import {
  DEFAULT_WHATSAPP_MESSAGE_TEMPLATE_AR,
  DEFAULT_WHATSAPP_PHONE,
  normalizeWhatsAppPhone,
} from "@/lib/whatsapp"

export type PublicWidgetRecord = {
  widget_type: string
  config_json: unknown
  is_enabled: boolean
}

type PublicWidgetsResponse = { data?: PublicWidgetRecord[] }

let cachedWidgets: PublicWidgetRecord[] | null = null
let pendingRequest: Promise<PublicWidgetRecord[]> | null = null

export function getPublicWidgets(refresh = false): Promise<PublicWidgetRecord[]> {
  if (pendingRequest) return pendingRequest
  if (!refresh && cachedWidgets) return Promise.resolve(cachedWidgets)

  pendingRequest = fetch("/api/public/widgets", { cache: "no-store" })
    .then(async (response) => {
      if (!response.ok) throw new Error(`Public widgets request failed: ${response.status}`)
      return response.json() as Promise<PublicWidgetsResponse>
    })
    .then((body) => {
      cachedWidgets = Array.isArray(body.data) ? body.data : []
      return cachedWidgets
    })
    .finally(() => {
      pendingRequest = null
    })

  return pendingRequest
}

export async function getPublicWhatsAppSettings(refresh = false) {
  const widgets = await getPublicWidgets(refresh)
  const row = widgets.find((item) => item.widget_type === "whatsapp_button")
  const config = row?.config_json && typeof row.config_json === "object"
    ? row.config_json as Record<string, unknown>
    : {}
  return {
    phone: normalizeWhatsAppPhone(config.phone) ?? DEFAULT_WHATSAPP_PHONE,
    messageTemplateAr: typeof config.messageTemplateAr === "string" && config.messageTemplateAr.trim()
      ? config.messageTemplateAr
      : DEFAULT_WHATSAPP_MESSAGE_TEMPLATE_AR,
  }
}
