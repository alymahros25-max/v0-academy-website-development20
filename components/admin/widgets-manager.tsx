"use client"

import { useCallback, useEffect, useState } from "react"
import { ArrowDown, ArrowUp, Eye, EyeOff, MessageCircle, Save, Trash2 } from "lucide-react"

type WhatsAppConfig = { position: "left" | "right"; phone: string; size: "small" | "medium" | "large"; color: string; showLabel: boolean; labelAr: string; labelEn: string; labelFr: string }
type NavbarConfig = { items: string[] }
type WidgetRow = { widget_type: "whatsapp_button" | "navbar"; config_json: WhatsAppConfig | NavbarConfig; is_enabled: boolean; display_order: number }

const defaultWhatsApp: WhatsAppConfig = { position: "right", phone: "201130127894", size: "large", color: "#1a4d2e", showLabel: true, labelAr: "اتصل بنا", labelEn: "Contact Us", labelFr: "Nous contacter" }
const navChoices = [
  ["home", "الرئيسية"], ["about", "من نحن"], ["quran", "أسعار القرآن"], ["arabic", "أسعار العربية"], ["teachers", "المعلمون"], ["reviews", "الآراء"], ["library", "المكتبة"], ["classroom", "فيديوهات الحصص"], ["games", "الألعاب"], ["faq", "الأسئلة الشائعة"], ["blog", "المدونة"], ["contact", "التواصل"], ["account", "الحساب"],
] as const
const defaultNavbar: NavbarConfig = { items: navChoices.map(([key]) => key) }
const navLabel = (key: string) => navChoices.find(([item]) => item === key)?.[1] ?? key

export function WidgetsManager() {
  const [whatsapp, setWhatsApp] = useState(defaultWhatsApp)
  const [navbar, setNavbar] = useState(defaultNavbar)
  const [whatsappEnabled, setWhatsAppEnabled] = useState(true)
  const [navbarEnabled, setNavbarEnabled] = useState(true)
  const [dirty, setDirty] = useState({ whatsapp: false, navbar: false })
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<"whatsapp_button" | "navbar" | null>(null)
  const [message, setMessage] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/cms/widgets", { cache: "no-store" })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(body.error || "تعذر تحميل الودجات")
      setConnected(true)
      for (const row of (body.data ?? []) as WidgetRow[]) {
        if (row.widget_type === "whatsapp_button") {
          setWhatsApp({ ...defaultWhatsApp, ...(row.config_json as WhatsAppConfig) })
          setWhatsAppEnabled(row.is_enabled)
        }
        if (row.widget_type === "navbar") {
          const config = row.config_json as NavbarConfig
          setNavbar({ items: Array.isArray(config.items) ? config.items.filter((key) => navChoices.some(([choice]) => choice === key)) : defaultNavbar.items })
          setNavbarEnabled(row.is_enabled)
        }
      }
      setDirty({ whatsapp: false, navbar: false })
    } catch (error) {
      setConnected(false)
      setMessage(error instanceof Error ? error.message : "تعذر التحميل؛ المعروض معاينة افتراضية فقط")
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { void load() }, [load])

  async function save(type: "whatsapp_button" | "navbar") {
    setSaving(type)
    setMessage("")
    try {
      const isWhatsApp = type === "whatsapp_button"
      const response = await fetch("/api/cms/widgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ widget_type: type, config_json: isWhatsApp ? whatsapp : navbar, is_enabled: isWhatsApp ? whatsappEnabled : navbarEnabled, display_order: isWhatsApp ? 0 : 1 }),
      })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(body.error || "تعذر حفظ الإعدادات")
      setConnected(true)
      setDirty((state) => ({ ...state, [isWhatsApp ? "whatsapp" : "navbar"]: false }))
      setMessage(`تم حفظ ${isWhatsApp ? "زر التواصل" : "القائمة"} في قاعدة البيانات.`)
      window.dispatchEvent(new CustomEvent("widgets:updated"))
    } catch (error) { setMessage(error instanceof Error ? error.message : "تعذر الحفظ") }
    finally { setSaving(null) }
  }

  const updateWhatsApp = <K extends keyof WhatsAppConfig>(key: K, value: WhatsAppConfig[K]) => { setWhatsApp((current) => ({ ...current, [key]: value })); setDirty((state) => ({ ...state, whatsapp: true })) }
  const updateItems = (items: string[]) => { setNavbar({ items }); setDirty((state) => ({ ...state, navbar: true })) }
  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= navbar.items.length) return
    const items = [...navbar.items]
    ;[items[index], items[target]] = [items[target], items[index]]
    updateItems(items)
  }

  return <div className="space-y-6" dir="rtl">
    <header><h2 className="text-2xl font-bold">الأدوات والقوائم</h2><p className="mt-1 text-sm text-muted-foreground">تُحمّل من قاعدة البيانات، ولا يُعرض الحفظ كناجح قبل تأكيد الخادم.</p><p className={`mt-2 text-sm ${connected ? "text-green-700" : "text-amber-700"}`} role="status">{loading ? "جارٍ التحميل…" : connected ? "اتصال قاعدة البيانات متاح" : "معاينة افتراضية — لا يوجد اتصال قاعدة"}</p></header>
    {message && <p role="status" className="rounded-lg border border-border bg-card p-3 text-sm">{message}</p>}
    <section className="space-y-5 rounded-2xl border border-border bg-card p-5">
      <h3 className="flex items-center gap-2 text-lg font-bold"><MessageCircle size={20} />زر WhatsApp</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm">رقم الهاتف الدولي<input value={whatsapp.phone} onChange={(e) => updateWhatsApp("phone", e.target.value)} placeholder="201130127894" dir="ltr" className="rounded-lg border border-input bg-background px-3 py-2" /></label>
        <label className="grid gap-2 text-sm">الموضع<select value={whatsapp.position} onChange={(e) => updateWhatsApp("position", e.target.value as WhatsAppConfig["position"])} className="rounded-lg border border-input bg-background px-3 py-2"><option value="right">يمين</option><option value="left">يسار</option></select></label>
        <label className="grid gap-2 text-sm">الحجم<select value={whatsapp.size} onChange={(e) => updateWhatsApp("size", e.target.value as WhatsAppConfig["size"])} className="rounded-lg border border-input bg-background px-3 py-2"><option value="small">صغير</option><option value="medium">متوسط</option><option value="large">كبير</option></select></label>
        <label className="flex items-center gap-3 text-sm">اللون<input type="color" value={whatsapp.color} onChange={(e) => updateWhatsApp("color", e.target.value)} className="h-9 w-16" /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={whatsapp.showLabel} onChange={(e) => updateWhatsApp("showLabel", e.target.checked)} />إظهار التسمية</label>
        {(["labelAr", "labelEn", "labelFr"] as const).map((key) => <label key={key} className="grid gap-2 text-sm">{key === "labelAr" ? "التسمية بالعربية" : key === "labelEn" ? "Label (English)" : "Libellé (Français)"}<input value={whatsapp[key]} onChange={(e) => updateWhatsApp(key, e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2" /></label>)}
      </div>
      <div className="flex flex-wrap items-center gap-3"><button type="button" onClick={() => { setWhatsAppEnabled((v) => !v); setDirty((s) => ({ ...s, whatsapp: true })) }} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">{whatsappEnabled ? <Eye size={16} /> : <EyeOff size={16} />}{whatsappEnabled ? "مفعّل" : "معطّل"}</button><button type="button" onClick={() => void save("whatsapp_button")} disabled={saving !== null || !dirty.whatsapp} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-50"><Save size={16} />{saving === "whatsapp_button" ? "جارٍ الحفظ…" : "حفظ إعدادات التواصل"}</button></div>
    </section>
    <section className="space-y-5 rounded-2xl border border-border bg-card p-5">
      <h3 className="text-lg font-bold">القائمة الرئيسية</h3>
      <p className="text-sm text-muted-foreground">اسحب الترتيب باستخدام الأسهم، أو أخفِ عنصرًا بحذفه من القائمة. الروابط نفسها محددة داخل الكود لمنع الروابط غير الآمنة.</p>
      <div className="space-y-2">{navbar.items.map((item, index) => <div key={`${item}-${index}`} className="flex items-center justify-between rounded-lg border border-border p-3"><span>{navLabel(item)}</span><div className="flex items-center gap-1"><button type="button" onClick={() => moveItem(index, -1)} disabled={index === 0} aria-label="تحريك لأعلى" className="rounded p-2 disabled:opacity-40"><ArrowUp size={16} /></button><button type="button" onClick={() => moveItem(index, 1)} disabled={index === navbar.items.length - 1} aria-label="تحريك لأسفل" className="rounded p-2 disabled:opacity-40"><ArrowDown size={16} /></button><button type="button" onClick={() => updateItems(navbar.items.filter((_, i) => i !== index))} aria-label={`حذف ${navLabel(item)}`} className="rounded p-2 text-destructive"><Trash2 size={16} /></button></div></div>)}</div>
      <div className="flex flex-wrap items-center gap-3"><select id="add-nav-item" defaultValue="" className="rounded-lg border border-input bg-background px-3 py-2 text-sm"><option value="" disabled>اختر رابطًا لإضافته</option>{navChoices.filter(([key]) => !navbar.items.includes(key)).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><button type="button" onClick={() => { const select = document.getElementById("add-nav-item") as HTMLSelectElement | null; if (select?.value) { updateItems([...navbar.items, select.value]); select.value = "" } }} className="rounded-lg border border-border px-3 py-2 text-sm">إضافة عنصر</button><button type="button" onClick={() => { setNavbarEnabled((v) => !v); setDirty((s) => ({ ...s, navbar: true })) }} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">{navbarEnabled ? <Eye size={16} /> : <EyeOff size={16} />}{navbarEnabled ? "مفعّلة" : "معطّلة"}</button><button type="button" onClick={() => void save("navbar")} disabled={saving !== null || !dirty.navbar} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-50"><Save size={16} />{saving === "navbar" ? "جارٍ الحفظ…" : "حفظ القائمة"}</button></div>
    </section>
  </div>
}
