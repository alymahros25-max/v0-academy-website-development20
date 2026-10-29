import Link from "next/link"
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react"

function LocalizedText({ ar, en, fr }: { ar: string; en: string; fr: string }) {
  return (
    <>
      <span lang="ar" className="home-locale-ar">{ar}</span>
      <span lang="en" className="home-locale-en">{en}</span>
      <span lang="fr" className="home-locale-fr">{fr}</span>
    </>
  )
}

function DirectionArrow() {
  return (
    <>
      <ArrowLeft className="size-5 home-locale-ar" aria-hidden="true" />
      <ArrowRight className="size-5 home-locale-en home-locale-fr" aria-hidden="true" />
    </>
  )
}

export function CTASection() {
  const whatsappUrl = "https://wa.me/message/RCJSLAJQHAWHA1?text=" + encodeURIComponent("السلام عليكم، أرغب في حجز حصة تجريبية مجانية. البرنامج المطلوب: قرآن / لغة عربية / غير متأكد. عمر الطالب: ، المستوى الحالي: ، والوقت المناسب: ")

  return (
    <section className="content-auto relative overflow-hidden bg-primary py-16 lg:py-24" aria-labelledby="home-final-cta-title">
      <div className="islamic-pattern absolute inset-0 opacity-20" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <h2 id="home-final-cta-title" className="mb-5 text-3xl font-extrabold text-primary-foreground text-balance md:text-4xl lg:text-5xl">
          <LocalizedText ar="ابدأ رحلتك مع القرآن والعربية" en="Start your Quran and Arabic journey" fr="Commencez votre parcours coranique et arabe" />
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-primary-foreground/85 text-pretty">
          <LocalizedText ar="تعرّف على البرامج المناسبة للطالب واحجز حصتك التجريبية." en="Discuss the learner’s goal and level, choose a suitable program, and start with clear steps." fr="Échangez sur le niveau de l’élève, choisissez le programme adapté et commencez par des étapes claires." />
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-7 py-3.5 text-base font-extrabold text-[#073B1A] shadow-[0_10px_24px_rgba(37,211,102,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#1ebe5d] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/35 sm:w-auto">
            <MessageCircle className="size-5" aria-hidden="true" />
            <LocalizedText ar="احجز حصتك التجريبية المجانية" en="Book your free trial lesson" fr="Réserver votre cours d’essai gratuit" />
          </a>
          <Link href="/quran" className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-card px-7 py-3.5 text-base font-extrabold text-primary shadow-md transition-all hover:-translate-y-0.5 hover:bg-card/90 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 sm:w-auto">
            <LocalizedText ar="تفاصيل برنامج القرآن" en="Quran program details" fr="Détails du programme coranique" />
            <DirectionArrow />
          </Link>
          <Link href="/arabic" className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-primary-foreground/50 bg-transparent px-7 py-3.5 text-base font-extrabold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 sm:w-auto">
            <LocalizedText ar="تفاصيل برنامج العربية" en="Arabic program details" fr="Détails du programme arabe" />
            <DirectionArrow />
          </Link>
        </div>
      </div>
    </section>
  )
}
