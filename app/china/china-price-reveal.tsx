'use client'

import { useState } from "react"
import { MessageCircle } from "lucide-react"

const programCopy = {
  quran: { label: "تحفيظ القرآن", intro: "روتين فردي للحفظ والمراجعة والقراءة بحسب نقطة البداية." },
  arabic: { label: "تأسيس العربية", intro: "مسار تدريجي لتحسين القراءة والفهم وبناء الأساس اللغوي." },
} as const

export function ChinaPriceReveal({ whatsapp, quranPrices, arabicPrices }: { whatsapp: string; quranPrices: readonly number[]; arabicPrices: readonly number[] }) {
  const programs = { quran: { ...programCopy.quran, prices: quranPrices }, arabic: { ...programCopy.arabic, prices: arabicPrices } }
  const [program, setProgram] = useState<keyof typeof programs>("quran")
  const selected = programs[program]
  return (
    <section id="china-plans" className="bg-[#fffaf1] px-5 py-16 sm:px-8" aria-labelledby="china-prices-title">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#7e1f27]">لوحة اختيار واحدة</p>
          <h2 id="china-prices-title" className="mt-3 text-3xl font-black text-[#211a18] sm:text-5xl">اختر البرنامج لتظهر الباقات باليوان الصيني</h2>
          <p className="mt-4 leading-8 text-[#5e5147]">الأسعار الشهرية مبنية على حصة أساسية مدتها 30 دقيقة. اختر البرنامج أولًا، ثم راجع عدد الحصص واسأل عن الموعد قبل التسجيل.</p>
        </div>
        <div className="mt-9 grid gap-3 sm:grid-cols-2" role="tablist" aria-label="برامج الصين">
          {(Object.keys(programs) as Array<keyof typeof programs>).map((key) => <button key={key} type="button" role="tab" aria-selected={program === key} onClick={() => setProgram(key)} className={`rounded-2xl border px-5 py-4 text-right font-black transition ${program === key ? "border-[#7e1f27] bg-[#7e1f27] text-white" : "border-[#d6c4a8] bg-white text-[#211a18] hover:border-[#c9953d]"}`}>{programs[key].label}<span className={`mt-1 block text-sm font-normal ${program === key ? "text-white/75" : "text-[#6c5b4f]"}`}>{programs[key].intro}</span></button>)}
        </div>
        <div className="mt-6 overflow-hidden rounded-[2rem] border border-[#d6c4a8] bg-white shadow-sm" role="tabpanel">
          <div className="border-b border-[#eadfce] bg-[#2f5d50] px-5 py-5 text-white sm:px-7"><p className="text-sm font-bold text-[#f3d79d]">{selected.label}</p><p className="mt-1 text-white/80">30 دقيقة للحصة · الدفع غير مفعّل</p></div>
          <div className="divide-y divide-[#eee4d6]">
            {[4, 8, 12, 16].map((sessions, index) => <a key={sessions} href={whatsapp} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 px-5 py-5 transition hover:bg-[#fff8ed] sm:px-7"><span><strong className="block text-lg text-[#211a18]">{sessions} حصص شهريًا</strong><small className="text-[#6c5b4f]">{sessions / 4} أسبوعيًا</small></span><span className="text-left"><b className="block text-2xl text-[#7e1f27]">{selected.prices[index]} CNY</b><span className="mt-1 flex items-center justify-end gap-1 text-sm font-bold text-[#2f5d50]"><MessageCircle size={15} /> اسأل عن هذه الباقة</span></span></a>)}
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-xl rounded-2xl bg-[#e8d7bc] p-4 text-center font-bold text-[#211a18]">يوجد باقات مخصصة. يمكنك السؤال عن التفاصيل بعد الحصة التجريبية.</p>
      </div>
    </section>
  )
}
