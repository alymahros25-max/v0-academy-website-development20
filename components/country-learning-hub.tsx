import { BookOpenText, GraduationCap, Lightbulb, UsersRound } from "lucide-react"
import { countryEducationalContent } from "@/lib/country-educational-content"

type Props = { slug: string; variant?: "cards" | "timeline" | "notebook" | "minimal"; showLocalCard?: boolean }

export function CountryLearningHub({ slug, variant = "cards", showLocalCard = true }: Props) {
  const content = countryEducationalContent[slug]
  if (!content) return null
  const sectionClass = variant === "timeline" ? "border-y border-slate-200 bg-slate-50" : variant === "notebook" ? "border-y-4 border-amber-300 bg-amber-50" : variant === "minimal" ? "border-y border-slate-200 bg-white" : "bg-stone-50"
  const cardClass = variant === "timeline" ? "rounded-none border-r-4 border-sky-600 bg-white" : variant === "notebook" ? "rounded-sm border-2 border-amber-200 bg-[#fffdf5] shadow-[4px_4px_0_#f1d38a]" : "rounded-3xl border border-slate-200 bg-white shadow-sm"
  return (
    <section className={`country-learning-hub px-5 py-16 sm:px-8 lg:py-20 ${sectionClass}`} aria-labelledby={`${slug}-learning-title`}>
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">مسارات التعلم · {content.name}</p>
          <h2 id={`${slug}-learning-title`} className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">القرآن والعربية في مسارين واضحين</h2>
          <p lang="ar" className="mt-4 max-w-2xl leading-8 text-slate-600">تشرح هذه الصفحة الخدمة التعليمية ومادتها باختصار، ثم تترك للطالب اختيار المسار الذي يناسب هدفه قبل التواصل.</p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <article className={`${cardClass} p-7`}>
            <div className="flex items-center gap-3 text-emerald-700"><BookOpenText size={22} aria-hidden="true" /><p className="text-sm font-black">كرت القرآن</p></div>
            <h3 className="mt-4 text-2xl font-black text-slate-900">{content.quranTitle}</h3>
            <p className="mt-4 leading-8 text-slate-600">{content.quranBody}</p>
            <details className="mt-5 border-t border-slate-200 pt-4">
              <summary className="cursor-pointer font-black text-emerald-700">اقرأ فكرة عن الحفظ والمراجعة</summary>
              <div className="mt-4 rounded-2xl bg-emerald-50 p-5"><h4 className="font-black text-slate-900">{content.quranArticleTitle}</h4><p className="mt-3 leading-8 text-slate-600">{content.quranArticleBody}</p></div>
            </details>
          </article>
          <article className={`${cardClass} p-7`}>
            <div className="flex items-center gap-3 text-indigo-700"><Lightbulb size={22} aria-hidden="true" /><p className="text-sm font-black">كرت العربية</p></div>
            <h3 className="mt-4 text-2xl font-black text-slate-900">{content.arabicTitle}</h3>
            <p className="mt-4 leading-8 text-slate-600">{content.arabicBody}</p>
            <details className="mt-5 border-t border-slate-200 pt-4">
              <summary className="cursor-pointer font-black text-indigo-700">اقرأ فكرة عن القراءة والفهم</summary>
              <div className="mt-4 rounded-2xl bg-indigo-50 p-5"><h4 className="font-black text-slate-900">{content.arabicArticleTitle}</h4><p className="mt-3 leading-8 text-slate-600">{content.arabicArticleBody}</p></div>
            </details>
          </article>
        </div>
        <article className={`${cardClass} mt-5 p-7`}>
          <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3 text-amber-700"><UsersRound size={22} aria-hidden="true" /><p className="text-sm font-black">بطاقة المعلمين والمعلمات</p></div><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900">خبرة وإجازات معتمدة</span></div>
          <h3 className="mt-4 text-2xl font-black text-slate-900">تعليم فردي بخبرة قرآنية ولغوية</h3>
          <p className="mt-4 max-w-4xl leading-8 text-slate-600">{content.teacherAngle}</p>
          <div className="mt-5 grid gap-3 text-sm font-bold text-slate-700 sm:grid-cols-3"><span className="rounded-2xl bg-amber-50 p-4">حفظ وتسميع ومراجعة</span><span className="rounded-2xl bg-amber-50 p-4">إجازات قرآنية موثقة</span><span className="rounded-2xl bg-amber-50 p-4">تأسيس قراءة وفهم بالعربية</span></div>
        </article>
        {showLocalCard && <div className="mt-7 rounded-2xl border border-slate-200 bg-white/70 p-5 text-left" dir="auto">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{content.name} · Al-Hafiz Academy</p>
          <p className="mt-2 leading-7 text-slate-600">{content.localTitle}</p>
          <p className="mt-2 leading-7 text-slate-600">{content.localDescription}</p>
        </div>}
      </div>
    </section>
  )
}
