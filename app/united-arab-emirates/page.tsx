import type { Metadata } from "next"
import { getCountrySeoAlternates } from "@/lib/seo-metadata"
import Link from "next/link"
import Image from "next/image"
import { Check, ChevronLeft, Clock3, MapPin, MessageCircle, ShieldCheck, Sparkles } from "lucide-react"
import UaeLandingClient from "./uae-landing-client"
import { LandingPageVideoStrip } from "@/components/LandingPageVideoStrip"
import { getUaeWhatsAppUrl, uaeLandingConfig, type UaeProgram } from "@/lib/uae-landing-config"
import { getAreaLandingData, getAreaWhatsAppUrl, toAreaDisplayPlan, type AreaDisplayPlan } from "@/lib/country-content"
import { CountryPagesSection } from "@/components/layout/country-pages-section"
import { CountryServiceLinks } from "@/components/country-service-links"
import { getCountryThemeStyle } from "@/components/country-enrichment-section"

export const metadata: Metadata = {
  title: uaeLandingConfig.seo.title,
  description: uaeLandingConfig.seo.description,
  alternates: getCountrySeoAlternates("unitedArabEmirates"),
  robots: { index: true, follow: true },
  openGraph: { title: uaeLandingConfig.seo.title, description: uaeLandingConfig.seo.description, url: uaeLandingConfig.seo.canonical, locale: "ar_AE", type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز" }] },
  twitter: { card: "summary_large_image", title: uaeLandingConfig.seo.title, description: uaeLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] },
}


function PlanCard({ plan, contactUrl }: { plan: AreaDisplayPlan; contactUrl?: string }) {
  return <article data-saudi-program={plan.program} data-saudi-duration={plan.duration} className={`saudi-plan-card ${plan.popular ? "saudi-plan-card-featured" : ""}`}>
    {plan.popular && <span className="saudi-popular-badge"><Sparkles size={14} /> الأكثر طلباً</span>}
    <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-muted-foreground">{plan.program === "quran" ? "تحفيظ القرآن الكريم" : "تأسيس اللغة العربية"}</p><h3 className="mt-2 text-xl font-bold text-foreground">{plan.duration} دقيقة</h3></div><div className="rounded-full bg-secondary p-3 text-primary"><MessageCircle size={20} /></div></div>
    <div className="mt-7 flex items-end gap-2"><strong className="text-4xl font-bold tracking-tight text-primary">{plan.price}</strong><span className="pb-1 text-sm font-semibold text-muted-foreground">درهم إماراتي شهرياً</span></div>
    <p className="mt-2 text-sm text-muted-foreground">{plan.monthlySessions} حصص شهرياً · {plan.weeklySessions} {plan.weeklySessions === 1 ? "حصة" : "حصص"} أسبوعياً</p>
    <p className="mt-4 min-h-12 text-sm leading-6 text-muted-foreground">{plan.description}</p>
    <ul className="mt-5 grid gap-3 border-t border-border pt-5 text-sm text-foreground">{plan.features.map((feature) => <li key={feature} className="flex items-center gap-2"><Check size={17} className="text-accent" />{feature}</li>)}</ul>
    <a className="saudi-plan-cta mt-7" href={contactUrl ?? getUaeWhatsAppUrl(plan.name)} target="_blank" rel="noreferrer"><MessageCircle size={18} /> احجز الحصة التجريبية الأولى المجانية</a>
  </article>
}

const planInfoByProgram = {
  quran: [["حصص فردية مباشرة باللغة العربية عبر الإنترنت", "تُعقد الدروس بشكل فردي ومباشر عبر Zoom أو Google Meet."],["حفظ القرآن ومراجعته مع التلاوة والتجويد", "تركز الحصص على حفظ القرآن ومراجعته وتلاوته وتجويده بحسب هدف الطالب."],["الحصة التجريبية الأولى مجانية", "تواصل عبر WhatsApp لطلب الحصة التجريبية الأولى المجانية ومعرفة الخطوة التالية."]],
  arabic: [["تأسيس العربية قراءة وكتابة أونلاين في الإمارات", "حصص فردية مباشرة باللغة العربية لتأسيس القراءة والكتابة."],["مهارات القراءة والكتابة باللغة العربية", "تعرّف على برنامج تأسيس العربية واختر المهارة التي تريد البدء بها."],["الحصة التجريبية الأولى مجانية", "تواصل عبر WhatsApp لطلب الحصة التجريبية الأولى المجانية ومعرفة الخطوة التالية."]],
} as const

const faqGroupsByProgram = {
  quran: [[["هل الحصص فردية وباللغة العربية؟", "نعم، الحصص فردية مباشرة باللغة العربية."], ["ما مجالات برنامج القرآن؟", "تشمل الحصص حفظ القرآن ومراجعته وتلاوته وتجويده."]], [["كيف تتم الحصة أونلاين؟", "تتم الحصة الفردية عبر Zoom أو Google Meet، ويُنسّق البدء من خلال WhatsApp."], ["هل يمكن بدء التلاوة والتجويد؟", "نعم، تتضمن برامج القرآن التلاوة والتجويد إلى جانب الحفظ والمراجعة."]], [["هل توجد حصة تجريبية مجانية؟", "نعم، الحصة التجريبية الأولى مجانية. تواصل عبر WhatsApp للتنسيق."], ["كيف أبدأ من الإمارات؟", "راسلنا عبر WhatsApp لطلب الحصة التجريبية الأولى المجانية."]]],
  arabic: [[["ما الذي تتضمنه حصص العربية؟", "تتضمن تأسيس القراءة والكتابة بالعربية."], ["هل الحصص فردية ومباشرة؟", "نعم، تُقدّم الحصص بصورة فردية ومباشرة أونلاين."]], [["كيف أبدأ من الإمارات؟", "تواصل عبر WhatsApp لطلب الحصة التجريبية الأولى المجانية والتنسيق للبدء."], ["كيف تتم الحصة أونلاين؟", "تُعقد الحصة عبر Zoom أو Google Meet."]], [["هل توجد حصة تجريبية مجانية؟", "نعم، الحصة التجريبية الأولى مجانية. راسلنا عبر WhatsApp للبدء."], ["ما المهارات التي تشملها الحصة؟", "تركز حصص العربية على تأسيس القراءة والكتابة."]]],
} as const

function PlanInfoCard({ title, text }: { title: string; text: string }) {
  return <div className="saudi-reveal my-10 rounded-2xl border border-border bg-secondary/50 p-6 text-center shadow-sm"><h3 className="text-xl font-bold">{title}</h3><p className="mx-auto mt-3 max-w-3xl leading-8 text-muted-foreground">{text}</p></div>
}

function FAQGroup({ items }: { items: readonly (readonly [string, string])[] }) {
  return <div className="saudi-reveal mt-8 grid gap-3 text-right sm:grid-cols-2">{items.map(([question, answer]) => <details key={question} className="rounded-xl border border-border bg-card p-5 shadow-sm"><summary className="cursor-pointer font-bold">{question}</summary><p className="mt-3 leading-7 text-muted-foreground">{answer}</p></details>)}</div>
}

async function PlansSection({ program, title }: { program: UaeProgram; title: string }) {
  const areaData = await getAreaLandingData("united-arab-emirates")
  const databasePlans = areaData.packages.map(toAreaDisplayPlan).filter((plan) => plan.program === program)
  const plans = databasePlans.length ? databasePlans : (uaeLandingConfig.plans.filter((plan) => plan.program === program && plan.visible) as unknown as AreaDisplayPlan[])
  const info = planInfoByProgram[program]
  const faqs = faqGroupsByProgram[program]
  return <section className="mt-16" aria-labelledby={`${program}-plans`}><h3 id={`${program}-plans`} className="text-center text-2xl font-bold text-foreground">{title}</h3>{Array.from({ length: Math.ceil(plans.length / 4) }, (_, groupIndex) => <div key={`${program}-group-${groupIndex}`}><div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{plans.slice(groupIndex * 4, groupIndex * 4 + 4).map((plan) => <PlanCard key={plan.id} plan={plan} contactUrl={getAreaWhatsAppUrl(areaData.links, plan.name, getUaeWhatsAppUrl(plan.name))} />)}</div><PlanInfoCard title={info[groupIndex][0]} text={info[groupIndex][1]} /><FAQGroup items={faqs[groupIndex]} /></div>)}</section>
}

export default async function UaeArabiaPage() {
  const trialUrl = getUaeWhatsAppUrl("طلب حصة تجريبية مجانية")
  const areaData = await getAreaLandingData("united-arab-emirates")
  const faqItems = [...faqGroupsByProgram.quran.flat(1), ...faqGroupsByProgram.arabic.flat(1)]
  const areaTrialUrl = getAreaWhatsAppUrl(areaData.links, "طلب حصة تجريبية مجانية", getUaeWhatsAppUrl("طلب حصة تجريبية مجانية"))
  return <main dir="rtl" style={getCountryThemeStyle(areaData.theme)} className="min-h-screen overflow-hidden bg-background">
    <header className="bg-primary text-primary-foreground"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8"><Link href="/" className="flex items-center gap-3"><Image src="/logo.png" alt="شعار أكاديمية الحافظ المتميز" width={44} height={44} className="size-11 rounded-lg bg-secondary object-contain" priority /><span className="font-bold">أكاديمية الحافظ المتميز</span></Link><div className="flex items-center gap-3"><span className="text-2xl" aria-label="الإمارات العربية المتحدة" title="الإمارات العربية المتحدة" role="img">🇦🇪</span><a className="saudi-secondary-cta bg-primary-foreground px-3 py-2 text-sm text-primary" href={areaTrialUrl} target="_blank" rel="noreferrer">احجز الحصة التجريبية الأولى المجانية</a></div></div></header>
    <section className="saudi-hero relative islamic-pattern text-center"><div className="uae-flag-badge" aria-label="الإمارات العربية المتحدة" title="خدمة أونلاين مخصصة للطلاب في دولة الإمارات"><span aria-hidden="true">🇦🇪</span></div><div className="mx-auto max-w-4xl px-5 py-20 sm:px-8 lg:py-28"><p className="saudi-eyebrow justify-center"><Sparkles size={16} /> أكاديمية الحافظ المتميز</p><h1 className="mt-6 text-balance text-4xl font-bold leading-tight text-foreground sm:text-6xl">تحفيظ القرآن أونلاين في الإمارات</h1><p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">إذا كنت تبحث عن تحفيظ القرآن أونلاين في الإمارات، تقدم الأكاديمية حصصًا فردية مباشرة باللغة العربية لتحفيظ القرآن ومراجعته وتلاوته وتجويده، مع إمكانية تأسيس العربية قراءة وكتابة. تتم الحصص عبر Zoom أو Google Meet، ويبدأ التواصل عبر WhatsApp.</p><div className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-2 text-sm font-bold"><span className="rounded-full bg-secondary px-4 py-2 text-secondary-foreground">أول حصة تجريبية مجانية</span></div><div className="mt-8 flex flex-wrap justify-center gap-3"><a className="saudi-primary-cta" href={areaTrialUrl} target="_blank" rel="noreferrer"><MessageCircle size={19} /> احجز الحصة التجريبية الأولى المجانية</a><a className="saudi-secondary-cta" href="#plans">استعرض الباقات <ChevronLeft size={18} /></a></div></div></section>
    <LandingPageVideoStrip />

    <UaeLandingClient />
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24"><div className="saudi-reveal mx-auto max-w-3xl rounded-2xl border border-border bg-card p-7 text-center shadow-md"><p className="saudi-eyebrow justify-center">أول حصة تجريبية مجانية</p><p className="mt-3 text-sm text-muted-foreground">ابدأ بحصة مجانية قبل اختيار الباقة المناسبة.</p><p className="saudi-eyebrow justify-center mt-6">ابدأ بخطوة واضحة</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">تحفيظ القرآن أونلاين في الإمارات</h2><p className="mt-5 leading-8 text-muted-foreground">تُقدَّم حصص فردية مباشرة باللغة العربية أونلاين لحفظ القرآن ومراجعته وتلاوته وتجويده. كما تتوفر حصص لتأسيس القراءة والكتابة بالعربية. ابدأ بالحصة التجريبية الأولى المجانية وتواصل عبر WhatsApp.</p></div><div className="mt-16 text-center"><p className="saudi-eyebrow justify-center">برامج تعليمية مرنة</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">حصص فردية مباشرة باللغة العربية</h2><p className="mt-4 leading-7 text-muted-foreground">تعرّف على خيارات الحصص الفردية المباشرة باللغة العربية.</p></div><div id="plans" className="scroll-mt-8"><PlansSection program="quran" title="حفظ القرآن ومراجعته وتلاوته وتجويده أونلاين في الإمارات" /><PlansSection program="arabic" title="تأسيس العربية قراءة وكتابة أونلاين في الإمارات" /></div></section>

    <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8"><div className="mx-auto max-w-3xl text-center"><p className="saudi-eyebrow justify-center">خدمات الأكاديمية</p><h2 className="mt-4 text-3xl font-bold">حفظ القرآن والتأسيس العربي أونلاين في الإمارات</h2><p className="mt-5 leading-8 text-muted-foreground">تشمل حصص القرآن الحفظ والمراجعة والتلاوة والتجويد، كما تشمل حصص العربية تأسيس القراءة والكتابة. تتم الدراسة في حصص فردية مباشرة باللغة العربية.</p></div></section>
    <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8"><div className="text-center"><p className="saudi-eyebrow justify-center">ابدأ بخطوات بسيطة</p><h2 className="mt-4 text-3xl font-bold">كيف تبدأ حصتك من الإمارات؟</h2></div><ol className="mx-auto mt-10 grid max-w-2xl gap-4">{["حصص فردية لتحفيظ القرآن وتأسيس العربية.", "اضغط على احجز الحصة التجريبية الأولى المجانية.", "أرسل عبر WhatsApp البرنامج الذي تريده وطلبك للحصة التجريبية الأولى المجانية.", "ننسق معك موعد الحصة التجريبية."].map((step, index) => <li key={step} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{index + 1}</span><span className="font-semibold">{step}</span></li>)}</ol></section>
    <section className="px-5 py-20 text-center sm:px-8"><div className="mx-auto max-w-3xl rounded-2xl bg-primary px-6 py-12 text-primary-foreground shadow-xl"><h2 className="text-3xl font-bold sm:text-4xl">ابدأ بالحصة التجريبية الأولى المجانية</h2><p className="mt-4 text-primary-foreground/80">أرسل لنا بيانات الطالب والوقت المناسب، وسنساعدك في اختيار البرنامج الأفضل.</p><a className="saudi-secondary-cta mt-8 bg-primary-foreground text-primary" href={areaTrialUrl} target="_blank" rel="noreferrer"><MessageCircle size={19} /> احجز الحصة التجريبية الأولى المجانية</a></div></section>

    <CountryServiceLinks />
    <footer className="bg-primary text-primary-foreground"><div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.2fr_1fr]"><div><div className="flex items-center gap-3"><Image src="/logo.png" alt="شعار أكاديمية الحافظ المتميز" width={48} height={48} className="size-12 rounded-lg bg-secondary object-contain" /><div><p className="font-bold">أكاديمية الحافظ المتميز</p><p className="mt-1 text-sm text-primary-foreground/70">تحفيظ القرآن وتأسيس اللغة العربية أونلاين في الإمارات</p></div></div><p className="mt-4 max-w-md text-sm leading-7 text-primary-foreground/75">حصص فردية مباشرة باللغة العربية أونلاين لحفظ القرآن وتأسيس القراءة والكتابة.</p></div><nav aria-label="روابط صفحة الإمارات" className="grid content-start gap-x-6 gap-y-3 text-sm text-primary-foreground/90 sm:grid-cols-2"><Link href="/games">الألعاب والمسابقات</Link><Link href="/library">المكتبة</Link><Link href="/teachers">المعلمين والمعلمات</Link><Link href="/blog">المدونة</Link><Link href="/privacy">سياسة الخصوصية</Link><Link href="/terms">شروط الاستخدام</Link><Link href="/refund-policy">سياسة الاسترداد</Link></nav><CountryPagesSection /></div><div className="border-t border-primary-foreground/10 px-5 py-5 text-center text-xs text-primary-foreground/65 sm:px-8">© {new Date().getFullYear()} أكاديمية الحافظ المتميز. جميع الحقوق محفوظة.</div></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: (faqItems.length ? faqItems : [...faqGroupsByProgram.quran.flat(1), ...faqGroupsByProgram.arabic.flat(1)]).map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }) }} />
  </main>
}
