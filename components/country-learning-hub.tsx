import { BookOpenText, Lightbulb, UsersRound } from "lucide-react"
import { countryEducationalContent } from "@/lib/country-educational-content"
import { getTeachers } from "@/lib/data-store"
import { CountryArticleDrawer } from "@/components/country-article-drawer"
import { CountryTeacherMarquee } from "@/components/country-teacher-marquee"

type Props = { slug: string; variant?: "cards" | "timeline" | "notebook" | "minimal"; showLocalCard?: boolean }

const articleModes: Record<string, "button" | "answer" | "side-tab" | "glow"> = {
  "south-africa": "glow", china: "answer", italy: "side-tab", russia: "button", norway: "glow", austria: "answer", switzerland: "side-tab", brazil: "button", mexico: "glow", colombia: "answer", venezuela: "side-tab", denmark: "button", greece: "glow", "new-zealand": "answer", finland: "side-tab", turkey: "button", indonesia: "glow", malaysia: "answer", portugal: "side-tab", poland: "button", argentina: "glow", senegal: "answer", nigeria: "side-tab",
  australia: "answer", canada: "side-tab", germany: "glow", "saudi-arabia": "button", "united-arab-emirates": "answer", "united-kingdom": "glow", "united-states": "side-tab", kuwait: "button", qatar: "glow", oman: "answer", jordan: "side-tab", bahrain: "button", france: "glow", spain: "answer", netherlands: "side-tab", belgium: "button", sweden: "glow",
}

export async function CountryLearningHub({ slug, variant = "cards", showLocalCard = true }: Props) {
  const content = countryEducationalContent[slug]
  if (!content) return null
  const teachers = await getTeachers()
  const articleMode = articleModes[slug] ?? "button"
  const sectionClass = variant === "timeline" ? "border-y border-slate-200 bg-slate-50" : variant === "notebook" ? "border-y-4 border-amber-300 bg-amber-50" : variant === "minimal" ? "border-y border-slate-200 bg-white" : "bg-stone-50"
  const cardClass = variant === "timeline" ? "rounded-none border-r-4 border-sky-600 bg-white" : variant === "notebook" ? "rounded-sm border-2 border-amber-200 bg-[#fffdf5] shadow-[4px_4px_0_#f1d38a]" : "rounded-3xl border border-slate-200 bg-white shadow-sm"
  return <section className={`country-learning-hub px-5 py-16 text-center sm:px-8 lg:py-20 ${sectionClass}`} aria-labelledby={`${slug}-learning-title`}>
    <div className="mx-auto max-w-6xl">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">مسارات التعلم · {content.name}</p>
        <h2 id={`${slug}-learning-title`} className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">القرآن والعربية في مسارين واضحين</h2>
        <p lang="ar" className="mx-auto mt-4 max-w-2xl leading-8 text-slate-600">اختر المسار الأقرب إلى هدف الطالب، ثم تعرف على التفاصيل التي تساعدك على بدء الحصة المناسبة.</p>
      </div>
      <div className="mt-10 grid gap-5 text-right lg:grid-cols-2">
        <article className={`${cardClass} p-7`}>
          <div className="flex items-center justify-center gap-3 text-emerald-700"><BookOpenText size={22} aria-hidden="true" /><p className="text-sm font-black">مسار القرآن</p></div>
          <h3 className="mt-4 text-center text-2xl font-black text-slate-900">{content.quranTitle}</h3>
          <p className="mt-4 text-center leading-8 text-slate-600">{content.quranBody}</p>
          <details className="country-more mt-5 text-right">
            <summary>المزيد عن حصة القرآن</summary>
            <div className="country-more-body"><p>تبدأ الحصة من مستوى الطالب وما يحتاج إلى قراءته أو حفظه أو مراجعته. يقرأ الطالب المقطع، ثم يسمّع ما حفظه، ويتلقى تصحيحًا مباشرًا في القراءة والتلاوة، وينتهي بخطوة واضحة للمراجعة قبل الحصة التالية.</p><p>يمكن أن يتركز اللقاء على الحفظ الجديد، أو التسميع، أو تثبيت المحفوظ السابق، بحسب هدف الطالب وخطته.</p></div>
          </details>
          <div className="mt-5 border-t border-slate-200 pt-4"><CountryArticleDrawer href={`/blog/country/${slug}/quran`} title={content.quranArticleTitle} body={content.quranArticleBody} tone="quran" mode={articleMode} /></div>
        </article>
        <article className={`${cardClass} p-7`}>
          <div className="flex items-center justify-center gap-3 text-indigo-700"><Lightbulb size={22} aria-hidden="true" /><p className="text-sm font-black">مسار اللغة العربية</p></div>
          <h3 className="mt-4 text-center text-2xl font-black text-slate-900">{content.arabicTitle}</h3>
          <p className="mt-4 text-center leading-8 text-slate-600">{content.arabicBody}</p>
          <details className="country-more mt-5 text-right">
            <summary>المزيد عن حصة العربية</summary>
            <div className="country-more-body"><p>تبدأ الحصة بتحديد المهارة التي يحتاج إليها الطالب: القراءة، أو النطق، أو فهم الكلمات والجمل. يقرأ الطالب مادة مناسبة لمستواه، ثم يتدرب مع المعلم على النطق والفهم خطوة خطوة.</p><p>لا تعتمد الحصة على حفظ كلمات منفصلة فقط؛ بل تربط الكلمة بصوتها ومعناها واستخدامها في جملة مفهومة.</p></div>
          </details>
          <div className="mt-5 border-t border-slate-200 pt-4"><CountryArticleDrawer href={`/blog/country/${slug}/arabic`} title={content.arabicArticleTitle} body={content.arabicArticleBody} tone="arabic" mode={articleMode} /></div>
        </article>
      </div>
      <article className={`${cardClass} mx-auto mt-5 max-w-5xl p-7 text-right`}>
        <div className="flex flex-wrap items-center justify-center gap-3 text-amber-700"><UsersRound size={22} aria-hidden="true" /><p className="text-sm font-black">معلمونا ومعلماتنا</p><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900">خبرة وإجازات وتخصصات متنوعة</span></div>
        <h3 className="mt-4 text-center text-2xl font-black text-slate-900">تعليم فردي يناسب مستوى الطالب</h3>
        <p className="mx-auto mt-4 max-w-4xl text-center leading-8 text-slate-600">نختار المسار وننسق الحصة وفق مستوى الطالب وهدفه، مع إمكانية توضيح تفضيل المعلم أو المعلمة عند التواصل.</p>
        <details className="country-more mx-auto mt-5 max-w-4xl text-right">
          <summary>المزيد عن المعلمين والمعلمات</summary>
          <div className="country-more-body"><p>يشرح المعلم للطالب ما الذي سيقرأه أو يراجعه، ويستمع إلى القراءة والتسميع، ثم يصحح المواضع التي تحتاج إلى تحسين. وفي العربية يقرأ الطالب كلمات وجملًا مناسبة لمستواه ويتدرب على النطق والفهم.</p><p>تظهر في الشريط أسماء المعلمين والمعلمات النشطين وتخصصاتهم وخبراتهم المسجلة في الموقع. عند التواصل يمكنك ذكر عمر الطالب ومستواه والبرنامج المفضل، وكذلك تفضيل معلم أو معلمة، ليتم تنسيق الاختيار المناسب.</p></div>
        </details>
        <div className="mx-auto mt-5 max-w-4xl border-t border-slate-200 pt-4"><CountryArticleDrawer href={`/blog/country/${slug}/teachers`} title="تعرّف على المعلمين والمعلمات" body={content.teacherAngle} tone="quran" mode="button" /></div>
        <CountryTeacherMarquee teachers={teachers} />
      </article>
      {showLocalCard && <div className="mx-auto mt-7 max-w-4xl rounded-2xl border border-slate-200 bg-white/70 p-5 text-center" dir="auto"><p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{content.name} · Al-Hafiz Academy</p><p className="mt-2 leading-7 text-slate-600">{content.localTitle}</p><p className="mt-2 leading-7 text-slate-600">{content.localDescription}</p></div>}
    </div>
  </section>
}
