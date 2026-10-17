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
