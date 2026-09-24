import type { Metadata } from "next"
import type { CSSProperties } from "react"
import Link from "next/link"
import { Clock3, MapPin, MessageCircle } from "lucide-react"
import { getAreaLandingData, getAreaLinkHref, getAreaWhatsAppUrl, toAreaDisplayPlan } from "@/lib/country-content"
import { getPublishedClassroomVideos } from "@/lib/classroom-videos"
import { countryPages } from "@/components/layout/country-pages-section"
import { italyLandingConfig, getItalyWhatsAppUrl } from "@/lib/italy-landing-config"
import { ItalyJourney } from "./italy-journey"
import { ItalyMonthlyTickets } from "./italy-monthly-tickets"

const canonical = italyLandingConfig.seo.canonical

export const metadata: Metadata = {
  title: italyLandingConfig.seo.title,
  description: italyLandingConfig.seo.description,
  keywords: ["تحفيظ القرآن أونلاين في إيطاليا", "تحفيظ القرآن في روما أونلاين", "تحفيظ القرآن في ميلانو", "تعليم العربية أونلاين في إيطاليا", "دروس قرآن للأطفال في تورينو", "تعلم العربية في نابولي أونلاين", "باقات تحفيظ القرآن باليورو"],
  alternates: { canonical, languages: { ar: canonical, "x-default": canonical } },
  openGraph: { title: italyLandingConfig.seo.title, description: italyLandingConfig.seo.description, url: canonical, locale: "ar_IT", type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز في إيطاليا" }] },
  twitter: { card: "summary_large_image", title: italyLandingConfig.seo.title, description: italyLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] },
}

export default async function ItalyPage() {
  const [areaData, videos] = await Promise.all([getAreaLandingData("italy"), getPublishedClassroomVideos()])
  const quranPlans = areaData.packages.map(toAreaDisplayPlan).filter((plan) => plan.program === "quran")
  const arabicPlans = areaData.packages.map(toAreaDisplayPlan).filter((plan) => plan.program === "arabic")
  const quranPrices = quranPlans.length >= 4 ? quranPlans.slice(0, 4).map((plan) => plan.price) : italyLandingConfig.quranPrices
  const arabicPrices = arabicPlans.length >= 4 ? arabicPlans.slice(0, 4).map((plan) => plan.price) : italyLandingConfig.arabicPrices
  const cities = areaData.cities.length ? areaData.cities.map((city) => city.name_ar) : italyLandingConfig.cities
  const faq = areaData.faq.length ? areaData.faq.map((item) => [item.question_ar, item.answer_ar] as const) : italyLandingConfig.faq
  const theme = areaData.theme ? { primary: areaData.theme.primary_color, accent: areaData.theme.accent_color, background: areaData.theme.background_color, surface: areaData.theme.secondary_color, ink: areaData.theme.text_color } : italyLandingConfig.theme
  const baseContact = getAreaLinkHref(areaData.links, "whatsapp", getItalyWhatsAppUrl())
  const trialUrl = getAreaWhatsAppUrl(areaData.links, "حصة تجريبية مجانية في إيطاليا", baseContact)
  const packageUrl = getAreaWhatsAppUrl(areaData.links, "باقات القرآن أو العربية في إيطاليا", baseContact)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${canonical}#webpage`, url: canonical, name: italyLandingConfig.seo.title, description: italyLandingConfig.seo.description, inLanguage: "ar" },
      { "@type": "EducationalOrganization", "@id": `${canonical}#organization`, name: "أكاديمية الحافظ المتميز", url: "https://quran-elhafez.com/", areaServed: { "@type": "Country", name: "Italy" } },
      { "@type": "Course", name: "تحفيظ القرآن أونلاين في إيطاليا", description: "حصص فردية للحفظ والمراجعة والقراءة عبر الإنترنت.", provider: { "@id": `${canonical}#organization` }, offers: quranPrices.map((price, index) => ({ "@type": "Offer", price, priceCurrency: "EUR", category: `${[4, 8, 12, 16][index]} حصص شهريًا`, url: canonical })) },
      { "@type": "Course", name: "تأسيس العربية أونلاين في إيطاليا", description: "حصص فردية لبناء أساس القراءة والفهم بالعربية عبر الإنترنت.", provider: { "@id": `${canonical}#organization` }, offers: arabicPrices.map((price, index) => ({ "@type": "Offer", price, priceCurrency: "EUR", category: `${[4, 8, 12, 16][index]} حصص شهريًا`, url: canonical })) },
      { "@type": "FAQPage", mainEntity: faq.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) },
    ],
  }

  return (
    <main dir="rtl" className="min-h-screen overflow-hidden" style={{ "--italy-primary": theme.primary, "--italy-accent": theme.accent, "--italy-background": theme.background, "--italy-surface": theme.surface, "--italy-ink": theme.ink } as CSSProperties}>
      <header className="bg-[#20364A] px-5 py-4 text-[#F7F0E6] sm:px-8"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4"><span className="font-black tracking-wide">إيطاليا · القرآن والعربية</span><a href={trialUrl} target="_blank" rel="noreferrer" className="rounded-full border border-[#D3A13B] px-4 py-2 text-sm font-black text-[#F7F0E6]">احجز الحصة التجريبية</a></div></header>
      <section className="bg-[#7A3E35] px-5 pb-20 pt-14 text-[#F7F0E6] sm:px-8 lg:pb-28 lg:pt-20"><div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-end"><div><p className="text-sm font-black tracking-[0.22em] text-[#D3A13B]">ألبوم الشهر · إيطاليا</p><h1 className="mt-6 max-w-4xl text-balance text-5xl font-black leading-[1.08] sm:text-7xl">من التعارف إلى روتين ثابت للقرآن والعربية</h1><p className="mt-7 max-w-2xl text-lg leading-9 text-[#F7F0E6]/85">من روما وميلانو إلى تورينو ونابولي، ابدأ بتوضيح هدفك ووقتك. تعرّف إلى البرنامج والباقات الشهرية، ثم تواصل معنا باللغة العربية للحصة التجريبية.</p><div className="mt-8 flex flex-wrap gap-3"><a href="#italy-journey" className="rounded-full bg-[#D3A13B] px-6 py-3 font-black text-[#20364A]">استكشف خطوات البداية</a><a href={trialUrl} target="_blank" rel="noreferrer" className="rounded-full border border-[#F7F0E6] px-6 py-3 font-black">احجز الحصة التجريبية</a></div></div><div className="rounded-[2rem] border border-[#D3A13B]/60 bg-[#20364A]/25 p-7"><span className="text-6xl">{italyLandingConfig.flag}</span><p className="mt-6 text-sm font-black text-[#D3A13B]">تعلم فردي أونلاين</p><p className="mt-2 text-2xl font-black">يبدأ من هدفك وينمو مع روتينك.</p><div className="mt-6 flex flex-wrap gap-2 text-sm font-bold">{cities.map((city) => <span key={city} className="rounded-full border border-[#D3A13B]/60 px-3 py-2">{city}</span>)}</div></div></div></section>
      <section lang="it" className="bg-[#F7F0E6] px-5 py-12 sm:px-8" aria-labelledby="italy-local-card-title"><div className="mx-auto max-w-5xl rounded-[1.75rem] border-r-4 border-[#66704A] bg-[#E8D9BF] p-6 text-left text-[#20364A] sm:p-9"><p className="text-xs font-black tracking-[0.2em] text-[#7A3E35]">{italyLandingConfig.localCard.title}</p><h2 id="italy-local-card-title" className="mt-3 text-2xl font-black sm:text-3xl">{italyLandingConfig.localCard.heading}</h2><p className="mt-4 max-w-4xl text-lg leading-8">{italyLandingConfig.localCard.body}</p></div></section>
      <ItalyJourney videos={videos} />
      <section className="bg-[#E8D9BF] px-5 py-16 sm:px-8"><div className="mx-auto max-w-6xl"><div className="grid gap-5 md:grid-cols-2"><article className="rounded-[2rem] bg-[#66704A] p-7 text-white"><p className="text-sm font-bold text-[#F7F0E6]">تحفيظ القرآن الكريم</p><h2 className="mt-3 text-3xl font-black">روتين ثابت للحفظ والمراجعة</h2><p className="mt-4 leading-8 text-white/85">دروس فردية لتنظيم الحفظ والمراجعة والقراءة وفق نقطة بداية الطالب وهدفه، مع باقات شهرية واضحة باليورو.</p></article><article className="rounded-[2rem] bg-[#20364A] p-7 text-white"><p className="text-sm font-bold text-[#D3A13B]">تأسيس اللغة العربية</p><h2 className="mt-3 text-3xl font-black">أساس تدريجي للقراءة والفهم</h2><p className="mt-4 leading-8 text-white/80">مسار تدريجي لبناء أساس القراءة والفهم بالعربية، يبدأ من مستوى الطالب وهدفه التعليمي.</p></article></div></div></section>
      <section className="bg-[#F7F0E6] px-5 py-16 text-[#20364A] sm:px-8"><div className="mx-auto max-w-6xl"><div className="flex items-start gap-3"><MapPin className="mt-1 text-[#7A3E35]" /><div><p className="text-sm font-black text-[#7A3E35]">السياق المحلي</p><h2 className="mt-2 text-3xl font-black">التعلم أونلاين من مدن إيطاليا</h2><p className="mt-4 max-w-3xl leading-8 text-[#20364A]/75">من روما وميلانو إلى تورينو ونابولي، يمكنك التعلم أونلاين من المكان الذي يناسبك. ذكر المدينة سياق الصفحة، والتواصل باللغة العربية لتنسيق الموعد.</p><div className="mt-6 flex flex-wrap gap-2">{cities.map((city) => <span key={city} className="rounded-full border border-[#66704A] bg-white px-4 py-2 text-sm font-bold">{city}</span>)}</div><p className="mt-5 flex items-center gap-2 text-sm font-bold text-[#66704A]"><Clock3 size={16} /> {areaData.timezones.find((timezone) => timezone.is_primary)?.label_ar || italyLandingConfig.timezone}</p></div></div></div></section>
      <ItalyMonthlyTickets whatsapp={packageUrl} quranPrices={quranPrices} arabicPrices={arabicPrices} />
      <section className="bg-[#20364A] px-5 py-16 text-[#F7F0E6] sm:px-8"><div className="mx-auto max-w-6xl"><p className="text-sm font-black text-[#D3A13B]">إجابات البداية</p><h2 className="mt-3 text-3xl font-black">أسئلة عن الدراسة من إيطاليا</h2><div className="mt-8 grid gap-4 md:grid-cols-2">{faq.map(([question, answer]) => <article key={question} className="rounded-2xl border border-white/15 bg-white/5 p-5"><h3 className="font-black text-[#D3A13B]">{question}</h3><p className="mt-3 leading-7 text-[#F7F0E6]/80">{answer}</p></article>)}</div></div></section>
      <section className="bg-[#D3A13B] px-5 py-16 text-center text-[#20364A] sm:px-8"><div className="mx-auto max-w-3xl"><h2 className="text-4xl font-black">خطط لروتينك الشهري</h2><p className="mt-4 leading-8">اذكر مدينتك والبرنامج الذي تريده والوقت المناسب لك، وسيتولى التواصل باللغة العربية تنسيق الخطوة التالية.</p><a href={trialUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#7A3E35] px-6 py-3 font-black text-white"><MessageCircle size={18} /> أريد الحصة التجريبية</a></div></section>
      <footer className="border-t-4 border-[#D3A13B] bg-[#20364A] px-5 py-7 text-[#F7F0E6] sm:px-8"><div className="mx-auto max-w-6xl"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><span className="text-sm font-black tracking-wide">إيطاليا · {new Date().getFullYear()}</span><nav aria-label="روابط صفحة إيطاليا" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-[#F7F0E6]/85"><Link href="/">الرئيسية</Link><Link href="/games">الألعاب والمسابقات</Link><Link href="/library">المكتبة</Link><Link href="/contact">التواصل</Link><Link href="/privacy">الخصوصية</Link><Link href="/terms">الشروط</Link></nav></div><details className="mt-6 border-t border-white/15 pt-5"><summary className="cursor-pointer text-sm font-black text-[#D3A13B]">صفحاتنا حسب الدولة</summary><nav aria-label="كل صفحات الدول" className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">{countryPages.map((country) => <Link key={country.href} href={country.href} className="rounded-md border border-white/15 px-3 py-2 text-sm text-[#F7F0E6]/85 transition hover:border-[#D3A13B] hover:text-white"><span className="me-2" aria-hidden="true">{country.flag}</span>{country.label}</Link>)}</nav></details></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}
