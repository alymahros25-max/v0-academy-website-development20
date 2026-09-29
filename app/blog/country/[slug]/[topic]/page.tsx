import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, BookOpenText, Lightbulb, MessageCircle } from 'lucide-react'
import { countryEducationalContent } from '@/lib/country-educational-content'
import { countryArticleLocalisation } from '@/lib/country-article-localization'
import { getSeoAlternates } from '@/lib/seo-metadata'

type Props = { params: Promise<{ slug: string; topic: string }> }

export function generateStaticParams() {
  return Object.keys(countryEducationalContent).flatMap((slug) => ['quran', 'arabic'].map((topic) => ({ slug, topic })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, topic } = await params
  const content = countryEducationalContent[slug]
  if (!content || !['quran', 'arabic'].includes(topic)) return {}
  const title = topic === 'quran' ? content.quranArticleTitle : content.arabicArticleTitle
  return {
    title: `${title} | ${content.name}`,
    description: topic === 'quran' ? content.quranArticleBody : content.arabicArticleBody,
    alternates: getSeoAlternates(`https://quran-elhafez.com/blog/country/${slug}/${topic}`),
  }
}

export default async function CountryArticlePage({ params }: Props) {
  const { slug, topic } = await params
  const content = countryEducationalContent[slug]
  const local = countryArticleLocalisation[slug]
  if (!content || !local || !['quran', 'arabic'].includes(topic)) notFound()
  const isQuran = topic === 'quran'
  const title = isQuran ? content.quranArticleTitle : content.arabicArticleTitle
  const body = isQuran ? content.quranArticleBody : content.arabicArticleBody
  const challenge = isQuran ? local.quranChallenge : local.arabicChallenge
  const Icon = isQuran ? BookOpenText : Lightbulb
  return <main dir="rtl" className="min-h-screen bg-background">
    <header className="border-b border-border bg-primary/5 px-5 py-5 sm:px-8">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        <Link href={`/${slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-primary"><ArrowRight size={16} /> العودة إلى صفحة {content.name}</Link>
        <Link href="/blog" className="text-sm font-bold text-muted-foreground hover:text-primary">المدونة</Link>
      </div>
    </header>
    <article className="mx-auto max-w-4xl px-5 py-14 sm:px-8 lg:py-20">
      <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black ${isQuran ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'}`}><Icon size={18} /> {isQuran ? 'مقالة عن حفظ القرآن' : 'مقالة عن تأسيس العربية'} · {content.name}</div>
      <h1 className="mt-6 text-4xl font-black leading-tight text-foreground sm:text-5xl">{title}</h1>
      <p className="mt-6 text-xl leading-9 text-muted-foreground">{body}</p>
      <section className="mt-10 rounded-3xl border border-primary/15 bg-primary/5 p-6 sm:p-8">
        <h2 className="text-2xl font-black text-foreground">مراعاة احتياج الطلاب في {content.name}</h2>
        <p className="mt-4 leading-8 text-muted-foreground">تخدم هذه الزاوية الأسر والطلاب في {local.cities}، وتركز على مشكلة شائعة: {challenge}. لذلك يبدأ المعلم من مستوى الطالب ووقته وهدف الأسرة، ثم يضع خطوة قابلة للمتابعة داخل الحصة وخارجها.</p>
      </section>
      <section className="mt-10">
        <h2 className="text-2xl font-black text-foreground">كيف يستفيد الطالب من المقالة؟</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5"><strong>تحديد البداية</strong><p className="mt-2 text-sm leading-7 text-muted-foreground">نعرف مستوى الطالب وما يحتاج إليه أولًا بدل نسخ خطة عامة.</p></div>
          <div className="rounded-2xl border border-border bg-card p-5"><strong>خطوة عملية</strong><p className="mt-2 text-sm leading-7 text-muted-foreground">يتحول الهدف إلى قراءة أو حفظ أو مراجعة يمكن تطبيقها هذا الأسبوع.</p></div>
          <div className="rounded-2xl border border-border bg-card p-5"><strong>متابعة فردية</strong><p className="mt-2 text-sm leading-7 text-muted-foreground">تُراجع النتيجة مع المعلم وتُعدّل الخطة وفق تقدم الطالب.</p></div>
        </div>
      </section>
      <div className="mt-12 flex flex-wrap items-center justify-center gap-3 rounded-3xl bg-primary p-6 text-center text-primary-foreground">
        <p className="w-full text-lg font-black">هل تريد اختيار المسار المناسب للطالب؟</p>
        <a href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-primary"><MessageCircle size={18} /> احجز الحصة التجريبية الأولى المجانية</a>
        <Link href={`/${slug}`} className="rounded-xl border border-white/50 px-5 py-3 font-bold">العودة إلى صفحة الدولة</Link>
      </div>
    </article>
  </main>
}
