"use client"

import { useCallback, useEffect, useState } from "react"
import { MessageCircle } from "lucide-react"
import { usePathname } from "next/navigation"
import { useI18n } from "@/lib/i18n"
import { getPublicWidgets } from "@/lib/public-widgets-client"

type WhatsAppWidget = {
  position: "left" | "right"
  phone: string
  size: "small" | "medium" | "large"
  color: string
  showLabel: boolean
  labelAr: string
  labelEn: string
  labelFr: string
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
  const phone = widget.phone.replace(/\D/g, "")
  const label = locale === "fr" ? widget.labelFr : locale === "en" ? widget.labelEn : widget.labelAr
  const size = widget.size === "small" ? "h-11 w-11" : widget.size === "medium" ? "h-14 w-14" : "h-16 min-w-16 px-4"
  return <a href={`https://wa.me/message/RCJSLAJQHAWHA1`} target="_blank" rel="noopener noreferrer" aria-label={label || "WhatsApp"} className={`fixed bottom-5 z-[60] inline-flex items-center justify-center gap-2 rounded-full text-white shadow-lg transition-transform hover:scale-105 ${size} ${widget.position === "left" ? "left-5" : "right-5"}`} style={{ backgroundColor: widget.color }}>
    <MessageCircle aria-hidden="true" size={24} />
    {widget.showLabel && <span className="text-sm font-bold">{label}</span>}
  </a>
}
