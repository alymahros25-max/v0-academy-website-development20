"use client"

import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react"
import type { PublicContent } from "@/lib/public-content"
import { localizedContent } from "@/lib/public-content"

export function HeroSection({ content = {} }: { content?: Record<string, PublicContent> }) {
  const { locale, dir } = useI18n()
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight
  const whatsappUrl = "https://wa.me/201130127894?text=" + encodeURIComponent("السلام عليكم، أرغب في حجز حصة تجريبية مجانية. البرنامج المطلوب: قرآن / لغة عربية / غير متأكد. عمر الطالب: ، المستوى الحالي: ، والوقت المناسب: ")

  return (
    <section className="relative min-h-[680px] overflow-hidden bg-warm-bg lg:min-h-[720px]">
      <picture className="absolute inset-0 block">
        <source media="(max-width: 767px)" srcSet="/images/hero-children-mobile.webp" />
        <Image
          src="/images/hero-children.webp"
          alt="أطفال يتعلمون القرآن أون لاين في حصة فردية"
          fill
          className="object-contain object-top md:object-cover md:object-[center_15%]"
          sizes="100vw"
          quality={40}
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </picture>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-background/65 via-background/15 to-background/80 md:bg-gradient-to-l md:from-transparent md:via-background/10 md:to-background/90" />

      <div className="relative z-10 mx-auto flex min-h-[680px] w-full max-w-7xl items-start px-4 pb-24 pt-28 lg:min-h-[720px] lg:items-center lg:pb-28 lg:pt-32">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(280px,0.65fr)] lg:gap-12">
          <div className="text-center lg:text-start">
            <div className="mx-auto inline-flex w-fit max-w-2xl flex-col items-center rounded-3xl border border-white/60 bg-background/[0.88] px-4 py-5 shadow-[0_18px_55px_rgba(16,42,67,0.16)] backdrop-blur-md lg:mx-0 lg:items-start lg:px-7 lg:py-6">
              <p className="mb-3 text-sm font-extrabold tracking-wide text-primary">أكاديمية أونلاين للناطقين بالعربية</p>
              <h1 className="max-w-xl text-3xl font-extrabold leading-[1.2] text-foreground text-balance md:text-4xl lg:text-5xl">
                {locale === "ar" ? "تحفيظ القرآن وتأسيس العربية أونلاين" : localizedContent(content.hero_title, locale, "Quran Memorization and Arabic Foundation Online")}
              </h1>
              <p className="mt-3 max-w-xl text-lg font-bold leading-relaxed text-foreground md:text-xl">
                <span className="block">{localizedContent(content.hero_subtitle, locale, "حصص فردية لتعليم القرآن الكريم والتجويد وتأسيس اللغة العربية")}</span>
                <span className="mt-1 block text-base font-semibold text-muted-foreground md:text-lg">{locale === "ar" ? "للأطفال والكبار والمبتدئين — بحصص فردية باللغة العربية" : locale === "en" ? "For children, adults, and beginners — taught one-to-one in Arabic" : "Pour les enfants, adultes et débutants — en cours individuels en arabe"}</span>
              </p>
            </div>

            <div className="mt-7 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-base font-extrabold text-[#073B1A] shadow-[0_10px_24px_rgba(37,211,102,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#1ebe5d] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/35">
                <MessageCircle className="size-5" aria-hidden="true" />
                {locale === "ar" ? "احجز حصتك التجريبية المجانية" : locale === "en" ? "Book your free trial lesson" : "Réserver votre cours d’essai gratuit"}
              </a>
              <Link href="#home-programs-title" className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-navy-primary/35 bg-background/90 px-6 py-3 text-base font-extrabold text-navy-primary shadow-sm transition-all hover:-translate-y-0.5 hover:bg-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25">
                {locale === "ar" ? "اختر البرنامج المناسب" : locale === "en" ? "Explore the programs" : "Découvrir les programmes"}
                <Arrow className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
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
