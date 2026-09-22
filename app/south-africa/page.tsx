import type { Metadata } from "next"
import type { CSSProperties } from "react"
import Link from "next/link"
import { Check, Clock3, MapPin, MessageCircle, Sparkles } from "lucide-react"
import { getAreaLandingData, getAreaLinkHref, getAreaWhatsAppUrl, toAreaDisplayPlan } from "@/lib/country-content"
import { getPublishedClassroomVideos } from "@/lib/classroom-videos"
import { southAfricaLandingConfig, getSouthAfricaWhatsAppUrl } from "@/lib/south-africa-landing-config"
import { SouthAfricaVideoMap } from "./south-africa-video-map"

const canonical = southAfricaLandingConfig.seo.canonical

export const metadata: Metadata = {
  title: southAfricaLandingConfig.seo.title,
  description: southAfricaLandingConfig.seo.description,
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
      <header className="bg-[#12372a] px-5 py-4 text-white sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href="/" className="font-black">أكاديمية الحافظ المتميز</Link>
          <a href={trialUrl} target="_blank" rel="noreferrer" className="rounded-full bg-[#d8873d] px-4 py-2 text-sm font-black text-[#17251e]">احجز الحصة التجريبية</a>
        </div>
      </header>

      <section className="bg-[#f7f1e5] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-black text-[#a75d28]"><Sparkles size={16} /> Quran memorisation and Arabic foundations online for families in South Africa.</p>
            <h1 className="mt-6 text-balance text-4xl font-black leading-tight text-[#17251e] sm:text-6xl">رتّب وقت القرآن داخل أسبوعك في جنوب أفريقيا</h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-[#526057] sm:text-xl">بين الدراسة والعمل والأسرة، لا يحتاج التعلم إلى موعد مثالي بقدر ما يحتاج إلى وقت يمكن المحافظة عليه. اختر هدفك، تعرّف إلى الباقة المناسبة، ثم تحدث معنا لتحديد الخطوة التالية.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href={trialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#12372a] px-6 py-3 font-black text-white"><MessageCircle size={18} /> ابدأ بحصة تجريبية مجانية</a><a href="#plans" className="rounded-full border-2 border-[#12372a] px-6 py-3 font-black text-[#12372a]">اسأل عن الباقات بالراند</a></div>
          </div>
          <div className="rounded-[2.5rem] border border-[#d8c9ae] bg-[#eadcc5] p-6 sm:p-8">
            <p className="text-sm font-black text-[#a75d28]">ابدأ من أسبوعك</p><h2 className="mt-3 text-3xl font-black text-[#17251e]">خريطة بسيطة قبل اختيار السعر</h2>
            <div className="mt-8 grid gap-3">{["حدد وقتًا يمكن تكراره", "حدد نقطة البداية", "اختر البرنامج", "تحدث معنا"].map((item, index) => <div key={item} className="flex items-center gap-3 rounded-2xl bg-[#fbf8f1] p-4"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#d8873d] font-black text-[#17251e]">{index + 1}</span><span className="font-bold text-[#17251e]">{item}</span></div>)}</div>
          </div>
        </div>
      </section>

      <SouthAfricaVideoMap videos={videos} />

      <section className="bg-white px-5 py-16 sm:px-8"><div className="mx-auto max-w-6xl"><div className="grid gap-5 md:grid-cols-2"><article className="rounded-[2rem] bg-[#12372a] p-7 text-white"><p className="text-sm font-bold text-[#f0b06f]">تحفيظ القرآن الكريم</p><h2 className="mt-3 text-3xl font-black">حفظ ومراجعة حسب نقطة البداية</h2><p className="mt-4 leading-8 text-white/80">برنامج فردي يساعد الطالب على بناء روتين للحفظ والمراجعة والقراءة بحسب مستواه ووقته. تُحدد التفاصيل التعليمية بعد التعارف والحصة التجريبية.</p><Link href="/quran" className="mt-6 inline-block font-black text-[#f0b06f]">تعرّف إلى برنامج القرآن ←</Link></article><article className="rounded-[2rem] bg-[#eadcc5] p-7 text-[#17251e]"><p className="text-sm font-bold text-[#a75d28]">تأسيس اللغة العربية</p><h2 className="mt-3 text-3xl font-black">ابنِ أساس القراءة والفهم</h2><p className="mt-4 leading-8 text-[#526057]">دروس عربية أونلاين للطالب الذي يريد بناء أساس أو تحسين القراءة والفهم تدريجيًا. يبدأ الاختيار من مستوى الطالب وهدفه.</p><Link href="/arabic" className="mt-6 inline-block font-black text-[#a75d28]">تعرّف إلى برنامج العربية ←</Link></article></div></div></section>

      <section className="bg-[#f7f1e5] px-5 py-16 sm:px-8"><div className="mx-auto max-w-6xl"><div className="flex items-start gap-3"><MapPin className="mt-1 text-[#a75d28]" /><div><p className="text-sm font-black text-[#a75d28]">الخدمة من أي مكان</p><h2 className="mt-2 text-3xl font-black text-[#17251e]">من جوهانسبرغ إلى كيب تاون</h2><p className="mt-4 max-w-3xl leading-8 text-[#526057]">إذا كنت في جوهانسبرغ أو كيب تاون أو ديربان أو بريتوريا، فالدراسة الأونلاين تمنحك فرصة اختيار موعد يناسب جدول الأسرة دون الحاجة إلى الانتقال إلى مركز تعليمي.</p><div className="mt-6 flex flex-wrap gap-2">{cities.map((city) => <span key={city} className="rounded-full border border-[#cdbb9d] bg-white px-4 py-2 text-sm font-bold text-[#17251e]">{city}</span>)}</div><p className="mt-5 flex items-center gap-2 text-sm font-bold text-[#657269]"><Clock3 size={16} /> المواعيد تُنسق حسب {areaData.timezones.find((timezone) => timezone.is_primary)?.label_ar || southAfricaLandingConfig.timezone}</p></div></div></div></section>

      <section id="plans" className="bg-white px-5 py-16 sm:px-8"><div className="mx-auto max-w-6xl"><div className="mx-auto max-w-3xl text-center"><p className="text-sm font-black text-[#a75d28]">الباقات والأسعار</p><h2 className="mt-3 text-4xl font-black text-[#17251e]">باقات شهرية واضحة بالراند الجنوب أفريقي</h2><p className="mt-4 leading-8 text-[#657269]">الأسعار مبنية على حصة أساسية مدتها 30 دقيقة. اختر العدد الذي يناسب روتينك، ثم تواصل معنا لتأكيد الموعد والتفاصيل.</p></div><div className="mt-10 grid gap-6 lg:grid-cols-2"><PriceGroup title="تحفيظ القرآن" symbol="راند" plans={quranPrices.map((price, index) => ({ price, sessions: [4, 8, 12, 16][index] }))} whatsapp={packageUrl} /><PriceGroup title="تأسيس العربية" symbol="راند" plans={arabicPrices.map((price, index) => ({ price, sessions: [4, 8, 12, 16][index] }))} whatsapp={packageUrl} /></div><div className="mx-auto mt-8 max-w-3xl rounded-2xl bg-[#eadcc5] p-5 text-center font-bold text-[#17251e]">يوجد باقات مخصصة. اسأل عن التفاصيل بعد الحصة التجريبية.</div></div></section>

      <section className="bg-[#12372a] px-5 py-16 text-white sm:px-8"><div className="mx-auto max-w-5xl"><h2 className="text-3xl font-black">أسئلة قبل البداية</h2><div className="mt-8 grid gap-3 sm:grid-cols-2">{faq.map(([question, answer]) => <details key={question} className="rounded-2xl border border-white/15 bg-white/5 p-5"><summary className="cursor-pointer font-black">{question}</summary><p className="mt-3 leading-7 text-white/75">{answer}</p></details>)}</div></div></section>

      <section className="bg-[#d8873d] px-5 py-16 text-center text-[#17251e] sm:px-8"><div className="mx-auto max-w-3xl"><h2 className="text-4xl font-black">ابدأ بخطوة تناسب أسبوعك</h2><p className="mt-4 leading-8">اكتب لنا مدينتك والبرنامج الذي تفكر فيه، وسنساعدك على معرفة الخطوة التالية قبل اختيار الباقة.</p><a href={trialUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#12372a] px-6 py-3 font-black text-white"><MessageCircle size={18} /> تواصل عبر واتساب</a></div></section>

      <footer className="bg-[#17251e] px-5 py-10 text-white sm:px-8"><div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_auto]"><div><Link href="/" className="text-xl font-black">الحافظ · جنوب أفريقيا</Link><p className="mt-3 max-w-md leading-7 text-white/70">تحفيظ القرآن وتأسيس العربية أونلاين للعائلات في جنوب أفريقيا.</p></div><nav aria-label="روابط صفحة جنوب أفريقيا" className="grid content-start gap-3 text-sm font-bold text-white/85 sm:grid-cols-2"><Link href="/">الرئيسية</Link><Link href="/games">الألعاب والمسابقات</Link><Link href="/library">المكتبة</Link><Link href="/contact">التواصل</Link><Link href="/privacy">سياسة الخصوصية</Link><Link href="/terms">شروط الاستخدام</Link></nav></div><div className="mx-auto mt-8 max-w-6xl border-t border-white/10 pt-5 text-sm text-white/55">© {new Date().getFullYear()} أكاديمية الحافظ المتميز · صفحة جنوب أفريقيا</div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}
