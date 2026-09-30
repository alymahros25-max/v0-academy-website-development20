"use client"

import { useEffect, useState } from "react"
import { useI18n } from "@/lib/i18n"
import { Languages, X } from "lucide-react"

const copy = {
  en: {
    button: "Language of instruction information",
    title: "Lessons are taught in Arabic",
    body: "Lessons are delivered in Arabic only. The English and French versions of this website are translations to explain the services; classes are not taught in English or French. Please make sure the learner can follow lessons in Arabic.",
    close: "Close",
  },
  fr: {
    button: "Informations sur la langue d’enseignement",
    title: "Les cours sont dispensés en arabe",
    body: "Les cours sont dispensés uniquement en arabe. Les versions anglaise et française de ce site sont des traductions informatives ; les cours ne sont pas enseignés en anglais ni en français. Veuillez vous assurer que l’élève peut suivre les cours en arabe.",
    close: "Fermer",
  },
} as const

export function TeachingLanguageNotice() {
  const { locale } = useI18n()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [locale])

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [open])

  if (locale === "ar") return null
  const text = copy[locale]

  return (
    <div className="fixed right-3 top-1/2 z-[70] flex -translate-y-1/2 items-center gap-3" dir="ltr">
      <section
        id="teaching-language-info"
        role="region"
        aria-label={text.title}
        hidden={!open}
        className="w-[min(21rem,calc(100vw-5.5rem))] rounded-2xl border border-secondary/60 bg-card p-4 text-start text-card-foreground shadow-2xl ring-1 ring-primary/15"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-bold leading-6 text-primary">{text.title}</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={text.close}
            className="shrink-0 rounded-lg p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{text.body}</p>
      </section>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={text.button}
        aria-expanded={open}
        aria-controls="teaching-language-info"
        title={text.button}
        className="relative grid size-12 shrink-0 place-items-center rounded-full border border-secondary bg-primary text-primary-foreground shadow-[0_0_22px_rgba(201,162,39,0.55)] ring-2 ring-secondary/30 transition hover:scale-105 hover:shadow-[0_0_30px_rgba(201,162,39,0.75)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary motion-safe:animate-pulse"
      >
        <Languages className="size-5" aria-hidden="true" />
        <span className="absolute -bottom-1 -right-1 rounded-full bg-secondary px-1.5 py-0.5 text-[9px] font-extrabold leading-none text-secondary-foreground">
          AR
        </span>
      </button>
    </div>
  )
}
