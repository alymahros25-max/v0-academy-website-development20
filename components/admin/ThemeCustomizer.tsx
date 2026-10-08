"use client"

import { useEffect, useState } from "react"
import { Save } from "lucide-react"

type Theme = {
  primary_color: string
  accent_color: string
  background_color: string
  foreground_color: string
}

const defaults: Theme = {
  primary_color: "#1a4d2e",
  accent_color: "#d4af37",
  background_color: "#ffffff",
  foreground_color: "#171717",
}

function normalizeTheme(value: unknown): Theme {
  const candidate = value && typeof value === "object"
    ? value as Partial<Record<keyof Theme, unknown>>
    : {}
  const color = (key: keyof Theme) => {
    const candidateColor = candidate[key]
    return typeof candidateColor === "string" && /^#[0-9a-fA-F]{6}$/.test(candidateColor)
      ? candidateColor
      : defaults[key]
  }

  return {
    primary_color: color("primary_color"),
    accent_color: color("accent_color"),
    background_color: color("background_color"),
    foreground_color: color("foreground_color"),
  }
}

const fields: Array<{ key: keyof Theme; label: string }> = [
  { key: "primary_color", label: "اللون الأساسي" },
  { key: "accent_color", label: "اللون المميز" },
  { key: "background_color", label: "الخلفية" },
  { key: "foreground_color", label: "النص" },
]

export function ThemeCustomizer() {
  const [theme, setTheme] = useState<Theme>(defaults)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [connected, setConnected] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    let active = true
    fetch("/api/cms/theme", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}))
        if (!active) return
        if (body.data) setTheme(normalizeTheme(body.data))
        setConnected(Boolean(body.storageConfigured && response.ok))
        if (!response.ok) setMessage("قاعدة البيانات غير متصلة بعد؛ القيم المعروضة افتراضية ولن تُحفظ قبل إعداد الاتصال.")
      })
      .catch(() => { if (active) setMessage("تعذر تحميل المظهر من الخادم.") })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  async function save() {
    setSaving(true)
    setMessage("")
    try {
      const response = await fetch("/api/cms/theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theme),
      })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(body.error || "تعذر حفظ المظهر")
      setTheme(normalizeTheme(body.data))
      setConnected(true)
      setMessage("حُفظت الألوان وأعيد التحقق من مخرجات الموقع.")
      window.dispatchEvent(new CustomEvent("theme:updated", { detail: body.data }))
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر حفظ المظهر")
    } finally {
      setSaving(false)
    }
  }

  return <div className="space-y-6" dir="rtl">
    <header>
      <h2 className="text-2xl font-bold">المظهر والألوان</h2>
      <p className="mt-1 text-sm text-muted-foreground">تُحفظ الألوان في سجل theme واحد وتُطبّق على متغيرات CSS العامة بعد القراءة.</p>
      <p className={`mt-2 text-sm ${connected ? "text-green-700" : "text-amber-700"}`} role="status">
        {loading ? "جارٍ فحص اتصال قاعدة البيانات…" : connected ? "قاعدة البيانات متصلة" : "وضع معاينة — لا يوجد اتصال قاعدة"}
      </p>
    </header>
    {message && <p className="rounded-lg border border-border bg-card p-3 text-sm" role="status">{message}</p>}
    <section className="grid gap-4 sm:grid-cols-2">
      {fields.map(({ key, label }) => <label key={key} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
        <span className="font-semibold">{label}</span>
        <span className="flex items-center gap-2">
          <input type="color" value={theme[key]} onChange={(event) => setTheme((current) => ({ ...current, [key]: event.target.value }))} className="h-10 w-14 cursor-pointer rounded border border-border bg-background" aria-label={label} />
          <input dir="ltr" value={theme[key]} onChange={(event) => setTheme((current) => ({ ...current, [key]: event.target.value }))} pattern="^#[0-9a-fA-F]{6}$" className="w-28 rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm" />
        </span>
      </label>)}
    </section>
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={() => void save()} disabled={saving || loading} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-bold text-primary-foreground disabled:opacity-50"><Save size={17} />{saving ? "جارٍ الحفظ…" : "حفظ المظهر"}</button>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm">
        <span className="h-5 w-5 rounded-full" style={{ backgroundColor: theme.primary_color }} />
        <span className="h-5 w-5 rounded-full" style={{ backgroundColor: theme.accent_color }} />
        معاينة الألوان
      </div>
    </div>
  </div>
}
