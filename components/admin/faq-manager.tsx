"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowDown, ArrowUp } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((response) => response.json())

type FAQ = {
  id: number
  question_ar: string
  question_en: string | null
  question_fr: string | null
  answer_ar: string
  answer_en: string | null
  answer_fr: string | null
  category: string
  sort_order: number
  is_active: boolean
}

const emptyForm = { question_ar: "", question_en: "", question_fr: "", answer_ar: "", answer_en: "", answer_fr: "", category: "general", sort_order: 0, is_active: true }

export function FAQManager() {
  const { data = [], mutate, isLoading } = useSWR<FAQ[]>("/api/admin/faq", fetcher)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [status, setStatus] = useState("")

  useEffect(() => {
    const handler = (event: Event) => {
      const action = (event as CustomEvent<{ action?: string }>).detail?.action
      if (action === "create") { setEditingId(null); setForm(emptyForm) }
      if (action === "save") void mutate()
    }
    window.addEventListener("admin:section-action", handler)
    return () => window.removeEventListener("admin:section-action", handler)
  }, [mutate])

  const update = (key: keyof typeof emptyForm, value: string | number | boolean) => setForm((current) => ({ ...current, [key]: value }))

  async function save() {
    setStatus("جاري الحفظ...")
    const response = await fetch("/api/admin/faq", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { id: editingId, data: form } : form),
    })
    if (!response.ok) { setStatus("تعذر حفظ السؤال"); return }
    setForm(emptyForm); setEditingId(null); await mutate(); setStatus("تم الحفظ")
  }

  async function remove(id: number) {
    if (!window.confirm("هل تريد حذف هذا السؤال؟")) return
    const response = await fetch(`/api/admin/faq?id=${id}`, { method: "DELETE" })
    if (response.ok) { await mutate(); setStatus("تم الحذف") } else setStatus("تعذر الحذف")
  }

  function edit(item: FAQ) {
    setEditingId(item.id)
    setForm({ question_ar: item.question_ar, question_en: item.question_en ?? "", question_fr: item.question_fr ?? "", answer_ar: item.answer_ar, answer_en: item.answer_en ?? "", answer_fr: item.answer_fr ?? "", category: item.category, sort_order: item.sort_order, is_active: item.is_active })
  }

  async function move(index: number, direction: -1 | 1) {
    if (data.length < 2) return
    const targetIndex = (index + direction + data.length) % data.length
    const current = data[index]
    const target = data[targetIndex]
    if (!current || !target) return
    const reordered = [...data]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(targetIndex, 0, moved)
    const responses = await Promise.all(reordered.map((item, position) => fetch("/api/admin/faq", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, data: { sort_order: position } }),
    })))
    if (responses.some((response) => !response.ok)) { setStatus("تعذر حفظ ترتيب الأسئلة"); return }
    await mutate()
    setStatus("تم حفظ الترتيب")
  }

  return <div className="space-y-6">
    <Card className="space-y-4 p-6">
      <h2 className="text-lg font-bold">{editingId ? "تعديل سؤال" : "إضافة سؤال شائع"}</h2>
      <Input value={form.question_ar} onChange={(event) => update("question_ar", event.target.value)} placeholder="السؤال بالعربية" />
      <Input value={form.question_en} onChange={(event) => update("question_en", event.target.value)} placeholder="Question in English" />
      <Input value={form.question_fr} onChange={(event) => update("question_fr", event.target.value)} placeholder="Question en français" />
      <textarea value={form.answer_ar} onChange={(event) => update("answer_ar", event.target.value)} placeholder="الإجابة بالعربية" className="min-h-28 w-full rounded-md border border-border bg-background p-3 text-sm" />
      <textarea value={form.answer_en} onChange={(event) => update("answer_en", event.target.value)} placeholder="Answer in English" className="min-h-24 w-full rounded-md border border-border bg-background p-3 text-sm" />
      <textarea value={form.answer_fr} onChange={(event) => update("answer_fr", event.target.value)} placeholder="Réponse en français" className="min-h-24 w-full rounded-md border border-border bg-background p-3 text-sm" />
      <div className="flex flex-wrap gap-3"><Input value={form.category} onChange={(event) => update("category", event.target.value)} placeholder="التصنيف" /><Input type="number" value={form.sort_order} onChange={(event) => update("sort_order", Number(event.target.value))} placeholder="الترتيب" /></div>
      <div className="flex gap-2"><Button onClick={save}>{editingId ? "تحديث" : "إضافة"}</Button>{editingId && <Button variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm) }}>إلغاء</Button>}</div>
      {status && <p role="status" className="text-sm text-muted-foreground">{status}</p>}
    </Card>
    {isLoading ? <p>جاري التحميل...</p> : data.map((item, index) => <Card key={item.id} className="flex flex-wrap items-start justify-between gap-4 p-4"><div><p className="font-bold">{item.question_ar}</p><p className="mt-1 text-sm text-muted-foreground">{item.category} — {item.is_active ? "مفعّل" : "مخفي"} — ترتيب {item.sort_order}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" aria-label="تحريك السؤال لأعلى" onClick={() => void move(index, -1)}><ArrowUp className="size-4" /></Button><Button size="sm" variant="outline" aria-label="تحريك السؤال لأسفل" onClick={() => void move(index, 1)}><ArrowDown className="size-4" /></Button><Button size="sm" variant="outline" onClick={() => edit(item)}>تعديل</Button><Button size="sm" variant="destructive" onClick={() => remove(item.id)}>حذف</Button></div></Card>)}
  </div>
}
