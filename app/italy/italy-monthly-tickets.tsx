'use client'

import { useState } from "react"
import { ArrowLeft, MessageCircle } from "lucide-react"

const programs = {
  quran: { label: "تحفيظ القرآن الكريم", intro: "تنظيم الحفظ والمراجعة والقراءة ضمن روتين شهري.", prices: [] as readonly number[] },
  arabic: { label: "تأسيس اللغة العربية", intro: "بناء تدريجي للقراءة والفهم بالعربية.", prices: [] as readonly number[] },
} as const

type Program = keyof typeof programs

export function ItalyMonthlyTickets({ whatsapp, quranPrices, arabicPrices }: { whatsapp: string; quranPrices: readonly number[]; arabicPrices: readonly number[] }) {
  const [program, setProgram] = useState<Program>("quran")
  const selected = program === "quran" ? { ...programs.quran, prices: quranPrices } : { ...programs.arabic, prices: arabicPrices }
  const labels = ["محطة البداية", "إيقاع ثابت", "تقدم موسع", "روتين مكثف"]

  return (
    <section id="italy-plans" className="bg-[#F7F0E6] px-5 py-16 text-[#20364A] sm:px-8" aria-labelledby="italy-prices-title">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-5 border-b-2 border-[#7A3E35]/20 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black tracking-[0.18em] text-[#7A3E35]">روتين الشهر · إيطاليا</p>
            <h2 id="italy-prices-title" className="mt-3 text-3xl font-black sm:text-5xl">تذاكر رحلتك الشهرية باليورو</h2>
            <p className="mt-4 max-w-2xl leading-8 text-[#20364A]/75">كل تذكرة تمثل عددًا من الحصص خلال الشهر. مدة الحصة الأساسية 30 دقيقة، والتواصل باللغة العربية.</p>
          </div>
          <ArrowLeft className="hidden size-12 text-[#D3A13B] sm:block" aria-hidden="true" />
        </div>
        <div className="mt-8 flex flex-wrap gap-3" role="tablist" aria-label="برامج إيطاليا">
          {(Object.keys(programs) as Program[]).map((key) => (
            <button key={key} type="button" role="tab" aria-selected={program === key} onClick={() => setProgram(key)} className={`rounded-full border-2 px-5 py-3 text-sm font-black transition ${program === key ? "border-[#7A3E35] bg-[#7A3E35] text-white" : "border-[#66704A] bg-transparent text-[#20364A] hover:bg-[#66704A] hover:text-white"}`}>
              {programs[key].label}
            </button>
          ))}
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {[4, 8, 12, 16].map((sessions, index) => (
            <a key={sessions} href={whatsapp} target="_blank" rel="noreferrer" className="group relative overflow-hidden rounded-[1.75rem] border-2 border-[#20364A]/15 bg-white p-6 shadow-[7px_7px_0_#D3A13B] transition hover:-translate-y-1 hover:shadow-[10px_10px_0_#7A3E35] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7A3E35]/30">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#66704A]">{labels[index]}</span>
              <strong className="mt-4 block text-2xl font-black text-[#20364A]">{sessions} حصص شهريًا</strong>
              <span className="mt-2 block text-sm text-[#20364A]/65">{sessions / 4} أسبوعيًا · {selected.label}</span>
              <span className="mt-7 flex items-end justify-between gap-3"><b className="text-4xl font-black text-[#7A3E35]">{selected.prices[index]} €</b><span className="flex items-center gap-1 text-sm font-black text-[#66704A]"><MessageCircle size={16} /> اسأل عن الباقة</span></span>
            </a>
          ))}
        </div>
        <p className="mt-8 border-r-4 border-[#D3A13B] bg-white/70 p-4 font-bold">يوجد باقات مخصصة.</p>
      </div>
    </section>
  )
}
