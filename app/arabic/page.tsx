"use client"

import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import useSWR from "swr"
import { Check, PenTool, BookOpen, Lightbulb, GraduationCap, MessageCircle, Target, PencilLine, Languages } from "lucide-react"

const methodSteps = [
  {
    icon: BookOpen,
    title: { ar: "تعلم الحروف والحركات", en: "Letters & Vowels", fr: "Lettres et voyelles" },
    desc: { ar: "تعلم الحروف العربية وأشكالها والحركات بطرق تفاعلية ممتعة", en: "Learn Arabic letters, their forms and vowels through fun interactive methods", fr: "Apprenez les lettres arabes et les voyelles de maniere interactive" },
  },
  {
    icon: PenTool,
    title: { ar: "القراءة والكتابة", en: "Reading & Writing", fr: "Lecture et ecriture" },
    desc: { ar: "تعلم قراءة الكلمات والجمل والكتابة الصحيحة خطوة بخطوة", en: "Learn to read words and sentences and write correctly step by step", fr: "Apprenez a lire et ecrire correctement etape par etape" },
  },
  {
    icon: Lightbulb,
    title: { ar: "الإملاء والتعبير", en: "Dictation & Expression", fr: "Dictee et expression" },
    desc: { ar: "تطوير مهارات الإملاء والتعبير الكتابي والشفهي", en: "Developing dictation skills and written and oral expression", fr: "Developpement des competences en dictee et expression" },
  },
  {
    icon: GraduationCap,
    title: { ar: "التقييم والمتابعة", en: "Assessment & Follow-up", fr: "Evaluation et suivi" },
    desc: { ar: "متابعة دورية تساعد الأسرة على معرفة مستوى الطالب وما يحتاج إلى تدريب", en: "Periodic assessments and monthly reports for parents to track progress", fr: "Evaluations periodiques et rapports mensuels pour les parents" },
  },
]

const learnerPaths = [
  { icon: Target, title: "الطالب المبتدئ", desc: "يبدأ من الحروف والحركات والقراءة الأساسية بطريقة متدرجة." },
  { icon: BookOpen, title: "القراءة البطيئة", desc: "يتدرب على ربط الحروف والكلمات وتحسين الطلاقة والفهم." },
  { icon: PencilLine, title: "تقوية الكتابة والإملاء", desc: "يتدرب على كتابة الكلمات والجمل وتقليل الأخطاء الإملائية." },
  { icon: Languages, title: "الفهم والتعبير", desc: "يتدرب على تكوين الجمل ووصف المواقف والتعبير بصورة أوضح." },
]

const arabicFaqs = [
  ["هل البرنامج مناسب لمن يحتاج إلى تأسيس من البداية؟", "نعم، يبدأ البرنامج من المستوى الفعلي للطالب، ويمكن أن يبدأ من الحروف والحركات والقراءة الأساسية."],
  ["هل تركز الدروس على القراءة فقط؟", "يمكن أن تركز الخطة على القراءة أو الكتابة أو الإملاء أو الفهم والتعبير، أو تجمع بين أكثر من مهارة."],
  ["هل الدروس مناسبة للأطفال والكبار؟", "نعم، يتم اختيار طريقة الشرح والأمثلة والتدريبات حسب عمر الطالب ومستواه وهدفه."],
  ["هل الحصة فردية؟", "نعم، الحصة فردية مباشرة حتى يحصل الطالب على وقت كافٍ للتدريب وطرح الأسئلة وتصحيح الأخطاء."],
  ["هل يمكن اختيار Zoom أو Google Meet؟", "نعم، يمكن اختيار المنصة المناسبة عند التنسيق للحجز حسب تفضيل الطالب والموعد المتاح."],
] as const

type PublicPackage = {
  id?: string
  type: string
  sessions: number
  price: number
  popular?: boolean
}

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((res) => res.json())

export default function ArabicPage() {
  const { t, locale } = useI18n()
  const { data: storedPackages } = useSWR<PublicPackage[]>("/api/public/packages", fetcher, { revalidateOnFocus: true })
  const packages = (Array.isArray(storedPackages) && storedPackages.length > 0
    ? storedPackages
    : [
        { type: "arabic", sessions: 4, price: 20, popular: false },
        { type: "arabic", sessions: 8, price: 36, popular: true },
        { type: "arabic", sessions: 12, price: 54, popular: false },
      ]
  ).filter((pkg) => pkg.type === "arabic").sort((a, b) => a.sessions - b.sessions)

  const features = [
    t("pricing.features.flexibility"),
    t("pricing.features.reading"),
    t("pricing.features.certifiedTeachers"),
    t("pricing.features.supervision"),
  ]
  const whatsappUrl = `https://wa.me/201130127894?text=${encodeURIComponent("السلام عليكم، أرغب في حجز حصة تجريبية مجانية في برنامج تأسيس اللغة العربية. عمر الطالب: ، الدولة: ، المستوى الحالي: ، المهارة المطلوبة: قراءة/كتابة/إملاء/فهم/تعبير، والوقت المناسب: ")}`
  const packageWhatsappUrl = (sessions: number, price: number) => `https://wa.me/201130127894?text=${encodeURIComponent(`السلام عليكم، أرغب في معرفة تفاصيل باقة تأسيس اللغة العربية: ${sessions} حصص شهريًا بسعر ${price}$، وأرغب في حجز الحصة التجريبية أولاً. عمر الطالب: ، الدولة: ، المستوى الحالي: ، والوقت المناسب: `)}`
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: arabicFaqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-bold mb-4 border border-secondary/30">
                {t("nav.arabic")}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground mb-6 text-balance">
                {t("arabic.hero.title")}
              </h1>
              <p className="text-lg text-primary-foreground/80 leading-relaxed text-pretty">
                {t("arabic.hero.desc")}
              </p>
              <p className="mt-4 text-base font-semibold text-secondary">للأطفال والشباب والبالغين حسب المستوى والاحتياج، مع دروس مباشرة باللغة العربية.</p>
              <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold text-primary-foreground/85">
                <span className="rounded-full border border-primary-foreground/20 px-4 py-2">حصة فردية مباشرة</span>
                <span className="rounded-full border border-primary-foreground/20 px-4 py-2">قراءة وكتابة وإملاء</span>
                <span className="rounded-full border border-primary-foreground/20 px-4 py-2">Zoom أو Google Meet</span>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#12653D] px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#0B3D2E]"><MessageCircle className="size-5" aria-hidden="true" />احجز حصة تجريبية مجانية</a>
                <a href="#arabic-program" className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 px-6 py-3 font-bold text-primary-foreground transition hover:bg-primary-foreground/10">تعرّف على المهارات</a>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/arabic-learning.webp"
                  alt="Arabic learning class"
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

      {/* Method */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 text-balance">
              {t("arabic.method.title")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto text-pretty">
              {t("arabic.method.desc")}
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

      <section id="arabic-program" className="bg-navy-pale/20 px-4 py-16 lg:py-20" aria-labelledby="arabic-learners-title">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="saudi-eyebrow justify-center">خطة تبدأ من المستوى الفعلي</p>
            <h2 id="arabic-learners-title" className="mt-3 text-3xl font-extrabold text-navy-primary md:text-4xl">لمن يناسب برنامج العربية؟</h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">لا يحتاج جميع الطلاب إلى النوع نفسه من التدريب؛ نحدد الأولويات حسب العمر والمستوى والمهارة المطلوبة.</p>
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
          <div className="mt-8 text-center text-sm leading-7 text-muted-foreground">يمكن أن تركز الخطة على مهارة واحدة أو تجمع بين القراءة والكتابة والإملاء والفهم والتعبير حسب الاحتياج.</div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 lg:py-28 bg-muted/30 islamic-pattern">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
              {t("pricing.arabic.title")}
            </span>
            <p className="mx-auto mb-5 max-w-2xl text-lg leading-8 text-muted-foreground">هذه هي الباقات والأسعار العامة الحالية لبرنامج تأسيس اللغة العربية. اختر عدد الحصص المناسب، ثم تواصل معنا لتأكيد الموعد وطريقة الحصة.</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground text-balance">
              {locale === "ar" ? "اختر باقتك وابدأ التأسيس" : locale === "en" ? "Choose Your Package" : "Choisissez votre forfait"}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <div
                key={pkg.id ?? `${pkg.type}-${pkg.sessions}`}
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
                    <PenTool className={`w-8 h-8 ${pkg.popular ? "text-secondary" : "text-primary"}`} />
                  </div>
                  <p className={`font-bold text-lg mb-1 ${pkg.popular ? "text-primary-foreground" : "text-foreground"}`}>
                    {pkg.sessions} {pkg.sessions > 10 ? t("pricing.session") : t("pricing.sessions")}
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

                <Link
                  href={packageWhatsappUrl(pkg.sessions, pkg.price)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-3.5 rounded-xl font-bold text-center transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                    pkg.popular
                      ? "bg-secondary text-secondary-foreground hover:brightness-110"
                      : "bg-primary text-primary-foreground hover:brightness-110"
                  }`}
                >
                  {t("pricing.subscribe")}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-16 lg:py-20" aria-labelledby="arabic-faq-title">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="saudi-eyebrow justify-center">إجابات قبل البدء</p>
            <h2 id="arabic-faq-title" className="mt-3 text-3xl font-extrabold text-navy-primary md:text-4xl">أسئلة شائعة عن برنامج العربية</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {arabicFaqs.map(([question, answer]) => (
              <details key={question} className="group rounded-2xl border border-border bg-card p-5 shadow-sm">
                <summary className="cursor-pointer list-none pe-6 font-extrabold text-navy-primary marker:hidden [&::-webkit-details-marker]:hidden">{question}</summary>
                <p className="mt-3 leading-7 text-muted-foreground">{answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#12653D] px-6 py-3 font-bold text-white transition hover:bg-[#0B3D2E]"><MessageCircle className="size-5" aria-hidden="true" />اسأل عن البرنامج عبر WhatsApp</a>
            <Link href="/faq" className="inline-flex items-center font-bold text-navy-primary underline underline-offset-4">اقرأ جميع الأسئلة</Link>
          </div>
        </div>
      </section>

      <section className="bg-navy-pale/20 px-4 py-14" aria-label="روابط برنامج العربية">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-bold text-navy-primary">
          <Link href="/teachers" className="hover:underline">تعرّف على المعلمين والمعلمات</Link>
          <Link href="/teachers" className="hover:underline">تعرّف على المعلمين والمعلمات</Link>
          <Link href="/quran" className="hover:underline">هل تبحث عن برنامج القرآن؟</Link>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">تواصل عبر WhatsApp</a>
        </div>
      </section>
    </>
  )
}
