"use client"

import { useState } from "react"
import { Check, MessageCircle } from "lucide-react"
import { getKuwaitWhatsAppUrl, kuwaitLandingConfig, type KuwaitProgram } from "@/lib/kuwait-landing-config"

function Plans({ program }: { program: KuwaitProgram }) {
  const plans = program === "quran" ? kuwaitLandingConfig.quranPlans : kuwaitLandingConfig.arabicPlans
  return (
    <section id={`${program}-plans`} className="mt-14 scroll-mt-8" aria-labelledby={`${program}-plans-heading`}>
      <div className="text-center">
        <h2 id={`${program}-plans-heading`} className="text-2xl font-bold text-kw-green sm:text-3xl">
          {program === "quran" ? "باقات تحفيظ القرآن للناطقين بالعربية" : "باقات تأسيس اللغة العربية للناطقين بالعربية"}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl leading-8 text-kw-muted">
          {program === "quran" ? "اختر الباقة الشهرية التي تناسب إيقاع تعلم الطالب، مع حصة فردية مدتها 30 دقيقة." : "حصص فردية تركز على المهارات التي يحتاجها الطالب في القراءة والكتابة والنطق والفهم."}
        </p>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => (
          <article key={plan.sessions} className="flex flex-col rounded-2xl border border-kw-line bg-white p-6 shadow-[0_8px_24px_rgb(20_36_30/0.06)]">
            <p className="text-sm font-semibold text-kw-muted">{program === "quran" ? "تحفيظ القرآن" : "تأسيس اللغة العربية"}</p>
            <h3 className="mt-3 text-xl font-bold text-kw-ink">{plan.name}</h3>
            <p className="mt-3 min-h-14 text-sm leading-7 text-kw-muted">{plan.description}</p>
            <div className="mt-6 border-y border-kw-line py-4">
              <strong className="text-4xl font-bold text-kw-green">{plan.price}</strong>
              <span className="ms-2 text-sm font-semibold text-kw-muted">د.ك شهريًا</span>
            </div>
            <ul className="mt-5 grid gap-3 text-sm text-kw-ink">
              <li className="flex items-center gap-2"><Check className="size-4 text-kw-gold" />{plan.sessions} حصص شهريًا</li>
              <li className="flex items-center gap-2"><Check className="size-4 text-kw-gold" />{plan.weekly} أسبوعيًا</li>
              <li className="flex items-center gap-2"><Check className="size-4 text-kw-gold" />مدة الحصة: 30 دقيقة</li>
              <li className="flex items-center gap-2"><Check className="size-4 text-kw-gold" />الفوترة: شهرية</li>
            </ul>
            <a href={getKuwaitWhatsAppUrl(program === "quran" ? "تحفيظ القرآن" : "تأسيس اللغة العربية")} target="_blank" rel="noreferrer" className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-kw-green px-4 py-3 text-sm font-bold text-white transition hover:bg-kw-green-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kw-gold focus-visible:ring-offset-2">
              <MessageCircle className="size-4" />{program === "quran" ? "احجز هذه الباقة" : "ابدأ مسار العربية"}
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

export default function KuwaitProgramSelector() {
  const [program, setProgram] = useState<KuwaitProgram | null>(null)
  return (
    <section id="programs" className="bg-kw-surface px-5 py-16 sm:px-8" aria-labelledby="programs-heading">
      <div className="mx-auto max-w-6xl">
        <div className="text-center"><h2 id="programs-heading" className="text-3xl font-bold text-kw-green sm:text-4xl">من أين تريد أن تبدأ؟</h2><p className="mx-auto mt-4 max-w-xl leading-8 text-kw-muted">اختر برنامجًا واحدًا لعرض الباقات المناسبة له.</p></div>
        <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2" role="tablist" aria-label="اختيار البرنامج">
          {(["quran", "arabic"] as const).map((item) => <button key={item} type="button" role="tab" aria-selected={program === item} aria-controls={`${item}-plans`} onClick={() => setProgram(item)} className={`group relative flex min-h-32 flex-col items-center justify-center rounded-2xl border-2 p-5 text-center shadow-[0_7px_0_rgb(15_93_60/0.2),0_16px_30px_rgb(15_93_60/0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_10px_0_rgb(15_93_60/0.25),0_22px_36px_rgb(15_93_60/0.18)] active:translate-y-0 active:shadow-[0_4px_0_rgb(15_93_60/0.2),0_10px_20px_rgb(15_93_60/0.12)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-kw-gold/35 focus-visible:ring-offset-2 ${program === item ? "border-kw-green bg-kw-green text-white shadow-[0_7px_0_#0a3f28,0_18px_34px_rgb(15_93_60/0.28)]" : item === "quran" ? "border-kw-green bg-kw-green text-white hover:bg-kw-green-dark" : "border-kw-gold bg-kw-gold text-kw-ink hover:bg-kw-gold/90"}`}><span className="block text-lg font-bold">{item === "quran" ? "تحفيظ القرآن" : "تأسيس اللغة العربية"}</span><span className={`mt-2 block text-sm leading-6 ${program === item || item === "quran" ? "text-white/85" : "text-kw-ink/80"}`}>{item === "quran" ? "حفظ وتسميع وتصحيح تلاوة ومراجعة ضمن حصة فردية." : "قراءة وكتابة ونطق وفهم وفق احتياج الطالب."}</span></button>)}
        </div>
        {program && <div><div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm"><span className="font-semibold text-kw-green">تم اختيار: {program === "quran" ? "تحفيظ القرآن" : "تأسيس اللغة العربية"}</span><button type="button" onClick={() => setProgram(null)} className="rounded-lg px-3 py-2 font-semibold text-kw-muted underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kw-gold">تغيير البرنامج</button></div><Plans program={program} /></div>}
      </div>
    </section>
  )
}
