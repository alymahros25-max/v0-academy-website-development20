"use client"

import { useEffect, useState } from "react"
import { Loader2, Save } from "lucide-react"
import { defaultLandingPageConfigs, type LandingPageConfig, type LandingPageSlug } from "@/lib/domain/landing-page-config"

type Props = { slug: LandingPageSlug; countryName: string; currencyLabel: string }
type ApiResponse = { data?: LandingPageConfig; storageConfigured?: boolean; error?: string }

export function CountryLandingEditor({ slug, countryName, currencyLabel }: Props) {
  const [config, setConfig] = useState<LandingPageConfig>(defaultLandingPageConfigs[slug])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [storageConfigured, setStorageConfigured] = useState(false)
  const [status, setStatus] = useState("")

  useEffect(() => {
    let active = true
    fetch(`/api/cms/landing-pages?slug=${slug}`, { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json() as ApiResponse
        if (!response.ok) throw new Error(body.error ?? "تعذر تحميل إعدادات الصفحة")
        if (!active) return
        if (body.data) setConfig(body.data)
        setStorageConfigured(Boolean(body.storageConfigured))
      })
      .catch((error: unknown) => { if (active) setStatus(error instanceof Error ? error.message : "تعذر تحميل الإعدادات") })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [slug])

  const updateSeo = (key: keyof LandingPageConfig["seo"], value: string) => setConfig((current) => ({ ...current, seo: { ...current.seo, [key]: value } }))
  const save = async () => {
    setSaving(true)
    setStatus("")
    try {
      const response = await fetch("/api/cms/landing-pages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, config }),
      })
      const body = await response.json() as ApiResponse
      if (!response.ok) throw new Error(body.error ?? "فشل حفظ التعديلات")
      if (body.data) setConfig(body.data)
      setStorageConfigured(true)
      setStatus("تم حفظ الإعدادات وتحديث معاينة الصفحة العامة.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "تعذر حفظ الإعدادات")
    } finally { setSaving(false) }
  }

  return <div className="space-y-6" dir="rtl">
    <header className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div><h2 className="text-2xl font-bold">إعدادات صفحة {countryName}</h2><p className="mt-2 text-sm text-muted-foreground">هذه الشاشة تحفظ إعدادات الصفحة المتخصصة وحدها؛ لا تغيّر إعدادات بقية البلدان.</p><p className="mt-1 text-xs text-muted-foreground">{storageConfigured ? "قاعدة البيانات متصلة." : "وضع المعاينة: الإعدادات الافتراضية ظاهرة، والحفظ يحتاج إعداد متغيرات قاعدة البيانات في Vercel."}</p></div>
      <button type="button" onClick={save} disabled={loading || saving} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-bold text-primary-foreground disabled:opacity-50"><Save size={17} />{saving ? "جارٍ الحفظ..." : "حفظ ونشر الإعدادات"}</button>
    </header>
    {status && <p className="rounded-lg bg-secondary p-3 text-sm" role="status">{status}</p>}
    {loading ? <div className="flex items-center gap-2 p-8 text-muted-foreground"><Loader2 className="animate-spin" size={18} /> جارٍ تحميل الإعدادات...</div> : <>
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm"><h3 className="text-lg font-bold">بيانات محركات البحث</h3><div className="mt-4 grid gap-4"><label className="grid gap-2 text-sm font-semibold">عنوان SEO<input value={config.seo.title} onChange={(event) => updateSeo("title", event.target.value)} maxLength={160} className="rounded-lg border border-border bg-background p-3 font-normal" /></label><label className="grid gap-2 text-sm font-semibold">الوصف التعريفي<textarea value={config.seo.description} onChange={(event) => updateSeo("description", event.target.value)} maxLength={320} className="min-h-24 rounded-lg border border-border bg-background p-3 font-normal" /></label><label className="grid gap-2 text-sm font-semibold">الرابط canonical<input type="url" value={config.seo.canonical} onChange={(event) => updateSeo("canonical", event.target.value)} className="rounded-lg border border-border bg-background p-3 font-mono text-sm font-normal" /></label></div></section>
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm"><h3 className="text-lg font-bold">محتوى الصفحة المتخصصة</h3><div className="mt-4 grid gap-4"><label className="grid gap-2 text-sm font-semibold">عنوان واجهة الصفحة<input value={config.heroTitle} onChange={(event) => setConfig((current) => ({ ...current, heroTitle: event.target.value }))} maxLength={180} className="rounded-lg border border-border bg-background p-3 font-normal" /></label><label className="grid gap-2 text-sm font-semibold">وصف الواجهة<textarea value={config.heroDescription} onChange={(event) => setConfig((current) => ({ ...current, heroDescription: event.target.value }))} maxLength={1200} className="min-h-32 rounded-lg border border-border bg-background p-3 font-normal" /></label><label className="grid gap-2 text-sm font-semibold">عنوان الدعوة الختامية<input value={config.closingTitle} onChange={(event) => setConfig((current) => ({ ...current, closingTitle: event.target.value }))} maxLength={180} className="rounded-lg border border-border bg-background p-3 font-normal" /></label><label className="grid gap-2 text-sm font-semibold">نص الدعوة الختامية<textarea value={config.closingDescription} onChange={(event) => setConfig((current) => ({ ...current, closingDescription: event.target.value }))} maxLength={1200} className="min-h-24 rounded-lg border border-border bg-background p-3 font-normal" /></label></div></section>
      <section className="rounded-2xl border border-border bg-muted/30 p-5 text-sm"><h3 className="font-bold">الباقات والأسعار — {currencyLabel}</h3><p className="mt-2 text-muted-foreground">تُقرأ الأسعار المعروضة من بيانات البلد وبعملته الأصلية. تُدار الباقات وأسعارها من محرر مناطق/باقات لوحة الإدارة، لا من إعدادات المحتوى هذه، لتجنب إنشاء مصدر أسعار مكرر.</p></section>
    </>}
  </div>
}
