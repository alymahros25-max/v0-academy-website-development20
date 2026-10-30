import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react"
import type { PublicContent } from "@/lib/public-content"
import { localizedContent } from "@/lib/public-content"

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
      <ArrowLeft className="size-4 home-locale-ar" aria-hidden="true" />
      <ArrowRight className="size-4 home-locale-en home-locale-fr" aria-hidden="true" />
    </>
  )
}

export function HeroSection({ content = {} }: { content?: Record<string, PublicContent> }) {
  const titleEn = localizedContent(content.hero_title, "en", "Quran Memorization and Arabic Foundation Online")
  const titleFr = localizedContent(content.hero_title, "fr", "Mémorisation du Coran et bases de l’arabe en ligne")
  const subtitleAr = localizedContent(content.hero_subtitle, "ar", "حصص فردية لتعليم القرآن الكريم والتجويد وتأسيس اللغة العربية")
  const subtitleEn = localizedContent(content.hero_subtitle, "en", "One-to-one lessons for Quran, Tajweed, and Arabic foundations")
  const subtitleFr = localizedContent(content.hero_subtitle, "fr", "Cours individuels de Coran, de tajwid et de bases de l’arabe")
  const whatsappUrl = "https://wa.me/message/RCJSLAJQHAWHA1?text=" + encodeURIComponent("السلام عليكم، أرغب في حجز حصة تجريبية مجانية. البرنامج المطلوب: قرآن / لغة عربية / غير متأكد. عمر الطالب: ، المستوى الحالي: ، والوقت المناسب: ")

  return (
    <section className="relative min-h-[640px] overflow-hidden bg-warm-bg sm:min-h-[680px] lg:min-h-[720px]">
      <picture className="absolute inset-0 hidden lg:block">
        <source media="(max-width: 767px)" srcSet="/images/hero-children-mobile.webp" />
        <Image
          src="/images/hero-children.webp"
          alt="أطفال يتعلمون القرآن أون لاين في حصة فردية"
          fill
          className="object-contain object-top md:object-cover md:object-[center_15%]"
          sizes="100vw"
          quality={40}
          priority
          decoding="async"
        />
      </picture>
      <div aria-hidden="true" className="absolute inset-0 hidden lg:block bg-gradient-to-b from-background/65 via-background/15 to-background/80 md:bg-gradient-to-l md:from-transparent md:via-background/10 md:to-background/90" />

      <div className="hero-mobile-layout lg:hidden">
        <div className="hero-mobile-title-card">
          <p className="mb-3 text-sm font-extrabold tracking-wide text-primary"><LocalizedText ar="أكاديمية أونلاين للناطقين بالعربية" en="Online academy for Arabic speakers" fr="Académie en ligne pour arabophones" /></p>
          <h1 className="text-3xl font-extrabold leading-[1.2] text-foreground text-balance"><LocalizedText ar="تحفيظ القرآن وتأسيس العربية أونلاين" en={titleEn} fr={titleFr} /></h1>
        </div>
        <div className="hero-mobile-children-image">
          <Image src="/images/hero-children-mobile.webp" alt="أطفال يتعلمون القرآن أون لاين في حصة فردية" fill sizes="100vw" quality={40} priority decoding="async" className="object-cover object-center" />
        </div>
        <div className="hero-mobile-info-strip" aria-label="مميزات الأكاديمية">
          <span className="hero-mobile-strip-message"><LocalizedText ar="حصص فردية للأطفال والكبار والمبتدئين" en="One-to-one lessons for children, adults, and beginners" fr="Cours individuels pour enfants, adultes et débutants" /></span>
          <span className="hero-mobile-strip-message"><LocalizedText ar="حفظ ومراجعة وتجويد وتأسيس العربية" en="Memorization, revision, Tajweed, and Arabic foundations" fr="Mémorisation, révision, tajwid et bases de l’arabe" /></span>
        </div>
        <div className="hero-mobile-actions">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-base font-extrabold text-[#073B1A] shadow-[0_10px_24px_rgba(37,211,102,0.28)] transition-all hover:bg-[#1ebe5d] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/35"><MessageCircle className="size-5" aria-hidden="true" /><LocalizedText ar="احجز حصتك التجريبية المجانية" en="Book your free trial lesson" fr="Réserver votre cours d’essai gratuit" /></a>
          <Link href="#home-programs-title" className="group inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-navy-primary/35 bg-background/90 px-6 py-3 text-base font-extrabold text-navy-primary shadow-sm transition-all hover:bg-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"><LocalizedText ar="اختر البرنامج المناسب" en="Explore the programs" fr="Découvrir les programmes" /><DirectionArrow /></Link>
        </div>
      </div>

      <div className="relative z-10 mx-auto hidden min-h-[640px] w-full max-w-7xl items-start px-4 pb-20 pt-28 sm:min-h-[680px] lg:min-h-[720px] lg:flex lg:items-center lg:pb-28 lg:pt-32">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(280px,0.65fr)] lg:gap-12">
          <div className="text-center lg:text-start">
            <div className="mx-auto inline-flex w-fit max-w-2xl flex-col items-center rounded-3xl border border-white/60 bg-background/[0.88] px-4 py-5 shadow-[0_18px_55px_rgba(16,42,67,0.16)] backdrop-blur-md lg:mx-0 lg:items-start lg:px-7 lg:py-6">
              <p className="mb-3 text-sm font-extrabold tracking-wide text-primary"><LocalizedText ar="أكاديمية أونلاين للناطقين بالعربية" en="Online academy for Arabic speakers" fr="Académie en ligne pour arabophones" /></p>
              <h1 className="max-w-xl text-3xl font-extrabold leading-[1.2] text-foreground text-balance md:text-4xl lg:text-5xl">
                <LocalizedText ar="تحفيظ القرآن وتأسيس العربية أونلاين" en={titleEn} fr={titleFr} />
              </h1>
              <p className="mt-3 max-w-xl text-lg font-bold leading-relaxed text-foreground md:text-xl">
                <LocalizedText ar={subtitleAr} en={subtitleEn} fr={subtitleFr} />
                <span className="mt-1 block text-base font-semibold text-muted-foreground md:text-lg"><LocalizedText ar="للأطفال والكبار والمبتدئين — بحصص فردية باللغة العربية" en="For children, adults, and beginners — taught one-to-one in Arabic" fr="Pour les enfants, adultes et débutants — en cours individuels en arabe" /></span>
              </p>
            </div>

            <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-base font-extrabold text-[#073B1A] shadow-[0_10px_24px_rgba(37,211,102,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#1ebe5d] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/35 sm:w-auto">
                <MessageCircle className="size-5" aria-hidden="true" />
                <LocalizedText ar="احجز حصتك التجريبية المجانية" en="Book your free trial lesson" fr="Réserver votre cours d’essai gratuit" />
              </a>
              <Link href="#home-programs-title" className="group inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-navy-primary/35 bg-background/90 px-6 py-3 text-base font-extrabold text-navy-primary shadow-sm transition-all hover:-translate-y-0.5 hover:bg-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 sm:w-auto">
                <LocalizedText ar="اختر البرنامج المناسب" en="Explore the programs" fr="Découvrir les programmes" />
                <DirectionArrow />
              </Link>
            </div>
          </div>

          <div className="hidden justify-center lg:flex">
            <div className="relative h-80 w-72 overflow-hidden rounded-3xl border-4 border-secondary/40 shadow-2xl rotate-2 transition-transform duration-500 hover:rotate-0 xl:h-96 xl:w-80">
              <Image
                src="/images/teacher-quran.webp"
                alt="معلم قرآن أون لاين في أكاديمية الحافظ المتميز"
                fill
                sizes="(min-width: 1280px) 320px, 288px"
                quality={75}
                loading="lazy"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  )
}
