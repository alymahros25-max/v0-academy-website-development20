"use client"

import useSWR from "swr"
import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { Check, BookOpen, Star, Users, Clock, Shield, X, MessageCircle, Target, RefreshCw } from "lucide-react"

const methodSteps = [
  {
    icon: Users,
    title: { ar: "تقييم المستوى", en: "Level Assessment", fr: "Evaluation du niveau" },
    desc: { ar: "يتم تقييم مستوى الطالب في البداية لوضع خطة تعليمية مخصصة", en: "Student level is assessed first to create a personalized learning plan", fr: "Le niveau de l'etudiant est evalue pour creer un plan personnalise" },
  },
  {
    icon: BookOpen,
    title: { ar: "الحفظ المتقن", en: "Expert Memorization", fr: "Memorisation experte" },
    desc: { ar: "حفظ آيات القرآن الكريم بطريقة منهجية مع التكرار والمراجعة", en: "Memorizing Quran verses systematically with repetition and review", fr: "Memorisation systematique des versets coraniques" },
  },
  {
    icon: Star,
    title: { ar: "تعليم التجويد", en: "Tajweed Teaching", fr: "Enseignement du Tajweed" },
    desc: { ar: "تعلم أحكام التجويد وتطبيقها أثناء التلاوة مع معلم مجاز", en: "Learning Tajweed rules and applying them during recitation with a certified teacher", fr: "Apprentissage des regles de Tajweed avec un enseignant certifie" },
  },
  {
    icon: Shield,
    title: { ar: "المراجعة والتثبيت", en: "Review & Consolidation", fr: "Revision et consolidation" },
    desc: { ar: "مراجعة دورية لما تم حفظه لضمان التثبيت والإتقان", en: "Periodic review of memorized content to ensure consolidation", fr: "Revision periodique du contenu memorise" },
  },
]

const learnerPaths = [
  { icon: Target, title: "مبتدئ", desc: "يبدأ من المستوى المناسب له مع التدرج في التلاوة والحفظ." },
  { icon: BookOpen, title: "حفظ جديد", desc: "يتعلم مقدارًا مناسبًا مع التكرار والتسميع." },
  { icon: RefreshCw, title: "مراجعة وتثبيت", desc: "يضع خطة لمراجعة السور والأجزاء المحفوظة." },
  { icon: Star, title: "تلاوة وتجويد", desc: "يصحح القراءة ويتعلم الأحكام بالتطبيق." },
]

const quranFaqs = [
  ["هل الدروس فردية؟", "نعم، الدرس فردي مباشر مع معلم أو معلمة حتى يركز البرنامج على مستوى الطالب وهدفه."],
  ["هل البرنامج مناسب للمبتدئ؟", "نعم، يبدأ التقييم من مستوى الطالب الفعلي ثم تحدد نقطة البداية والخطة المناسبة."],
  ["هل يمكن الجمع بين الحفظ والتجويد؟", "نعم، يمكن الجمع بين الحفظ والتسميع وتصحيح التلاوة وأحكام التجويد بحسب احتياج الطالب."],
  ["هل الحصة عبر Zoom أم Google Meet؟", "يمكن اختيار Zoom أو Google Meet حسب تفضيل الطالب والتنسيق عند الحجز."],
  ["كيف أعرف الباقة والسعر المناسبين؟", "أرسل عمر الطالب ودولته وهدفه والوقت المناسب عبر WhatsApp، وسنوضح لك الباقات العامة والتفاصيل المتاحة."],
] as const

export default function QuranPageClient() {
  const { t, locale } = useI18n()

  const { data: livePackages } = useSWR<Array<{ id: string; type: string; name?: Record<string, string>; sessions: number; price: number; popular: boolean; active?: boolean }>>("/api/public/packages", (url: string) => fetch(url).then((res) => res.json()))
  const packages = (livePackages ?? []).filter((pkg) => pkg.type === "quran" && pkg.active !== false)

  const features = [
    t("pricing.features.flexibility"),
    t("pricing.features.certified"),
    t("pricing.features.supervision"),
    t("pricing.features.memorization"),
  ]
  const whatsappUrl = `https://wa.me/201130127894?text=${encodeURIComponent("السلام عليكم، أرغب في حجز حصة تجريبية مجانية في برنامج القرآن. عمر الطالب: ، الدولة: ، المستوى الحالي: ، الهدف: حفظ/مراجعة/تجويد، والوقت المناسب: ")}`
  const packageWhatsappUrl = (sessions: number, price: number) => `https://wa.me/201130127894?text=${encodeURIComponent(`السلام عليكم، أرغب في الاشتراك في باقة القرآن: ${sessions} حصص شهريًا بسعر ${price}$، وأرغب في معرفة خطوات البدء. عمر الطالب: ، الدولة: ، المستوى الحالي: ، والوقت المناسب: `)}`
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: quranFaqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-bold mb-4 border border-secondary/30">
                {t("nav.quran")}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground mb-6 text-balance">
                {t("quran.hero.title")}
              </h1>
              <p className="text-lg text-primary-foreground/80 leading-relaxed text-pretty">
                {t("quran.hero.desc")}
              </p>
              <p className="mt-4 text-base font-semibold text-secondary">دروس فردية مباشرة باللغة العربية للحفظ والمراجعة والتلاوة والتجويد.</p>
              <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold text-primary-foreground/85">
                <span className="rounded-full border border-primary-foreground/20 px-4 py-2">حصة فردية مباشرة</span>
                <span className="rounded-full border border-primary-foreground/20 px-4 py-2">شرح باللغة العربية</span>
                <span className="rounded-full border border-primary-foreground/20 px-4 py-2">Zoom أو Google Meet</span>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#12653D] px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#0B3D2E]"><MessageCircle className="size-5" aria-hidden="true" />احجز حصة تجريبية مجانية</a>
                <a href="#how-it-works" className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 px-6 py-3 font-bold text-primary-foreground transition hover:bg-primary-foreground/10">تعرّف على طريقة البدء</a>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/teacher-quran.webp"
                  alt="Quran teacher teaching students"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  quality={85}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                  priority={false}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 80L720 40L1440 80V80H0V80Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      <section className="bg-background px-4 py-16 lg:py-20" aria-labelledby="quran-paths-title">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="saudi-eyebrow justify-center">برنامج يناسب احتياج الطالب</p>
            <h2 id="quran-paths-title" className="mt-3 text-3xl font-extrabold text-navy-primary md:text-4xl">من أين يبدأ الطالب؟</h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">تختلف نقطة البداية حسب ما يعرفه الطالب وهدفه، لذلك لا نستخدم خطة واحدة للجميع.</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {learnerPaths.map(({ icon: Icon, title, desc }) => (
              <article key={title} className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-6" aria-hidden="true" /></div>
                <h3 className="mt-5 text-xl font-extrabold text-navy-primary">{title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-navy-pale/20 px-4 py-16 lg:py-20" aria-labelledby="quran-how-title">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="saudi-eyebrow justify-center">بداية واضحة</p>
            <h2 id="quran-how-title" className="mt-3 text-3xl font-extrabold text-navy-primary md:text-4xl">كيف نبدأ ونبني خطة القرآن؟</h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">نقيّم مستوى الطالب، نحدد هدفه، ثم نبني مسارًا يجمع بين الحفظ أو المراجعة والتلاوة والتجويد بحسب احتياجه، مع معلم مناسب.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {[["تواصل معنا", "أرسل عمر الطالب ومستواه وهدفه والوقت المناسب عبر WhatsApp."], ["نحدد الاحتياج", "نتعرف على الحفظ السابق وما يحتاجه الطالب في الحفظ أو المراجعة أو التجويد."], ["نختار المعلم المناسب", "نساعدك على اختيار معلم أو معلمة مناسبين، ويمكنك التعرف على الفريق من صفحة المعلمين."], ["ابدأ المتابعة", "نتفق على التفاصيل والباقات وطريقة الحصة، ثم يبدأ الدرس الفردي عبر Zoom أو Google Meet."]].map(([title, desc], index) => (
              <article key={title} className="rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-primary-foreground">{index + 1}</div>
                <h3 className="mt-5 text-xl font-extrabold text-navy-primary">{title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Method */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 text-balance">
              {t("quran.method.title")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto text-pretty">
              {t("quran.method.desc")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {methodSteps.map((step, idx) => (
              <div key={idx} className="relative bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg hover:border-primary/30 transition-all group">
                <div className="absolute -top-4 start-6 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <step.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{step.title[locale]}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc[locale]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <p className="mx-auto mb-5 max-w-2xl text-lg leading-8 text-muted-foreground">تعرف على الباقات العامة المتاحة لبرنامج تعليم القرآن، ثم تواصل معنا لتأكيد الموعد وطريقة الحصة والتفاصيل.</p>
            <Link href="/arabic" className="inline-flex items-center text-sm font-bold text-navy-primary underline underline-offset-4 transition-colors hover:text-navy-light">
              {locale === "ar" ? "مهتم بتأسيس اللغة العربية؟ ←" : locale === "en" ? "Interested in Arabic foundation? ←" : "Intéressé par la fondation arabe ? ←"}
            </Link>
          </div>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
              {t("pricing.quran.title")}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground text-balance">
              {locale === "ar" ? "اختر باقتك وابدأ الحفظ" : locale === "en" ? "Choose Your Package" : "Choisissez votre forfait"}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, idx) => (
              <div
                key={idx}
                className={`relative rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  pkg.popular
                    ? "bg-primary text-primary-foreground shadow-xl scale-105 border-2 border-secondary"
                    : "bg-card text-foreground shadow-lg border border-border"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-secondary text-secondary-foreground text-sm font-bold rounded-full shadow-lg">
                    {t("pricing.popular")}
                  </div>
                )}

                <div className="text-center mb-8 pt-2">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                    pkg.popular ? "bg-secondary/20" : "bg-primary/10"
                  }`}>
                    <BookOpen className={`w-8 h-8 ${pkg.popular ? "text-secondary" : "text-primary"}`} />
                  </div>
                  <p className={`font-bold text-lg mb-1 ${pkg.popular ? "text-primary-foreground" : "text-foreground"}`}>
                    {pkg.name?.[locale] || `${pkg.sessions} ${pkg.sessions > 10 ? t("pricing.session") : t("pricing.sessions")}`}
                  </p>
                  <div className="flex items-baseline justify-center gap-1 mb-1">
                    <span className="text-5xl font-extrabold">${pkg.price}</span>
                    <span className={`text-sm ${pkg.popular ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {t("pricing.month")}
                    </span>
                  </div>
                  <p className={`text-sm ${pkg.popular ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {t("pricing.duration")}
                  </p>
                </div>

                <div className={`h-px mb-6 ${pkg.popular ? "bg-primary-foreground/20" : "bg-border"}`} />

                <ul className="flex flex-col gap-3 mb-8">
                  {features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        pkg.popular ? "bg-secondary/20" : "bg-primary/10"
                      }`}>
                        <Check className={`w-3 h-3 ${pkg.popular ? "text-secondary" : "text-primary"}`} />
                      </div>
                      <span className={`text-sm leading-relaxed ${pkg.popular ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a href={packageWhatsappUrl(pkg.sessions, pkg.price)} target="_blank" rel="noopener noreferrer" className={`block w-full py-3.5 rounded-xl font-bold text-center transition-all hover:-translate-y-0.5 hover:shadow-lg ${pkg.popular ? "bg-secondary text-secondary-foreground hover:brightness-110" : "bg-primary text-primary-foreground hover:brightness-110"}`}>
                  ابدأ الاشتراك عبر WhatsApp
                </a>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/arabic" className="inline-flex items-center text-sm font-bold text-navy-primary underline underline-offset-4 transition-colors hover:text-navy-light">
              {locale === "ar" ? "مهتم بتأسيس اللغة العربية؟ ←" : locale === "en" ? "Interested in Arabic foundation? ←" : "Intéressé par la fondation arabe ? ←"}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-16 lg:py-20" aria-labelledby="quran-faq-title">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="saudi-eyebrow justify-center">إجابات قبل البدء</p>
            <h2 id="quran-faq-title" className="mt-3 text-3xl font-extrabold text-navy-primary md:text-4xl">أسئلة شائعة عن برنامج القرآن</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {quranFaqs.map(([question, answer]) => (
              <details key={question} className="group rounded-2xl border border-border bg-card p-5 shadow-sm">
                <summary className="cursor-pointer list-none pe-6 font-extrabold text-navy-primary marker:hidden [&::-webkit-details-marker]:hidden">{question}</summary>
                <p className="mt-3 leading-7 text-muted-foreground">{answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#12653D] px-6 py-3 font-bold text-white transition hover:bg-[#0B3D2E]"><MessageCircle className="size-5" aria-hidden="true" />اسأل عن الباقة المناسبة</a>
            <Link href="/faq" className="inline-flex items-center font-bold text-navy-primary underline underline-offset-4">اقرأ جميع الأسئلة</Link>
          </div>
        </div>
      </section>

    </>
  )
}
