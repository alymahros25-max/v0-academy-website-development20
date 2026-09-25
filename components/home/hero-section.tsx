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
    <section className="relative min-h-screen overflow-hidden bg-warm-bg">
      <picture className="absolute inset-0 block">
        <source media="(max-width: 767px)" srcSet="/images/hero-children-mobile.webp" />
        <Image
          src="/images/hero-children.webp"
          alt="أطفال يتعلمون القرآن أون لاين في حصة فردية"
          fill
          className="object-cover object-[center_15%]"
          sizes="100vw"
          quality={40}
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </picture>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-8 pb-32 lg:pt-16 lg:pb-40 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Text Content */}
          <div className="text-center transition-transform lg:text-start">
            <div className="mx-auto inline-flex w-fit max-w-full flex-col items-center rounded-3xl bg-background/75 px-5 py-6 shadow-lg backdrop-blur-[2px] lg:mx-0 lg:items-start lg:px-8 lg:py-7">
              <h1 className="text-4xl font-extrabold leading-tight text-foreground text-balance md:text-5xl lg:text-6xl">
                {localizedContent(content.hero_title, locale, "تعلّم القرآن الكريم واللغة العربية أونلاين")}
              </h1>
              <p className="mt-3 text-2xl font-bold leading-relaxed text-foreground md:text-3xl">
                <span className="block">{localizedContent(content.hero_subtitle, locale, "حصص فردية لتعليم القرآن الكريم والتجويد وتأسيس اللغة العربية")}</span>
                <span className="block">للأطفال والكبار والمبتدئين</span>
                <span className="mt-1 block text-lg font-semibold text-muted-foreground md:text-xl">حصص فردية عبر الإنترنت</span>
              </p>
            </div>
          </div>

          {/* Decorative Card */}
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="relative w-80 h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-secondary/30 rotate-3 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="/images/teacher-quran.webp"
                  alt="معلم قرآن أون لاين في أكاديمية الحافظ المتميز"
                  fill
                  sizes="(min-width: 1024px) 320px, 0px"
                  quality={80}
                  loading="lazy"
                  className="object-cover"
                />
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-10 z-20 flex flex-col items-center justify-center gap-2 px-4 sm:flex-row sm:gap-8">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-7 py-3 text-base font-bold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90">
          <MessageCircle className="size-4" />
          {locale === "ar" ? "احجز حصتك التجريبية المجانية" : locale === "en" ? "Book your free trial lesson" : "Réserver votre cours d’essai gratuit"}
        </a>
        <Link
          href="/teachers"
          className="group inline-flex min-h-12 items-center gap-2 rounded-xl border border-navy-primary/30 bg-background/80 px-7 py-3 text-base font-bold text-navy-primary transition-all hover:-translate-y-0.5 hover:bg-background"
        >
          {locale === "ar" ? "تعرّف على المعلمين والمعلمات" : locale === "en" ? "Meet our teachers" : "Découvrir les programmes"}
          <Arrow className="size-4 transition-transform group-hover:-translate-x-1" />
        </Link>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  )
}
