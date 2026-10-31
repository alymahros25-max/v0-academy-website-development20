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
  const titleEnLines = titleEn.replace(/\s+online$/i, "").replace(/\s+(?:and|&)\s+/i, "\n")
  const titleFrLines = titleFr.replace(/\s+en ligne$/i, "").replace(/\s+et\s+/i, "\n")
  const subtitleArLines = subtitleAr.replace(/([،؛.!؟])\s*/gu, "$1\n")
  const whatsappUrl = "https://wa.me/message/RCJSLAJQHAWHA1?text=" + encodeURIComponent("السلام عليكم، أرغب في حجز حصة تجريبية مجانية. البرنامج المطلوب: قرآن / لغة عربية / غير متأكد. عمر الطالب: ، المستوى الحالي: ، والوقت المناسب: ")

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#102B49] lg:min-h-[760px] xl:min-h-[800px]">
      <picture className="absolute inset-0 hidden lg:block">
        <Image
          src="/images/hero-children.webp"
          alt="أطفال يتعلمون القرآن أون لاين في حصة فردية"
          fill
          className="object-cover object-center"
          sizes="100vw"
          quality={55}
          priority
          decoding="async"
        />
      </picture>
      <div aria-hidden="true" className="absolute inset-0 hidden lg:block bg-gradient-to-l from-[#102B49]/35 via-[#102B49]/12 to-transparent" />

      <div className="hero-mobile-layout lg:hidden">
        <div className="hero-mobile-children-image">
          <Image
            src="/images/hero-children-mobile.webp"
            alt="أطفال يتعلمون القرآن أون لاين في حصة فردية"
            fill
            sizes="100vw"
            quality={50}
            priority
            decoding="async"
            className="z-0 object-cover object-[center_55%]"
          />
          <div aria-hidden="true" className="hero-mobile-image-shade" />
          <div className="hero-mobile-teacher-photo">
            <Image
              src="/images/teacher-quran.webp"
              alt="معلم قرآن أون لاين في أكاديمية الحافظ المتميز"
              fill
              sizes="(max-width: 420px) 30vw, 128px"
              quality={65}
              loading="eager"
              decoding="async"
              className="object-cover"
            />
          </div>
          <div className="hero-mobile-title-overlay">
            <p className="mb-2 text-xs font-extrabold tracking-wide text-[#F2D58D]">
              <LocalizedText ar="أكاديمية أونلاين للناطقين بالعربية" en="Online academy for Arabic speakers" fr="Académie en ligne pour arabophones" />
            </p>
            <h1 className="whitespace-pre-line text-balance text-2xl font-extrabold leading-tight text-white">
              <LocalizedText ar={"تحفيظ القرآن\nتأسيس العربية"} en={titleEnLines} fr={titleFrLines} />
            </h1>
          </div>
        </div>
        <div className="hero-mobile-details">
          <p className="whitespace-pre-line">
            <LocalizedText ar={subtitleArLines} en={subtitleEn} fr={subtitleFr} />
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto hidden min-h-[100svh] w-full max-w-7xl items-start px-4 pb-16 pt-28 lg:flex lg:items-center lg:pb-24 lg:pt-32 xl:items-start xl:pb-8 xl:pt-24">
        <div className="relative flex w-full items-center justify-end">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center px-4 text-center lg:top-2 xl:top-4">
            <div dir="rtl" className="pointer-events-auto inline-flex w-fit max-w-[38rem] flex-col items-center rounded-[2rem] bg-[#102B49]/45 px-7 py-4 !text-center text-white shadow-[0_10px_35px_rgba(7,25,40,0.12)] backdrop-blur-[2px] lg:px-10 lg:py-5">
              <p className="mb-3 text-sm font-extrabold tracking-wide text-[#F2D58D] [text-shadow:0_2px_10px_rgba(0,0,0,0.85)]">
                <LocalizedText ar="أكاديمية أونلاين للناطقين بالعربية" en="Online academy for Arabic speakers" fr="Académie en ligne pour arabophones" />
              </p>
              <h1 className="max-w-xl whitespace-pre-line text-3xl font-extrabold leading-[1.3] text-white text-balance [text-shadow:0_2px_10px_rgba(0,0,0,0.7)] md:text-4xl lg:text-4xl xl:text-[2.5rem]">
                <LocalizedText ar={"تحفيظ القرآن\nتأسيس العربية"} en={titleEnLines} fr={titleFrLines} />
              </h1>
              <p className="mt-3 max-w-xl whitespace-pre-line text-base font-semibold leading-relaxed text-white/95 [text-shadow:0_1px_6px_rgba(0,0,0,0.65)] md:text-lg">
                <LocalizedText ar={subtitleArLines} en={subtitleEn} fr={subtitleFr} />
              </p>
            </div>
          </div>

          <div className="hidden justify-center lg:flex xl:flex-col xl:items-center">
            <div className="relative h-80 w-72 rotate-2 overflow-hidden rounded-3xl border-4 border-[#DDBB85] shadow-[0_24px_64px_rgba(7,25,40,0.4)] transition-transform duration-500 hover:rotate-0 xl:h-64 xl:w-64">
              <Image
                src="/images/teacher-quran.webp"
                alt="معلم قرآن أون لاين في أكاديمية الحافظ المتميز"
                fill
                sizes="(min-width: 1280px) 256px, 288px"
                quality={75}
                loading="lazy"
                className="object-cover"
              />
            </div>
            <div className="mt-3 hidden w-64 max-w-full flex-col gap-2 xl:flex">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-center text-base font-extrabold text-[#073B1A] shadow-[0_10px_24px_rgba(37,211,102,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#1ebe5d] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/35">
                <MessageCircle className="size-5" aria-hidden="true" />
                <LocalizedText ar="احجز حصتك التجريبية المجانية" en="Book your free trial lesson" fr="Réserver votre cours d’essai gratuit" />
              </a>
              <Link href="#home-programs-title" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/55 bg-[#102B49]/35 px-4 py-3 text-center text-base font-extrabold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#102B49]/65 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F2D58D]/50">
                <LocalizedText ar="اختر البرنامج المناسب" en="Explore the programs" fr="Découvrir les programmes" />
                <DirectionArrow />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-shared-actions">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-base font-extrabold text-[#073B1A] shadow-[0_10px_24px_rgba(37,211,102,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#1ebe5d] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/35 sm:w-auto">
          <MessageCircle className="size-5" aria-hidden="true" />
          <LocalizedText ar="احجز حصتك التجريبية المجانية" en="Book your free trial lesson" fr="Réserver votre cours d’essai gratuit" />
        </a>
        <Link href="#home-programs-title" className="group inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-white/55 bg-[#102B49]/35 px-6 py-3 text-base font-extrabold text-white transition-all hover:-translate-y-0.5 hover:bg-[#102B49]/65 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F2D58D]/50 sm:w-auto">
          <LocalizedText ar="اختر البرنامج المناسب" en="Explore the programs" fr="Découvrir les programmes" />
          <DirectionArrow />
        </Link>
      </div>
    </section>
  )
}
