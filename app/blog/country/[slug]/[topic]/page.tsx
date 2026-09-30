import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, BookOpenText, Lightbulb, MessageCircle, UsersRound } from 'lucide-react'
import { countryEducationalContent } from '@/lib/country-educational-content'
import { countryArticleLocalisation } from '@/lib/country-article-localization'
import { getSeoAlternates } from '@/lib/seo-metadata'
import { getAreaLandingData } from '@/lib/country-content'
import { getCountryThemeStyle } from '@/components/country-enrichment-section'

const flags: Record<string, string> = {
  'saudi-arabia': '🇸🇦', 'united-arab-emirates': '🇦🇪', 'united-states': '🇺🇸', canada: '🇨🇦', 'united-kingdom': '🇬🇧', australia: '🇦🇺', germany: '🇩🇪', france: '🇫🇷', spain: '🇪🇸', netherlands: '🇳🇱', belgium: '🇧🇪', sweden: '🇸🇪', kuwait: '🇰🇼', qatar: '🇶🇦', oman: '🇴🇲', jordan: '🇯🇴', bahrain: '🇧🇭', 'south-africa': '🇿🇦', china: '🇨🇳', italy: '🇮🇹', russia: '🇷🇺', norway: '🇳🇴', austria: '🇦🇹', switzerland: '🇨🇭', brazil: '🇧🇷', mexico: '🇲🇽', colombia: '🇨🇴', venezuela: '🇻🇪', denmark: '🇩🇰', greece: '🇬🇷', 'new-zealand': '🇳🇿', finland: '🇫🇮', turkey: '🇹🇷', indonesia: '🇮🇩', malaysia: '🇲🇾', portugal: '🇵🇹', poland: '🇵🇱', argentina: '🇦🇷', senegal: '🇸🇳', nigeria: '🇳🇬',
}

type Topic = 'quran' | 'arabic' | 'teachers'
type Props = { params: Promise<{ slug: string; topic: string }> }

export function generateStaticParams() {
  return Object.keys(countryEducationalContent).flatMap((slug) => (['quran', 'arabic', 'teachers'] as Topic[]).map((topic) => ({ slug, topic })))
}

function getArticle(content: (typeof countryEducationalContent)[string], local: (typeof countryArticleLocalisation)[string], topic: Topic) {
  if (topic === 'quran') return { label: 'مقالة عن حفظ القرآن', title: content.quranArticleTitle, intro: content.quranArticleBody, paragraph: `في ${local.cities}، تحتاج الأسرة أحيانًا إلى خطة مراجعة تناسب الدراسة والعمل واختلاف أوقات اليوم. لذلك تبدأ الحصة من مستوى الطالب: يقرأ المقطع، ثم يسمّع ما حفظه، ويتلقى تصحيحًا هادئًا للتلاوة والتجويد. بعد ذلك يتفق المعلم معه على مقدار واقعي يعود إليه قبل اللقاء التالي. ${local.quranChallenge}، ولهذا لا تكون الخطة واحدة للجميع؛ بل تتغير بحسب عمر الطالب وما أتقنه فعلًا.` }
  if (topic === 'arabic') return { label: 'مقالة عن تأسيس العربية', title: content.arabicArticleTitle, intro: content.arabicArticleBody, paragraph: `تختلف حاجة الأسر في ${local.cities}: قد يبحث أحد الوالدين عن بداية للقراءة، بينما يحتاج طالب آخر إلى تحسين النطق أو الكتابة والفهم. في الحصة يقرأ الطالب مادة مناسبة لمستواه، ويتحدث مع المعلم عن الكلمات والجمل، ثم يتدرب على المهارة التي تعوق تقدمه. ${local.arabicChallenge}، لذلك يكون التأسيس متدرجًا ومتصلاً بحياة الطالب، لا مجرد حفظ كلمات منفصلة.` }
  return { label: 'مقالة عن المعلمين والمعلمات', title: `كيف تجري الحصة مع معلمينا في ${content.name}؟`, intro: 'التعليم الفردي لا يعني قراءة المحتوى فقط؛ بل يعني أن يلاحظ المعلم مستوى الطالب أثناء الحصة ويعدل الشرح والتمرين في اللحظة المناسبة.', paragraph: `يبدأ المعلم بالتعرف إلى هدف الطالب وما يواجهه في ${local.cities} أو داخل الأسرة. في حصة القرآن يستمع إلى القراءة والتسميع، يصحح مخارج الحروف والتجويد، ويسأل الطالب عن المواضع التي تحتاج إلى مراجعة. وفي حصة العربية يقرأ الطالب كلمات وجملًا، ويتدرب على النطق والفهم والكتابة مع تصحيح مباشر دون إحراج. ثم تنتهي الحصة بملاحظة واضحة تساعد الأسرة على معرفة ما يمكن مراجعته قبل اللقاء التالي. ${content.teacherAngle}` }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, topic } = await params
  const content = countryEducationalContent[slug]
  const local = countryArticleLocalisation[slug]
  if (!content || !local || !['quran', 'arabic', 'teachers'].includes(topic)) return {}
  const article = getArticle(content, local, topic as Topic)
  return { title: `${article.title} | ${content.name}`, description: article.intro, alternates: getSeoAlternates(`https://quran-elhafez.com/blog/country/${slug}/${topic}`) }
}

export default async function CountryArticlePage({ params }: Props) {
  const { slug, topic } = await params
  const content = countryEducationalContent[slug]
  const local = countryArticleLocalisation[slug]
  if (!content || !local || !['quran', 'arabic', 'teachers'].includes(topic)) notFound()
  const areaData = await getAreaLandingData(slug)
  const article = getArticle(content, local, topic as Topic)
  const Icon = topic === 'quran' ? BookOpenText : topic === 'arabic' ? Lightbulb : UsersRound
  const flag = flags[slug] ?? '🌍'
  return <main dir="rtl" style={getCountryThemeStyle(areaData.theme)} className="min-h-screen overflow-hidden bg-background text-foreground">
    <header className="bg-primary text-primary-foreground"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8"><Link href={`/${slug}`} className="font-bold">أكاديمية الحافظ المتميز · {content.name}</Link><div className="flex items-center gap-3"><span className="text-2xl" role="img" aria-label={content.name}>{flag}</span><Link href={`/${slug}`} className="rounded-lg bg-primary-foreground px-3 py-2 text-sm font-bold text-primary">العودة إلى صفحة الدولة</Link></div></div></header>
    <article className="mx-auto max-w-4xl px-5 py-14 sm:px-8 lg:py-20"><div className="text-sm font-black text-primary">{article.label} · {content.name}</div><h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">{article.title}</h1><p className="mt-7 text-xl leading-9 text-muted-foreground">{article.intro}</p><div className="mt-10 space-y-6 text-lg leading-9 text-foreground/80"><p>{article.paragraph}</p><p>الهدف من هذه المقالة أن تعرف الأسرة ماذا يحدث فعلًا داخل الحصة، وأن تجد نقطة بداية مفهومة بدل الاعتماد على وصف عام. يتواصل الطالب والمعلم مباشرة عبر الإنترنت، وتُعدّل الأمثلة والسرعة والمقدار بحسب العمر والمستوى والوقت المتاح.</p></div><div className="mt-12 flex flex-wrap items-center justify-center gap-3 rounded-3xl bg-primary p-6 text-center text-primary-foreground"><p className="w-full text-lg font-black">هل تريد معرفة المسار المناسب للطالب؟</p><a href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-primary"><MessageCircle size={18} /> احجز الحصة التجريبية الأولى المجانية</a><Link href={`/${slug}`} className="rounded-xl border border-white/50 px-5 py-3 font-bold">العودة إلى صفحة الدولة</Link></div></article>
    <footer className="bg-primary px-5 py-10 text-primary-foreground sm:px-8"><div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2"><div><p className="font-bold">أكاديمية الحافظ المتميز · {content.name}</p><p className="mt-2 text-sm leading-7 text-primary-foreground/75">حصص فردية مباشرة لتحفيظ القرآن وتأسيس اللغة العربية أونلاين.</p></div><nav className="flex flex-wrap content-start gap-4 text-sm"><Link href={`/${slug}`}>صفحة الدولة</Link><Link href={`/blog/country/${slug}/quran`}>مقالة القرآن</Link><Link href={`/blog/country/${slug}/arabic`}>مقالة العربية</Link><Link href={`/blog/country/${slug}/teachers`}>عن المعلمين</Link></nav></div></footer>
  </main>
}
