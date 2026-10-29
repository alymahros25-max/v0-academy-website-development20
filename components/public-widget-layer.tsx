"use client"

import { useCallback, useEffect, useState } from "react"
import { MessageCircle } from "lucide-react"
import { usePathname } from "next/navigation"
import { useI18n } from "@/lib/i18n"
import { getPublicWidgets } from "@/lib/public-widgets-client"
import { createWhatsAppMessage, createWhatsAppUrl } from "@/lib/whatsapp"
import { getAnalyticsCountry } from "@/components/ga4-events"

type WhatsAppWidget = {
  position: "left" | "right"
  phone: string
  size: "small" | "medium" | "large"
  color: string
  showLabel: boolean
  labelAr: string
  labelEn: string
  labelFr: string
  messageTemplateAr?: string
}

export function PublicWidgetLayer() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")
  const { locale } = useI18n()
  const [widget, setWidget] = useState<WhatsAppWidget | null>(null)
  const [enabled, setEnabled] = useState(false)

  const load = useCallback(async (refresh = false) => {
    try {
      const widgets = await getPublicWidgets(refresh)
      const row = widgets.find((item) => item.widget_type === "whatsapp_button")
      const config = row?.config_json as WhatsAppWidget | undefined
      if (!row || !row.is_enabled || !config || !/^\+?[0-9]{8,15}$/.test(config.phone) || !/^#[\da-f]{6}$/i.test(config.color)) {
        setWidget(null)
        setEnabled(false)
        return
      }
      setWidget(config)
      setEnabled(true)
    } catch { setWidget(null); setEnabled(false) }
  }, [])

  useEffect(() => {
    if (isAdmin) return

    type IdleWindow = Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number
      cancelIdleCallback?: (handle: number) => void
    }

    const idleWindow = window as IdleWindow
    let idleHandle: number | undefined
    let timeoutHandle: number | undefined
    let cancelled = false
    const runLoad = () => {
      if (!cancelled) void load()
    }

    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(runLoad, { timeout: 2000 })
    } else {
      timeoutHandle = window.setTimeout(runLoad, 600)
    }

    const handleWidgetUpdate = () => { void load(true) }
    window.addEventListener("widgets:updated", handleWidgetUpdate)
    return () => {
      cancelled = true
      if (idleHandle !== undefined) idleWindow.cancelIdleCallback?.(idleHandle)
      if (timeoutHandle !== undefined) window.clearTimeout(timeoutHandle)
      window.removeEventListener("widgets:updated", handleWidgetUpdate)
    }
  }, [isAdmin, load])

  if (isAdmin || !enabled || !widget) return null
  const label = locale === "fr" ? widget.labelFr : locale === "en" ? widget.labelEn : widget.labelAr
  const size = widget.size === "small" ? "h-12 w-12" : widget.size === "medium" ? "h-14 w-14" : "h-14 min-w-14 px-4 sm:h-16 sm:min-w-16"
  const message = createWhatsAppMessage(getAnalyticsCountry(pathname), widget.messageTemplateAr)
  return <a href={createWhatsAppUrl(widget.phone, message)} target="_blank" rel="noopener noreferrer" aria-label={label || "WhatsApp"} className={`fixed bottom-6 z-[60] inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-[#073B1A] shadow-[0_10px_28px_rgba(37,211,102,0.35)] ring-2 ring-white/90 transition-[transform,box-shadow] hover:scale-105 hover:bg-[#1ebe5d] hover:shadow-[0_14px_34px_rgba(37,211,102,0.42)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/45 sm:bottom-7 ${widget.position === "left" ? "left-5 sm:left-7" : "right-5 sm:right-7"} ${size}`}>
    <MessageCircle aria-hidden="true" className="size-7 shrink-0" />
    {widget.showLabel && <span className="text-sm font-bold">{label}</span>}
  </a>
}
