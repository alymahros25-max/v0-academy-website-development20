import type { Metadata } from "next"
import type { CSSProperties } from "react"
import Link from "next/link"
import { Clock3, MapPin, MessageCircle } from "lucide-react"
import { getAreaLandingData, getAreaLinkHref, getAreaWhatsAppUrl, toAreaDisplayPlan } from "@/lib/country-content"
import { getPublishedClassroomVideos } from "@/lib/classroom-videos"
import { southAfricaLandingConfig, getSouthAfricaWhatsAppUrl } from "@/lib/south-africa-landing-config"
import { countryPages } from "@/components/layout/country-pages-section"
import { SouthAfricaVideoMap } from "./south-africa-video-map"

const canonical = southAfricaLandingConfig.seo.canonical

export const metadata: Metadata = {
  title: southAfricaLandingConfig.seo.title,
  description: southAfricaLandingConfig.seo.description,
  keywords: ["Koran klasse aanlyn in Suid-Afrika", "Koran memorisering Johannesburg", "Arabiese lesse aanlyn", "Al-Hafiz Akademie Suid-Afrika", "online Quran classes South Africa"],
  alternates: { canonical, languages: { ar: canonical, "x-default": canonical } },
  openGraph: {
    title: southAfricaLandingConfig.seo.title,
    description: southAfricaLandingConfig.seo.description,
    url: canonical,
    locale: "ar_ZA",
    type: "website",
    images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز في جنوب أفريقيا" }],
  },
  twitter: { card: "summary_large_image", title: southAfricaLandingConfig.seo.title, description: southAfricaLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] },
}

function PriceGroup({ title, plans, symbol, whatsapp }: { title: string; plans: Array<{ sessions: number; price: number }>; symbol: string; whatsapp: string }) {
  return (
    <section className="rounded-[2rem] border border-[#d8c9ae] bg-white p-6 shadow-sm sm:p-8">
      <h3 className="text-2xl font-black text-[#12372a]">{title}</h3>
      <p className="mt-3 leading-7 text-[#657269]">حصص فردية مدتها 30 دقيقة، باختيار شهري يناسب وقت الأسرة.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {plans.map((plan) => (
          <a key={plan.sessions} href={whatsapp} target="_blank" rel="noreferrer" className="group rounded-2xl border border-[#e5dac7] bg-[#fbf8f1] p-4 transition hover:border-[#a75d28] hover:bg-[#fffaf0]">
            <span className="flex items-center justify-between gap-3 text-sm text-[#657269]"><span>{plan.sessions} حصص شهريًا</span><span>{plan.sessions / 4} أسبوعيًا</span></span>
            <strong className="mt-3 block text-3xl font-black text-[#12372a]">{plan.price} {symbol}</strong>
            <span className="mt-2 flex items-center gap-2 text-sm font-bold text-[#a75d28]"><MessageCircle size={16} /> اسأل عن هذه الباقة</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default async function SouthAfricaPage() {
  const [areaData, videos] = await Promise.all([getAreaLandingData("south-africa"), getPublishedClassroomVideos()])
  const quranPlans = areaData.packages.map(toAreaDisplayPlan).filter((plan) => plan.program === "quran")
  const arabicPlans = areaData.packages.map(toAreaDisplayPlan).filter((plan) => plan.program === "arabic")
  const quranPrices = quranPlans.length >= 4 ? quranPlans.slice(0, 4).map((plan) => plan.price) : southAfricaLandingConfig.quranPrices
  const arabicPrices = arabicPlans.length >= 4 ? arabicPlans.slice(0, 4).map((plan) => plan.price) : southAfricaLandingConfig.arabicPrices
  const cities = areaData.cities.length ? areaData.cities.map((city) => city.name_ar) : southAfricaLandingConfig.cities
  const faq = areaData.faq.length ? areaData.faq.map((item) => [item.question_ar, item.answer_ar] as const) : southAfricaLandingConfig.faq
  const theme = areaData.theme ? { primary: areaData.theme.primary_color, accent: areaData.theme.accent_color, background: areaData.theme.background_color, surface: areaData.theme.secondary_color, ink: areaData.theme.text_color } : southAfricaLandingConfig.theme
  const baseContact = getAreaLinkHref(areaData.links, "whatsapp", getSouthAfricaWhatsAppUrl())
  const trialUrl = getAreaWhatsAppUrl(areaData.links, "حصة تجريبية مجانية", baseContact)
  const packageUrl = getAreaWhatsAppUrl(areaData.links, "الباقة المناسبة في جنوب أفريقيا", baseContact)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${canonical}#webpage`, url: canonical, name: southAfricaLandingConfig.seo.title, description: southAfricaLandingConfig.seo.description, inLanguage: "ar" },
      { "@type": "EducationalOrganization", "@id": `${canonical}#organization`, name: "أكاديمية الحافظ المتميز", url: "https://quran-elhafez.com/", areaServed: { "@type": "Country", name: "South Africa" } },
      { "@type": "Course", name: "تحفيظ القرآن أونلاين في جنوب أفريقيا", description: "حصص فردية لتحفيظ القرآن والحفظ والمراجعة عبر الإنترنت.", provider: { "@id": `${canonical}#organization` }, offers: quranPrices.map((price, index) => ({ "@type": "Offer", price, priceCurrency: "ZAR", category: `${[4, 8, 12, 16][index]} حصص شهريًا`, url: canonical })) },
      { "@type": "Course", name: "تأسيس العربية أونلاين في جنوب أفريقيا", description: "حصص فردية لتأسيس القراءة والكتابة والنطق والفهم بالعربية.", provider: { "@id": `${canonical}#organization` }, offers: arabicPrices.map((price, index) => ({ "@type": "Offer", price, priceCurrency: "ZAR", category: `${[4, 8, 12, 16][index]} حصص شهريًا`, url: canonical })) },
      { "@type": "FAQPage", mainEntity: faq.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) },
    ],
  }

  return (
    <main dir="rtl" className="min-h-screen overflow-hidden" style={{ "--sa-primary": theme.primary, "--sa-accent": theme.accent, "--sa-background": theme.background, "--sa-surface": theme.surface, "--sa-ink": theme.ink } as CSSProperties}>
      <header className="bg-[#251b2b] px-5 py-4 text-[#fff8ef] sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <span className="font-black tracking-wide">جنوب أفريقيا · مسار القرآن والعربية</span>
          <a href={trialUrl} target="_blank" rel="noreferrer" className="rounded-md border border-[#f09a67] px-4 py-2 text-sm font-black text-[#ffd7bd]">احجز الحصة التجريبية</a>
        </div>
      </header>

      <section aria-labelledby="south-africa-opening-title" className="bg-[#251b2b] px-5 pb-20 pt-14 text-[#fff8ef] sm:px-8 lg:pb-28 lg:pt-20">
        <div className="mx-auto max-w-6xl">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#f09a67]">مسار هادئ لأسبوع مزدحم</p>
            <h1 id="south-africa-opening-title" className="mt-6 max-w-4xl text-balance text-5xl font-black leading-[1.08] sm:text-7xl">وقتٌ ثابت للقرآن، وبدايةٌ واضحة للعربية.</h1>
            <p className="mt-7 max-w-2xl text-lg leading-9 text-[#eadbe5] sm:text-xl">صفحة جنوب أفريقيا مصممة حول قرار واحد: ما الوقت الذي تستطيع الأسرة المحافظة عليه؟ ابدأ من مدينتك، اختر هدفك، ثم اسأل عن المسار المناسب دون قوائم جاهزة أو قالب مكرر.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href={trialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[#f09a67] px-6 py-3 font-black text-[#251b2b]"><MessageCircle size={18} /> ابدأ بحصة تجريبية مجانية</a><a href="#plans" className="rounded-md border border-[#eadbe5] px-6 py-3 font-black text-[#fff8ef]">انتقل إلى الأسعار</a></div>
          </div>
          <div className="mt-12 flex flex-wrap gap-3 border-t border-[#ffffff2b] pt-6 text-sm font-bold text-[#eadbe5]">{cities.map((city) => <span key={city} className="rounded-full border border-[#f09a67] px-4 py-2">{city}</span>)}<span className="rounded-full bg-[#46344d] px-4 py-2">{southAfricaLandingConfig.timezone}</span></div>
        </div>
      </section>

      <section lang="af" className="bg-[#fff8ef] px-5 py-12 sm:px-8" aria-labelledby="south-africa-afrikaans-card-title">
        <div className="mx-auto max-w-5xl rounded-[1.75rem] border-l-4 border-[#f09a67] bg-[#f2e5ec] p-6 text-left text-[#251b2b] sm:p-9">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#8a4f39]">Suid-Afrika · Al-Hafiz Akademie</p>
          <h2 id="south-africa-afrikaans-card-title" className="mt-3 text-2xl font-black sm:text-3xl">Aanlyn Koran- en Arabiese klasse in Suid-Afrika</h2>
          <p className="mt-4 max-w-4xl leading-8 text-[#594a59]">Al-Hafiz Akademie bied individuele aanlynklasse vir Koranmemorisering, Koranlees en die grondslag van Arabies aan. Leerders in Johannesburg, Kaapstad, Durban en Pretoria kan navraag doen oor ’n 30-minuut-proefklas en maandelikse pakkette in Suid-Afrikaanse rand. Koranmemorisering en Arabiese onderrig vir Arabies-sprekende studente.</p>
          <p className="mt-4 max-w-4xl leading-8 text-[#594a59]">Stuur jou stad, huidige vlak en voorkeurprogram. Al-Hafiz Akademie verduidelik die volgende stap.</p>
        </div>
      </section>

      <SouthAfricaVideoMap videos={videos} />

      <section className="bg-white px-5 py-16 sm:px-8"><div className="mx-auto max-w-6xl"><div className="grid gap-5 md:grid-cols-2"><article className="rounded-[2rem] bg-[#12372a] p-7 text-white"><p className="text-sm font-bold text-[#f0b06f]">تحفيظ القرآن الكريم</p><h2 className="mt-3 text-3xl font-black">حفظ ومراجعة حسب نقطة البداية</h2><p className="mt-4 leading-8 text-white/80">برنامج فردي يساعد الطالب على بناء روتين للحفظ والمراجعة والقراءة بحسب مستواه ووقته. تُحدد التفاصيل التعليمية بعد التعارف والحصة التجريبية.</p><Link href="/quran" className="mt-6 inline-block font-black text-[#f0b06f]">تعرّف إلى برنامج القرآن ←</Link></article><article className="rounded-[2rem] bg-[#eadcc5] p-7 text-[#17251e]"><p className="text-sm font-bold text-[#a75d28]">تأسيس اللغة العربية</p><h2 className="mt-3 text-3xl font-black">ابنِ أساس القراءة والفهم</h2><p className="mt-4 leading-8 text-[#526057]">دروس عربية أونلاين للطالب الذي يريد بناء أساس أو تحسين القراءة والفهم تدريجيًا. يبدأ الاختيار من مستوى الطالب وهدفه.</p><Link href="/arabic" className="mt-6 inline-block font-black text-[#a75d28]">تعرّف إلى برنامج العربية ←</Link></article></div></div></section>

      <section className="bg-[#f7f1e5] px-5 py-16 sm:px-8"><div className="mx-auto max-w-6xl"><div className="flex items-start gap-3"><MapPin className="mt-1 text-[#a75d28]" /><div><p className="text-sm font-black text-[#a75d28]">الخدمة من أي مكان</p><h2 className="mt-2 text-3xl font-black text-[#17251e]">من جوهانسبرغ إلى كيب تاون</h2><p className="mt-4 max-w-3xl leading-8 text-[#526057]">إذا كنت في جوهانسبرغ أو كيب تاون أو ديربان أو بريتوريا، فالدراسة الأونلاين تمنحك فرصة اختيار موعد يناسب جدول الأسرة دون الحاجة إلى الانتقال إلى مركز تعليمي.</p><div className="mt-6 flex flex-wrap gap-2">{cities.map((city) => <span key={city} className="rounded-full border border-[#cdbb9d] bg-white px-4 py-2 text-sm font-bold text-[#17251e]">{city}</span>)}</div><p className="mt-5 flex items-center gap-2 text-sm font-bold text-[#657269]"><Clock3 size={16} /> المواعيد تُنسق حسب {areaData.timezones.find((timezone) => timezone.is_primary)?.label_ar || southAfricaLandingConfig.timezone}</p></div></div></div></section>

      <section id="plans" className="bg-white px-5 py-16 sm:px-8"><div className="mx-auto max-w-6xl"><div className="mx-auto max-w-3xl text-center"><p className="text-sm font-black text-[#a75d28]">الباقات والأسعار</p><h2 className="mt-3 text-4xl font-black text-[#17251e]">باقات شهرية واضحة بالراند الجنوب أفريقي</h2><p className="mt-4 leading-8 text-[#657269]">الأسعار مبنية على حصة أساسية مدتها 30 دقيقة. اختر العدد الذي يناسب روتينك، ثم تواصل معنا لتأكيد الموعد والتفاصيل.</p></div><div className="mt-10 grid gap-6 lg:grid-cols-2"><PriceGroup title="تحفيظ القرآن" symbol="راند" plans={quranPrices.map((price, index) => ({ price, sessions: [4, 8, 12, 16][index] }))} whatsapp={packageUrl} /><PriceGroup title="تأسيس العربية" symbol="راند" plans={arabicPrices.map((price, index) => ({ price, sessions: [4, 8, 12, 16][index] }))} whatsapp={packageUrl} /></div><div className="mx-auto mt-8 max-w-3xl rounded-2xl bg-[#eadcc5] p-5 text-center font-bold text-[#17251e]">يوجد باقات مخصصة. اسأل عن التفاصيل بعد الحصة التجريبية.</div></div></section>

      <section className="bg-[#12372a] px-5 py-16 text-white sm:px-8"><div className="mx-auto max-w-5xl"><h2 className="text-3xl font-black">أسئلة قبل البداية</h2><div className="mt-8 grid gap-3 sm:grid-cols-2">{faq.map(([question, answer]) => <details key={question} className="rounded-2xl border border-white/15 bg-white/5 p-5"><summary className="cursor-pointer font-black">{question}</summary><p className="mt-3 leading-7 text-white/75">{answer}</p></details>)}</div></div></section>

      <section className="bg-[#d8873d] px-5 py-16 text-center text-[#17251e] sm:px-8"><div className="mx-auto max-w-3xl"><h2 className="text-4xl font-black">ابدأ بخطوة تناسب أسبوعك</h2><p className="mt-4 leading-8">اكتب لنا مدينتك والبرنامج الذي تفكر فيه، وسنساعدك على معرفة الخطوة التالية قبل اختيار الباقة.</p><a href={trialUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#12372a] px-6 py-3 font-black text-white"><MessageCircle size={18} /> تواصل عبر واتساب</a></div></section>

      <footer className="border-t-4 border-[#f09a67] bg-[#251b2b] px-5 py-7 text-[#fff8ef] sm:px-8"><div className="mx-auto max-w-6xl"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><span className="text-sm font-black tracking-wide">مسار جنوب أفريقيا · {new Date().getFullYear()}</span><nav aria-label="روابط صفحة جنوب أفريقيا" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-[#eadbe5]"><Link href="/">الرئيسية</Link><Link href="/games">الألعاب والمسابقات</Link><Link href="/library">المكتبة</Link><Link href="/contact">التواصل</Link><Link href="/privacy">الخصوصية</Link><Link href="/terms">الشروط</Link></nav></div><details className="mt-6 border-t border-[#ffffff24] pt-5"><summary className="cursor-pointer text-sm font-black text-[#f09a67]">صفحاتنا حسب الدولة</summary><nav aria-label="كل صفحات الدول" className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">{countryPages.map((country) => <Link key={country.href} href={country.href} className="rounded-md border border-[#ffffff24] px-3 py-2 text-sm text-[#eadbe5] transition hover:border-[#f09a67] hover:text-[#ffd7bd]"><span className="me-2" aria-hidden="true">{country.flag}</span>{country.label}</Link>)}</nav></details></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}
