'use client'

import { useState } from "react"
import { MessageCircle } from "lucide-react"

const programs = {
  quran: { label: "تحفيظ القرآن الكريم", intro: "روتين فردي للحفظ والمراجعة والقراءة." },
  arabic: { label: "تأسيس اللغة العربية", intro: "مسار فردي لبناء القراءة والفهم بالعربية." },
} as const

type Program = keyof typeof programs

export function RussiaPriceRibbon({ whatsapp, quranPrices, arabicPrices }: { whatsapp: string; quranPrices: readonly number[]; arabicPrices: readonly number[] }) {
  const [program, setProgram] = useState<Program>("quran")
  const prices = program === "quran" ? quranPrices : arabicPrices
  const labels = ["البداية", "الاستمرار", "التقدم", "الروتين المكثف"]
  const sessions = [4, 8, 12, 16]

  return (
    <section id="russia-plans" className="bg-[#C9D6DC] px-5 py-16 text-[#162B45] sm:px-8" aria-labelledby="russia-prices-title">
      <div className="mx-auto max-w-5xl">
        <div className="border-r-8 border-[#B56B45] pr-5 sm:pr-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#31546D]">شريط الباقات · روسيا</p>
          <h2 id="russia-prices-title" className="mt-3 text-3xl font-black sm:text-5xl">الباقات الشهرية بالروبل الروسي</h2>
          <p className="mt-4 max-w-2xl leading-8 text-[#162B45]/75">مدة الحصة الأساسية 30 دقيقة. اختر البرنامج، ثم مرر على الشريط لمعرفة الإيقاع الشهري والسعر.</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3" role="tablist" aria-label="برامج روسيا">
          {(Object.keys(programs) as Program[]).map((key) => <button key={key} type="button" role="tab" aria-selected={program === key} onClick={() => setProgram(key)} className={`rounded-xl border-2 px-5 py-3 font-black transition motion-reduce:transition-none ${program === key ? "border-[#162B45] bg-[#162B45] text-[#EAF4F7]" : "border-[#31546D] bg-[#EAF4F7] text-[#162B45] hover:bg-[#B56B45] hover:text-white"}`}>{programs[key].label}</button>)}
        </div>
        <p className="mt-6 rounded-xl bg-[#EAF4F7] p-4 font-bold">{programs[program].intro}</p>
        <div className="mt-7 space-y-3 border-r-4 border-[#162B45] pr-4">
          {sessions.map((count, index) => <a key={count} href={whatsapp} target="_blank" rel="noreferrer" className="group flex min-h-24 items-center justify-between gap-4 rounded-l-2xl border border-[#162B45]/15 bg-[#EAF4F7] px-5 py-4 shadow-[6px_0_0_#B56B45] transition hover:translate-x-1 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#B56B45]/40 motion-reduce:transition-none"><span><span className="block text-xs font-black uppercase tracking-[0.16em] text-[#31546D]">{labels[index]}</span><strong className="mt-1 block text-xl font-black">{count} حصص شهريًا</strong><span className="mt-1 block text-sm text-[#162B45]/65">{count / 4} أسبوعيًا · {programs[program].label}</span></span><span className="text-left"><b className="block text-2xl font-black text-[#B56B45] sm:text-4xl">{prices[index]} ₽</b><span className="mt-1 flex items-center justify-end gap-1 text-xs font-black text-[#31546D]"><MessageCircle size={14} /> اسأل بالعربية</span></span></a>)}
        </div>
        <div className="mt-7 flex flex-wrap gap-3"><p className="rounded-xl bg-[#EAF4F7] px-5 py-3 font-bold">يوجد باقات مخصصة.</p><p className="rounded-xl border border-[#B56B45] px-5 py-3 font-bold">خصم 10٪ للأخوات والإحالة</p></div>
      </div>
    </section>
  )
}
