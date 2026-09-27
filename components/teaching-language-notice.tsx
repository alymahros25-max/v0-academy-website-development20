"use client"

import { useI18n } from "@/lib/i18n"
import { Languages } from "lucide-react"

type Props = { variant?: "compact" | "full"; className?: string }

const copy = {
  ar: {
    title: "لغة التدريس: العربية فقط",
    compact: "الحصص مخصصة للطلاب الناطقين بالعربية. النسختان الإنجليزية والفرنسية من الموقع للتعريف بالخدمات فقط، ولا تعنيان توفر دروس بهاتين اللغتين.",
    full: "الحصص مخصصة للطلاب الناطقين بالعربية وتُقدَّم باللغة العربية. النسختان الإنجليزية والفرنسية من الموقع للتعريف بالخدمات فقط، ولا تعنيان توفر التدريس بهاتين اللغتين. يُرجى التأكد من قدرة الطالب على متابعة الدرس بالعربية قبل التسجيل.",
  },
  en: {
    title: "Language of instruction: Arabic only",
    compact: "Lessons are for Arabic-speaking students. The English and French versions of this website are for information only; lessons are not offered in those languages.",
    full: "Lessons are intended for Arabic-speaking students and are conducted in Arabic. The English and French versions of this website are provided for information only; they do not mean lessons are available in those languages. Please make sure the student can follow lessons in Arabic before enrolling.",
  },
  fr: {
    title: "Langue d’enseignement : arabe uniquement",
    compact: "Les cours s’adressent aux élèves arabophones. Les versions anglaise et française du site sont fournies à titre informatif ; les cours ne sont pas proposés dans ces langues.",
    full: "Les cours s’adressent aux élèves arabophones et se déroulent en arabe. Les versions anglaise et française du site sont fournies à titre informatif ; elles ne signifient pas que les cours sont proposés dans ces langues. Veuillez vous assurer que l’élève peut suivre les cours en arabe avant l’inscription.",
  },
} as const

export function TeachingLanguageNotice({ variant = "compact", className = "" }: Props) {
  const { locale } = useI18n()
  const text = copy[locale]
  return (
    <aside
      aria-label={text.title}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`rounded-xl border border-amber-300/80 bg-amber-50 px-4 py-3 text-start text-amber-950 shadow-sm ${className}`}
    >
      <p className="flex items-start gap-2 font-bold leading-6">
        <Languages className="mt-1 size-4 shrink-0" aria-hidden="true" />
        <span>{text.title}</span>
      </p>
      <p className={`mt-1 leading-6 text-amber-950/90 ${variant === "full" ? "text-sm" : "text-xs"}`}>
        {variant === "full" ? text.full : text.compact}
      </p>
    </aside>
  )
}
