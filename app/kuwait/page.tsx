import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Check, MessageCircle } from "lucide-react"
import { getSeoAlternates } from "@/lib/seo-metadata"
import KuwaitProgramSelector from "./kuwait-program-selector"
import { getKuwaitWhatsAppUrl, kuwaitFaqs, kuwaitLandingConfig } from "@/lib/kuwait-landing-config"
import { getAreaLandingData } from "@/lib/country-content"
import { getPublishedClassroomVideos } from "@/lib/classroom-videos"
import { NewCountryVideos } from "@/components/new-country-videos"
import { countryPages } from "@/components/layout/country-pages-section"

export const metadata: Metadata = {
  title: kuwaitLandingConfig.seo.title,
  description: kuwaitLandingConfig.seo.description,
  keywords: ["تحفيظ القرآن أونلاين الكويت", "تحفيظ القرآن في الكويت", "دروس قرآن أونلاين الكويت", "تأسيس اللغة العربية أونلاين الكويت"],
  alternates: getSeoAlternates(kuwaitLandingConfig.seo.canonical),
  openGraph: { title: kuwaitLandingConfig.seo.socialTitle, description: kuwaitLandingConfig.seo.socialDescription, url: kuwaitLandingConfig.seo.canonical, locale: "ar_KW", type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز لتحفيظ القرآن وتأسيس اللغة العربية أونلاين في الكويت" }] },
  twitter: { card: "summary_large_image", title: kuwaitLandingConfig.seo.socialTitle, description: kuwaitLandingConfig.seo.socialDescription, images: ["https://quran-elhafez.com/images/og-default.webp"] },
}

const whatsappUrl = getKuwaitWhatsAppUrl("طلب الحصة التجريبية المجانية")

const fallbackKuwaitAreas = ["مدينة الكويت", "حولي", "الفروانية", "مبارك الكبير", "الأحمدي"]

export default async function KuwaitPage() {
  const [{ cities }, videos] = await Promise.all([
    getAreaLandingData("kuwait"),
    getPublishedClassroomVideos(),
  ])
  const kuwaitAreas = cities.length ? cities.map((city) => city.name_ar) : fallbackKuwaitAreas

  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-white text-kw-ink">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-5 py-20 sm:px-8 lg:py-24 bg-gradient-to-br from-kw-bg via-white to-kw-surface">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 size-72 rounded-full bg-kw-gold/5 blur-3xl" />
          <div className="absolute bottom-20 left-20 size-80 rounded-full bg-kw-green/5 blur-3xl" />
        </div>

        <div className="relative z-10 grid max-w-5xl items-center gap-10 text-center lg:grid-cols-[1fr_auto] lg:text-right">
          <div>
            <div className="mb-8 lg:mb-6 inline-flex items-center gap-3 rounded-full border border-kw-green/15 bg-white/80 px-4 py-2 text-sm font-bold text-kw-green shadow-sm">
              <span className="kw-flag" aria-label="علم الكويت" role="img"><span /></span>
              برامج تعليمية أونلاين للعائلات في الكويت
            </div>
            <p className="font-bold tracking-widest text-kw-gold text-sm sm:text-base uppercase">في الكويت</p>

          <h1 className="mt-6 text-balance text-4xl sm:text-5xl lg:text-7xl font-black leading-tight text-kw-green">
            اختر برنامجك، وابدأ طريقك مع القرآن والعربية
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl leading-relaxed text-kw-muted">
            حصص فردية أونلاين للناطقين بالعربية، صممت لتساعد الطالب على التعلم بخطة واضحة ووقت يناسب الأسرة.
          </p>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-kw-muted">
            تحفيظ القرآن أو تأسيس اللغة العربية — اختر المسار الذي يناسبك.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row flex-wrap justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-kw-green to-kw-green-dark px-8 py-3 font-bold text-white transition hover:shadow-lg hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kw-gold focus-visible:ring-offset-2"
            >
              <MessageCircle className="size-5" aria-hidden="true" />
              واتساب — احجز الحصة التجريبية المجانية
            </a>
            <a
              href="#programs"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-kw-green px-8 py-3 font-bold text-kw-green transition hover:bg-kw-green hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kw-gold focus-visible:ring-offset-2"
            >
              اختر برنامجك
            </a>
          </div>

            <p className="mt-12 text-sm font-semibold text-kw-gold">كن حافظًا، كن متميزًا</p>
          </div>
          <div className="hidden lg:flex size-64 items-center justify-center rounded-[2.5rem] border border-kw-gold/35 bg-white/75 p-6 shadow-[0_18px_50px_rgb(15_93_60/0.12)] rotate-3">
            <div className="relative flex size-full items-center justify-center rounded-[1.75rem] border border-kw-green/10 bg-kw-surface">
              <span className="kw-flag kw-flag-large" aria-label="علم الكويت" role="img"><span /></span>
              <span className="absolute bottom-5 rounded-full bg-kw-green px-4 py-2 text-xs font-bold text-white">الكويت</span>
            </div>
          </div>
        </div>
      </section>

      {/* Program Selector */}
      <KuwaitProgramSelector />

      {/* Benefits Section */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-kw-green">ماذا يتضمن البرنامج؟</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            "حصة فردية تناسب مستوى الطالب.",
            "أهداف واضحة لكل مرحلة من التعلم.",
            "تواصل مباشر عبر الإنترنت.",
            "اختيار البرنامج قبل عرض الباقات.",
            "مواعيد تُنسق حسب البرنامج والتوفر.",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-kw-line bg-white p-5 text-center hover:shadow-md transition">
              <Check className="mx-auto size-5 text-kw-gold" />
              <p className="mt-3 text-sm font-semibold leading-6 text-kw-ink">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Discounts Section */}
      <section className="border-y border-kw-line bg-white px-5 py-10 text-center sm:px-8">
        <p className="text-lg font-bold text-kw-green">خصم 10٪ للأخوات والإحالة</p>
        <p className="mt-3 font-semibold text-kw-gold">يوجد باقات مخصصة</p>
      </section>

      {/* Call to Action */}
      <section className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 lg:py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-kw-green">ابدأ بالخطوة الأولى</h2>
        <p className="mt-4 text-lg leading-8 text-kw-muted">
          اختر البرنامج المناسب ثم تواصل معنا لحجز الحصة التجريبية المجانية.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-kw-green to-kw-green-dark px-8 py-3 font-bold text-white transition hover:shadow-lg hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kw-gold focus-visible:ring-offset-2"
        >
          <MessageCircle className="size-5" />
          احجز الحصة التجريبية المجانية
        </a>
      </section>

      {/* FAQ Section */}
      <section className="bg-kw-surface px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl sm:text-4xl font-bold text-kw-green mb-12">الأسئلة الشائعة</h2>
          <div className="grid gap-3">
            {kuwaitFaqs.map(([question, answer]) => (
              <details
                key={question}
                className="rounded-xl border border-kw-line bg-white p-5 hover:shadow-md transition"
              >
                <summary className="cursor-pointer font-bold text-kw-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kw-gold">
                  {question}
                </summary>
                <p className="mt-4 leading-8 text-kw-muted">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Local Coverage Section */}
      <section className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 lg:py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-kw-green">حصص أونلاين للعائلات في مختلف مناطق الكويت</h2>
        <p className="mt-6 leading-8 text-kw-muted">
          نوفر تجربة تعلم أونلاين للطلاب والعائلات في المناطق التالية، مع تنسيق المواعيد حسب البرنامج والوقت المناسب للأسرة.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3" aria-label="مناطق الخدمة في الكويت">
          {kuwaitAreas.map((area) => <span key={area} className="rounded-full border border-kw-line bg-kw-surface px-4 py-2 text-sm font-bold text-kw-green">{area}</span>)}
        </div>
      </section>

      <NewCountryVideos videos={videos} />

      {/* Minimal Footer */}
      <footer className="bg-kw-green px-5 py-10 text-white sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="border-b border-white/20 pb-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/logo.png"
                alt="شعار أكاديمية الحافظ المتميز"
                width={44}
                height={44}
                className="rounded-lg bg-kw-gold p-1"
              />
              <div>
                <p className="font-bold text-lg">أكاديمية الحافظ المتميز</p>
                <p className="text-sm text-white/75">برامج القرآن والعربية أونلاين</p>
              </div>
            </div>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <nav>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/75">روابط مهمة</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
                <Link href="/quran" className="transition hover:text-kw-gold">تحفيظ القرآن</Link>
                <Link href="/arabic" className="transition hover:text-kw-gold">تأسيس العربية</Link>
                <Link href="/privacy" className="transition hover:text-kw-gold">الخصوصية</Link>
                <Link href="/terms" className="transition hover:text-kw-gold">الشروط</Link>
                <Link href="/refund-policy" className="transition hover:text-kw-gold">سياسة الاسترجاع</Link>
              </div>
            </nav>
            <details className="group rounded-xl border border-white/15 bg-white/5 p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-white [&::-webkit-details-marker]:hidden">
                روابط حسب الدولة
                <span aria-hidden="true" className="transition-transform group-open:rotate-180">⌄</span>
              </summary>
              <div className="mt-4 grid gap-2 text-sm text-white/80 sm:grid-cols-2">
                {countryPages.map((country) => <Link key={country.href} href={country.href} className="transition hover:text-kw-gold"><span className="me-1" aria-hidden="true">{country.flag}</span>{country.label.replace("تحفيظ القرآن والعربية في ", "")}</Link>)}
              </div>
            </details>
          </div>

          <div className="border-t border-white/20 pt-6 text-center text-xs text-white/70">
            <p>© 2026 أكاديمية الحافظ المتميز. جميع الحقوق محفوظة.</p>
            <p className="mt-2">صفحة متخصصة لطلاب الكويت</p>
          </div>
        </div>
      </footer>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: kuwaitFaqs.map(([name, text]) => ({
              "@type": "Question",
              name,
              acceptedAnswer: { "@type": "Answer", text },
            })),
          }),
        }}
      />
    </main>
  )
}
