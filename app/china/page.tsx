import type { Metadata } from "next"
import type { CSSProperties } from "react"
import Link from "next/link"
import { Clock3, MapPin, MessageCircle } from "lucide-react"
import { getAreaLandingData, getAreaLinkHref, getAreaWhatsAppUrl, toAreaDisplayPlan } from "@/lib/country-content"
import { getPublishedClassroomVideos } from "@/lib/classroom-videos"
import { chinaLandingConfig, getChinaWhatsAppUrl } from "@/lib/china-landing-config"
import { countryPages } from "@/components/layout/country-pages-section"
import { ChinaGoalStepper } from "./china-goal-stepper"
import { ChinaPriceReveal } from "./china-price-reveal"

const canonical = chinaLandingConfig.seo.canonical

export const metadata: Metadata = {
  title: chinaLandingConfig.seo.title,
  description: chinaLandingConfig.seo.description,
  keywords: ["تحفيظ القرآن أونلاين في الصين", "تعليم القرآن أونلاين في بكين", "تحفيظ القرآن في شنغهاي", "تعلم العربية أونلاين في الصين", "دروس قرآن للأطفال في غوانغجو", "معلم قرآن أونلاين في شِنْجِن", "تحفيظ القرآن بالعربية أونلاين"],
  alternates: { canonical, languages: { ar: canonical, "x-default": canonical } },
  openGraph: { title: chinaLandingConfig.seo.title, description: chinaLandingConfig.seo.description, url: canonical, locale: "ar_CN", type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز في الصين" }] },
  twitter: { card: "summary_large_image", title: chinaLandingConfig.seo.title, description: chinaLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] },
}

export default async function ChinaPage() {
  const [areaData, videos] = await Promise.all([getAreaLandingData("china"), getPublishedClassroomVideos()])
  const quranPlans = areaData.packages.map(toAreaDisplayPlan).filter((plan) => plan.program === "quran")
  const arabicPlans = areaData.packages.map(toAreaDisplayPlan).filter((plan) => plan.program === "arabic")
  const quranPrices = quranPlans.length >= 4 ? quranPlans.slice(0, 4).map((plan) => plan.price) : chinaLandingConfig.quranPrices
  const arabicPrices = arabicPlans.length >= 4 ? arabicPlans.slice(0, 4).map((plan) => plan.price) : chinaLandingConfig.arabicPrices
  const cities = areaData.cities.length ? areaData.cities.map((city) => city.name_ar) : chinaLandingConfig.cities
  const faq = areaData.faq.length ? areaData.faq.map((item) => [item.question_ar, item.answer_ar] as const) : chinaLandingConfig.faq
  const theme = areaData.theme ? { primary: areaData.theme.primary_color, accent: areaData.theme.accent_color, background: areaData.theme.background_color, surface: areaData.theme.secondary_color, ink: areaData.theme.text_color } : chinaLandingConfig.theme
  const baseContact = getAreaLinkHref(areaData.links, "whatsapp", getChinaWhatsAppUrl())
  const trialUrl = getAreaWhatsAppUrl(areaData.links, "حصة تجريبية مجانية في الصين", baseContact)
  const packageUrl = getAreaWhatsAppUrl(areaData.links, "برنامج القرآن أو العربية في الصين", baseContact)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${canonical}#webpage`, url: canonical, name: chinaLandingConfig.seo.title, description: chinaLandingConfig.seo.description, inLanguage: "ar" },
      { "@type": "EducationalOrganization", "@id": `${canonical}#organization`, name: "أكاديمية الحافظ المتميز", url: "https://quran-elhafez.com/", areaServed: { "@type": "Country", name: "China" } },
      { "@type": "Course", name: "تحفيظ القرآن أونلاين في الصين", description: "حصص فردية للحفظ والمراجعة والقراءة عبر الإنترنت.", provider: { "@id": `${canonical}#organization` }, offers: quranPrices.map((price, index) => ({ "@type": "Offer", price, priceCurrency: "CNY", category: `${[4, 8, 12, 16][index]} حصص شهريًا`, url: canonical })) },
      { "@type": "Course", name: "تأسيس العربية أونلاين في الصين", description: "حصص فردية لبناء أساس القراءة والفهم بالعربية عبر الإنترنت.", provider: { "@id": `${canonical}#organization` }, offers: arabicPrices.map((price, index) => ({ "@type": "Offer", price, priceCurrency: "CNY", category: `${[4, 8, 12, 16][index]} حصص شهريًا`, url: canonical })) },
      { "@type": "FAQPage", mainEntity: faq.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) },
    ],
  }

  return (
    <main dir="rtl" className="min-h-screen overflow-hidden" style={{ "--china-primary": theme.primary, "--china-accent": theme.accent, "--china-background": theme.background, "--china-surface": theme.surface, "--china-ink": theme.ink } as CSSProperties}>
      <header className="bg-[#211a18] px-5 py-4 text-[#fffaf1] sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <span className="font-black tracking-wide">الصين · مسار القرآن والعربية</span>
          <a href={trialUrl} target="_blank" rel="noreferrer" className="rounded-full border border-[#c9953d] px-4 py-2 text-sm font-black text-[#f3d79d]">احجز الحصة التجريبية</a>
        </div>
      </header>

      <section aria-labelledby="china-opening-title" className="bg-[#7e1f27] px-5 pb-20 pt-14 text-[#fffaf1] sm:px-8 lg:pb-28 lg:pt-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#f3d79d]">دفتر الهدف · الصين</p>
            <h1 id="china-opening-title" className="mt-6 max-w-4xl text-balance text-5xl font-black leading-[1.08] sm:text-7xl">ابدأ من هدفك، ثم اختر وقتك، ثم اسأل</h1>
            <p className="mt-7 max-w-2xl text-lg leading-9 text-[#f9e8d2] sm:text-xl">من بكين إلى شنغهاي وغوانغجو وشِنْجِن، يمكنك التعرف إلى برامج القرآن والعربية أونلاين بطريقة واضحة. اختر ما تريد تعلمه، اذكر الوقت المناسب لك، وأرسل سؤالك قبل اتخاذ القرار.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#china-steps" className="inline-flex items-center gap-2 rounded-full bg-[#c9953d] px-6 py-3 font-black text-[#211a18]">اختر هدفك</a><a href={trialUrl} target="_blank" rel="noreferrer" className="rounded-full border border-[#f9e8d2] px-6 py-3 font-black text-[#fffaf1]">تواصل واسأل عن الموعد</a></div>
          </div>
          <div className="rounded-[2rem] border border-[#f3d79d]/40 bg-[#211a18]/25 p-7"><span className="text-6xl">{chinaLandingConfig.flag}</span><p className="mt-6 text-sm font-black text-[#f3d79d]">تعلم فردي أونلاين</p><p className="mt-2 text-2xl font-black">القرآن أو العربية، بسؤال واضح.</p><div className="mt-6 flex flex-wrap gap-2 text-sm font-bold text-[#f9e8d2]">{cities.map((city) => <span key={city} className="rounded-full border border-[#f3d79d]/50 px-3 py-2">{city}</span>)}</div></div>
        </div>
      </section>

      <section lang="zh-Hans" className="bg-[#f7f0e3] px-5 py-12 sm:px-8" aria-labelledby="china-local-card-title">
        <div className="mx-auto max-w-5xl rounded-[1.75rem] border-r-4 border-[#c9953d] bg-[#e8d7bc] p-6 text-left text-[#211a18] sm:p-9">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#7e1f27]">{chinaLandingConfig.localCard.title}</p>
          <h2 id="china-local-card-title" className="mt-3 text-2xl font-black sm:text-3xl">{chinaLandingConfig.localCard.heading}</h2>
          <p className="mt-4 max-w-4xl text-lg leading-8">{chinaLandingConfig.localCard.body}</p>
          <p lang="ar" className="mt-4 border-t border-[#211a18]/15 pt-4 text-sm font-bold leading-7 text-[#6c5140]">{chinaLandingConfig.localCard.note}</p>
        </div>
      </section>

      <ChinaGoalStepper videos={videos} />

      <section className="bg-[#fffaf1] px-5 py-16 sm:px-8"><div className="mx-auto max-w-6xl"><div className="grid gap-5 md:grid-cols-2"><article className="rounded-[2rem] bg-[#2f5d50] p-7 text-white"><p className="text-sm font-bold text-[#f3d79d]">تحفيظ القرآن الكريم</p><h2 className="mt-3 text-3xl font-black">روتين ثابت للحفظ والمراجعة</h2><p className="mt-4 leading-8 text-white/80">برنامج فردي يركز على بناء عادة ثابتة للحفظ والمراجعة والقراءة. يحدد الطالب هدفه ومستواه، ثم يتعرف إلى الباقة المناسبة بعد الحصة التجريبية.</p><Link href="/quran" className="mt-6 inline-block font-black text-[#f3d79d]">تعرّف إلى برنامج القرآن ←</Link></article><article className="rounded-[2rem] bg-[#211a18] p-7 text-white"><p className="text-sm font-bold text-[#e4bd6e]">تأسيس اللغة العربية</p><h2 className="mt-3 text-3xl font-black">أساس تدريجي للقراءة والفهم</h2><p className="mt-4 leading-8 text-white/75">مسار تدريجي للطالب الذي يريد البدء من الأساس أو تحسين القراءة والفهم. يبدأ الحوار من احتياج الطالب الحقيقي، وليس من مستوى مفترض.</p><Link href="/arabic" className="mt-6 inline-block font-black text-[#e4bd6e]">تعرّف إلى برنامج العربية ←</Link></article></div></div></section>

      <section className="bg-[#e8d7bc] px-5 py-16 sm:px-8"><div className="mx-auto max-w-6xl"><div className="flex items-start gap-3"><MapPin className="mt-1 text-[#7e1f27]" /><div><p className="text-sm font-black text-[#7e1f27]">السياق المحلي</p><h2 className="mt-2 text-3xl font-black text-[#211a18]">من بكين وشنغهاي إلى غوانغجو وشِنْجِن</h2><p className="mt-4 max-w-3xl leading-8 text-[#5e5147]">الدراسة أونلاين لا تتطلب وجود مركز في مدينتك. ابدأ من المكان الذي تعيش فيه، ثم ناقش الموعد والبرنامج عبر قناة التواصل المتاحة. لا تعني هذه المدن وجود فرع محلي أو فريق مقيم فيها.</p><div className="mt-6 flex flex-wrap gap-2">{cities.map((city) => <span key={city} className="rounded-full border border-[#b99d72] bg-[#fffaf1] px-4 py-2 text-sm font-bold text-[#211a18]">{city}</span>)}</div><p className="mt-5 flex items-center gap-2 text-sm font-bold text-[#6c5b4f]"><Clock3 size={16} /> المواعيد تُنسق حسب {areaData.timezones.find((timezone) => timezone.is_primary)?.label_ar || chinaLandingConfig.timezone}</p></div></div></div></section>

      <ChinaPriceReveal whatsapp={packageUrl} quranPrices={quranPrices} arabicPrices={arabicPrices} />

      <section className="bg-[#211a18] px-5 py-16 text-white sm:px-8"><div className="mx-auto max-w-5xl"><p className="text-sm font-black text-[#e4bd6e]">إجابات قبل البداية</p><h2 className="mt-3 text-3xl font-black">سؤال واحد في كل مرة</h2><div className="mt-8 max-w-3xl space-y-3">{faq.map(([question, answer]) => <details key={question} className="rounded-2xl border border-white/15 bg-white/5 p-5"><summary className="cursor-pointer font-black">{question}</summary><p className="mt-3 leading-7 text-white/75">{answer}</p></details>)}</div></div></section>

      <section className="bg-[#c9953d] px-5 py-16 text-center text-[#211a18] sm:px-8"><div className="mx-auto max-w-3xl"><h2 className="text-4xl font-black">ابدأ بسؤال واضح</h2><p className="mt-4 leading-8">اكتب مدينتك، والبرنامج الذي تريده، والوقت المناسب لك. سنبدأ من هذه المعلومات البسيطة قبل اختيار الباقة.</p><a href={trialUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#7e1f27] px-6 py-3 font-black text-white"><MessageCircle size={18} /> أريد حصة تجريبية</a></div></section>

      <footer className="border-t-4 border-[#c9953d] bg-[#211a18] px-5 py-7 text-[#fffaf1] sm:px-8"><div className="mx-auto max-w-6xl"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><span className="text-sm font-black tracking-wide">مسار الصين · {new Date().getFullYear()}</span><nav aria-label="روابط صفحة الصين" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-[#f9e8d2]"><Link href="/">الرئيسية</Link><Link href="/games">الألعاب والمسابقات</Link><Link href="/library">المكتبة</Link><Link href="/contact">التواصل</Link><Link href="/privacy">الخصوصية</Link><Link href="/terms">الشروط</Link></nav></div><details className="mt-6 border-t border-[#ffffff24] pt-5"><summary className="cursor-pointer text-sm font-black text-[#e4bd6e]">صفحاتنا حسب الدولة</summary><nav aria-label="كل صفحات الدول" className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">{countryPages.map((country) => <Link key={country.href} href={country.href} className="rounded-md border border-[#ffffff24] px-3 py-2 text-sm text-[#f9e8d2] transition hover:border-[#c9953d] hover:text-white"><span className="me-2" aria-hidden="true">{country.flag}</span>{country.label}</Link>)}</nav></details></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}
