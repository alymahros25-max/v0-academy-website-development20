import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Check, MessageCircle } from "lucide-react"
import { getSeoAlternates } from "@/lib/seo-metadata"
import KuwaitProgramSelector from "./kuwait-program-selector"
import { getKuwaitWhatsAppUrl, kuwaitFaqs, kuwaitLandingConfig } from "@/lib/kuwait-landing-config"

export const metadata: Metadata = {
  title: kuwaitLandingConfig.seo.title,
  description: kuwaitLandingConfig.seo.description,
  keywords: ["تحفيظ القرآن أونلاين الكويت", "تحفيظ القرآن في الكويت", "دروس قرآن أونلاين الكويت", "تأسيس اللغة العربية أونلاين الكويت"],
  alternates: getSeoAlternates(kuwaitLandingConfig.seo.canonical),
  openGraph: { title: kuwaitLandingConfig.seo.socialTitle, description: kuwaitLandingConfig.seo.socialDescription, url: kuwaitLandingConfig.seo.canonical, locale: "ar_KW", type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز لتحفيظ القرآن وتأسيس اللغة العربية أونلاين في الكويت" }] },
  twitter: { card: "summary_large_image", title: kuwaitLandingConfig.seo.socialTitle, description: kuwaitLandingConfig.seo.socialDescription, images: ["https://quran-elhafez.com/images/og-default.webp"] },
}

const whatsappUrl = getKuwaitWhatsAppUrl("طلب الحصة التجريبية المجانية")

export default function KuwaitPage() {
  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-white text-kw-ink">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-5 py-20 sm:px-8 lg:py-24 bg-gradient-to-br from-kw-bg via-white to-kw-surface">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 size-72 rounded-full bg-kw-gold/5 blur-3xl" />
          <div className="absolute bottom-20 left-20 size-80 rounded-full bg-kw-green/5 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl text-center">
          <div className="mb-8">
            <Image
              src="/logo.png"
              alt="شعار أكاديمية الحافظ المتميز"
              width={80}
              height={80}
              className="mx-auto rounded-2xl bg-gradient-to-br from-kw-green to-kw-gold p-2"
              priority
            />
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
              <MessageCircle className="size-5" />
              احجز الحصة التجريبية المجانية
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
          نوفر تجربة تعلم أونلاين للطلاب والعائلات في مدينة الكويت وحولي والفروانية والأحمدي ومبارك الكبير وغيرها من المناطق، مع تنسيق المواعيد حسب البرنامج والتوفر.
        </p>
      </section>

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

          <nav className="mb-8">
            <p className="text-xs font-semibold text-white/75 mb-3 uppercase tracking-wider">روابط مهمة</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
              <Link href="/quran" className="hover:text-kw-gold transition">تحفيظ القرآن</Link>
              <Link href="/arabic" className="hover:text-kw-gold transition">تأسيس العربية</Link>
              <Link href="/privacy" className="hover:text-kw-gold transition">الخصوصية</Link>
              <Link href="/terms" className="hover:text-kw-gold transition">الشروط</Link>
              <Link href="/refund-policy" className="hover:text-kw-gold transition">سياسة الاسترجاع</Link>
            </div>
          </nav>

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
