"use client"

import { useCallback, useEffect, useState } from "react"
import { MessageCircle } from "lucide-react"
import { usePathname } from "next/navigation"
import { useI18n } from "@/lib/i18n"

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
  const { locale } = useI18n()
  const [widget, setWidget] = useState<WhatsAppWidget | null>(null)
  const [enabled, setEnabled] = useState(false)

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/public/widgets", { cache: "no-store" })
      if (!response.ok) return
      const body = await response.json() as { data?: Array<{ widget_type: string; config_json: unknown; is_enabled: boolean }> }
      const row = body.data?.find((item) => item.widget_type === "whatsapp_button")
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
    if (pathname.startsWith("/admin")) return
    void load()
    window.addEventListener("widgets:updated", load)
    return () => window.removeEventListener("widgets:updated", load)
  }, [pathname, load])

  if (pathname.startsWith("/admin") || !enabled || !widget) return null
  const phone = widget.phone.replace(/\D/g, "")
  const label = locale === "fr" ? widget.labelFr : locale === "en" ? widget.labelEn : widget.labelAr
  const size = widget.size === "small" ? "h-11 w-11" : widget.size === "medium" ? "h-14 w-14" : "h-16 min-w-16 px-4"
  return <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" aria-label={label || "WhatsApp"} className={`fixed bottom-5 z-[60] inline-flex items-center justify-center gap-2 rounded-full text-white shadow-lg transition-transform hover:scale-105 ${size} ${widget.position === "left" ? "left-5" : "right-5"}`} style={{ backgroundColor: widget.color }}>
    <MessageCircle aria-hidden="true" size={24} />
    {widget.showLabel && <span className="text-sm font-bold">{label}</span>}
  </a>
}
