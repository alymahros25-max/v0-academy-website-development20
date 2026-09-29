'use client'

import { useState } from "react"
import { MessageCircle } from "lucide-react"

const programs = {
  quran: { label: "تحفيظ القرآن الكريم", intro: "إيقاع هادئ للحفظ والمراجعة والقراءة." },
  arabic: { label: "تأسيس اللغة العربية", intro: "بداية تدريجية للقراءة والفهم بالعربية." },
} as const

type Program = keyof typeof programs

export function NorwaySubscriptionScale({ whatsapp, quranPrices, arabicPrices }: { whatsapp: string; quranPrices: readonly number[]; arabicPrices: readonly number[] }) {
  const [program, setProgram] = useState<Program>("quran")
  const prices = program === "quran" ? quranPrices : arabicPrices
  const sessions = [4, 8, 12, 16]
  const rhythm = ["مرة أسبوعيًا", "مرتان أسبوعيًا", "ثلاث مرات أسبوعيًا", "أربع مرات أسبوعيًا"]

  return (
    <section id="norway-plans" className="bg-[#C7D5D8] px-5 py-16 text-[#234B5A] sm:px-8" aria-labelledby="norway-prices-title">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 border-b border-[#234B5A]/20 pb-8 md:flex-row md:items-end md:justify-between"><div><p className="text-sm font-black uppercase tracking-[0.18em] text-[#58756B]">مقياس الاشتراك · النرويج</p><h2 id="norway-prices-title" className="mt-3 text-3xl font-black sm:text-5xl">اختر إيقاع الشهر بالكرونة النرويجية</h2><p className="mt-4 max-w-2xl leading-8 text-[#234B5A]/70">مدة الحصة الأساسية 30 دقيقة. انتقل من البداية الهادئة إلى الإيقاع المكثف حسب وقتك وهدفك.</p></div><span className="rounded-full bg-[#F4F8F7] px-4 py-2 text-sm font-black">NOK · kr</span></div>
        <div className="mt-8 flex flex-wrap gap-3" role="tablist" aria-label="برامج النرويج">{(Object.keys(programs) as Program[]).map((key) => <button key={key} type="button" role="tab" aria-selected={program === key} onClick={() => setProgram(key)} className={`rounded-full border-2 px-5 py-3 font-black transition motion-reduce:transition-none ${program === key ? "border-[#234B5A] bg-[#234B5A] text-white" : "border-[#58756B] bg-[#F4F8F7] text-[#234B5A] hover:bg-[#58756B] hover:text-white"}`}>{programs[key].label}</button>)}</div>
        <p className="mt-6 font-bold text-[#234B5A]/75">{programs[program].intro}</p>
        <div className="mt-9 overflow-x-auto pb-6"><div className="flex min-w-[760px] items-stretch gap-3" role="list" aria-label="الباقات الشهرية">{sessions.map((count, index) => <a key={count} href={whatsapp} target="_blank" rel="noreferrer" role="listitem" className="group flex min-h-48 flex-1 flex-col justify-between rounded-2xl border border-[#234B5A]/15 bg-[#F4F8F7] p-5 shadow-[0_6px_0_#58756B] transition hover:-translate-y-1 hover:shadow-[0_9px_0_#C5965A] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C5965A]/40 motion-reduce:transition-none"><span className="text-xs font-black uppercase tracking-[0.15em] text-[#58756B]">{count} حصص</span><span><strong className="mt-4 block text-3xl font-black text-[#234B5A]">{prices[index]} kr</strong><span className="mt-2 block text-sm font-bold text-[#234B5A]/65">{rhythm[index]}</span></span><span className="mt-5 flex items-center gap-1 text-xs font-black text-[#C5965A]"><MessageCircle size={14} /> اسأل بالعربية</span></a>)}</div></div>
        <div className="flex flex-wrap gap-3"><p className="rounded-xl bg-[#F4F8F7] px-5 py-3 font-bold">يوجد باقات مخصصة.</p><p className="rounded-xl border border-[#58756B] px-5 py-3 font-bold">خصم 10٪ للأخوات والإحالة</p></div>
      </div>
    </section>
  )
}
