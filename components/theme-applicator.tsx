"use client"

import { useEffect } from "react"

type Theme = {
  primary_color: string
  accent_color: string
  background_color: string
  foreground_color: string
}

function toHsl(hex: string): string | null {
  if (!/^#[\da-f]{6}$/i.test(hex)) return null
  const value = hex.slice(1)
  const r = parseInt(value.slice(0, 2), 16) / 255
  const g = parseInt(value.slice(2, 4), 16) / 255
  const b = parseInt(value.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1))
    if (max === r) h = ((g - b) / delta) % 6
    else if (max === g) h = (b - r) / delta + 2
    else h = (r - g) / delta + 4
    h *= 60
    if (h < 0) h += 360
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

export function ThemeApplicator() {
  useEffect(() => {
    let cancelled = false
    const apply = (theme: Theme) => {
      const root = document.documentElement
      const properties: Array<[string, string]> = [
        ["--primary", theme.primary_color],
        ["--secondary", theme.accent_color],
        ["--background", theme.background_color],
        ["--foreground", theme.foreground_color],
      ]
      for (const [name, color] of properties) {
        const hsl = toHsl(color)
        if (hsl) root.style.setProperty(name, hsl)
      }
    }
    const onThemeUpdated = (event: Event) => {
      const theme = (event as CustomEvent<Theme>).detail
      if (theme) apply(theme)
    }
    window.addEventListener("theme:updated", onThemeUpdated)
    fetch("/api/public/theme", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null
        return response.json()
      })
      .then((body: { data?: Theme } | null) => {
        if (cancelled || !body?.data) return
        apply(body.data)
      })
      .catch(() => undefined)
    return () => { cancelled = true; window.removeEventListener("theme:updated", onThemeUpdated) }
  }, [])

  return null
}
