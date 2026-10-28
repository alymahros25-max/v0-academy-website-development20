"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react"

export function CTASection() {
  const { locale, dir } = useI18n()
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight
  const whatsappUrl = "https://wa.me/201130127894?text=" + encodeURIComponent("السلام عليكم، أرغب في حجز حصة تجريبية مجانية. البرنامج المطلوب: قرآن / لغة عربية / غير متأكد. عمر الطالب: ، المستوى الحالي: ، والوقت المناسب: ")

  return (
    <section className="content-auto py-20 lg:py-28 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-20" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-6 text-balance">
          {locale === "ar"
            ? "ابدأ رحلتك مع القرآن والعربية"
            : locale === "en"
              ? "Start your Quran and Arabic journey"
              : "Commencez votre parcours coranique et arabe"}
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto text-pretty">
          {locale === "ar"
            ? "تعرّف على البرامج المناسبة للطالب واحجز حصتك التجريبية."
            : locale === "en"
              ? "Discuss the learner’s goal and level, choose a suitable program, and start with clear steps."
              : "Discutez de l’objectif et du niveau de l’élève, puis choisissez le programme adapté."}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-8 py-4 text-lg font-bold text-[#1f260d] shadow-md transition-all hover:-translate-y-0.5 hover:brightness-110"><MessageCircle className="size-5" />{locale === "ar" ? "احجز حصتك التجريبية المجانية" : "Book your free trial lesson"}</a>
<Link
            href="/quran"
            className="inline-flex items-center gap-2 rounded-xl bg-card px-8 py-4 text-lg font-bold text-primary shadow-md transition-all hover:bg-card/90 hover:shadow-xl hover:-translate-y-0.5"
          >
            {locale === "ar" ? "تفاصيل برنامج القرآن" : locale === "en" ? "Quran program details" : "Détails du programme coranique"}
            <Arrow className="w-5 h-5" />
          </Link>
          <Link
            href="/arabic"
            className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/50 bg-transparent px-8 py-4 text-lg font-bold text-primary-foreground shadow-md transition-all hover:bg-primary-foreground/10 hover:-translate-y-0.5"
          >
            {locale === "ar" ? "تفاصيل برنامج العربية" : locale === "en" ? "Arabic program details" : "Détails du programme arabe"}
            <Arrow className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </section>
  )
}
