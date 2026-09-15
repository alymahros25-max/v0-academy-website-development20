'use client'

import { useEffect, useMemo, useState } from "react"
import { useI18n } from "@/lib/i18n"
import Image from "next/image"
import { Award, Check, MessageCircle, Star, BookOpen, Languages, ClipboardCheck } from "lucide-react"
import teachers from "@/data/teachers.json"

type Teacher = (typeof teachers)[number]
type Filter = "all" | "quran" | "arabic" | "kids" | "male" | "female" | "ijazah"

const filters: { key: Filter; ar: string; en: string }[] = [
  { key: "all", ar: "الكل", en: "All Tutors" },
  { key: "quran", ar: "القرآن والقراءات", en: "Quran & Recitations" },
  { key: "arabic", ar: "اللغة العربية والتأسيس", en: "Arabic Foundation" },
  { key: "kids", ar: "للأطفال والتأسيس", en: "Kids & Beginners" },
  { key: "male", ar: "معلمين", en: "Male Tutors" },
  { key: "female", ar: "معلمات", en: "Female Tutors" },
  { key: "ijazah", ar: "الإجازات والقراءات", en: "Ijazah & Recitations" },
]

const whatsappUrl = (teacher: Teacher, locale: string) => {
  const name = teacher.name.ar
  const isArabicTeacher = teacherPrograms(teacher).includes("arabic")
  const message = locale === "ar"
    ? isArabicTeacher
      ? `السلام عليكم، أرغب في حجز حصة تجريبية مجانية في تأسيس اللغة العربية مع ${name}.\n\nعمر الطالب:\nالمستوى الحالي:\nالمهارة المطلوبة: قراءة / كتابة / إملاء / فهم / تعبير\nالوقت المناسب:`
      : `السلام عليكم، أرغب في حجز حصة تجريبية مجانية في برنامج القرآن مع ${name}.\n\nعمر الطالب:\nالمستوى الحالي:\nالهدف: حفظ / مراجعة / تلاوة / تجويد\nالوقت المناسب:`
    : isArabicTeacher
      ? `Hello, I would like to book a free trial Arabic foundation class with ${teacher.name.en}.`
      : `Hello, I would like to book a free trial Quran class with ${teacher.name.en}.`
  return `https://wa.me/201130127894?text=${encodeURIComponent(message)}`
}

const generalWhatsappUrl = "https://wa.me/201130127894?text=" + encodeURIComponent("السلام عليكم، أحتاج إلى مساعدة في اختيار المعلم أو المعلمة المناسبين.\n\nعمر الطالب:\nالبرنامج المطلوب: قرآن / لغة عربية / غير متأكد\nالمستوى الحالي:\nالوقت المناسب:")

const teacherPrograms = (teacher: Teacher) => {
  const specialty = `${teacher.role.ar} ${teacher.specialty.ar}`
  const programs: string[] = []
  if (/العربية|القراءة|الكتابة|اللغوي/.test(specialty)) programs.push("arabic")
  if (/القرآن|قرآن|التجويد|القراءات|حفص|الحفظ|التلاوة/.test(specialty)) programs.push("quran")
  return programs.length ? programs : ["quran"]
}

function TeacherSchema({ teacher }: { teacher: Teacher }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: teacher.name.ar,
    jobTitle: teacher.role.ar,
    description: teacher.bio.ar,
    knowsLanguage: ["ar", ...(teacher.english ? ["en"] : [])],
    areaServed: ["Saudi Arabia", "United Arab Emirates", "Kuwait", "Qatar", "Jordan", "United States", "United Kingdom", "Canada", "Europe"],
    hasCredential: teacher.ijazah ? { "@type": "EducationalOccupationalCredential", credentialCategory: teacher.role.ar, recognizedBy: { "@type": "Organization", name: "أكاديمية الحافظ المتميز" } } : undefined,
    worksFor: { "@type": "EducationalOrganization", name: "أكاديمية الحافظ المتميز" },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

function TeacherCard({ teacher, index, locale }: { teacher: Teacher; index: number; locale: string }) {
  const isFemale = teacher.gender === "female"
  return (
    <article className={`relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${index % 2 ? "border-primary/20" : "border-border"}`}>
      <TeacherSchema teacher={teacher} />
      <div className={`absolute inset-x-0 top-0 h-1 ${index % 3 === 0 ? "bg-primary" : "bg-[#d4af37]"}`} />
      <div className="mb-5 flex items-start gap-4">
        <div className={`relative size-16 shrink-0 overflow-hidden rounded-2xl ${isFemale ? "bg-[#d4af37]/15" : "bg-primary/10"}`}>
          <Image src={teacher.image} alt={`صورة رمزية لـ ${teacher.name.ar}`} fill sizes="64px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-foreground">{locale === "ar" ? teacher.name.ar : teacher.name.en}</h2>
          <p className="mt-1 text-sm font-medium text-primary">{locale === "ar" ? teacher.role.ar : teacher.role.en}</p>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary"><Award className="size-3" />{teacher.ijazah ? "مجاز بالسند المتصل" : "معلم قرآن كريم"}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">{teacher.specialty.ar}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#d4af37]/15 px-3 py-1 text-xs font-bold text-[#806510]"><Check className="size-3" />يقدم حصة تجريبية مجانية</span>
      </div>
      <p className="min-h-28 text-sm leading-7 text-muted-foreground">{locale === "ar" ? teacher.bio.ar : teacher.bio.en}</p>
      <div className="mt-4 grid gap-2 rounded-2xl bg-muted/50 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">مميزات المعلم</p>
        <ul className="grid gap-2 text-sm leading-6 text-foreground">
          {teacher.highlights.map((highlight) => <li key={highlight} className="flex items-start gap-2"><Check className="mt-1 size-4 shrink-0 text-primary" />{highlight}</li>)}
        </ul>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <div>
          <p className="text-xs text-muted-foreground">الخبرة</p>
          <p className="font-bold text-foreground">+{teacher.experience} سنوات</p>
        </div>
        <div className="text-end">
          <div className="flex items-center gap-1 text-[#d4af37]" aria-label="5 out of 5 stars">{[1,2,3,4,5].map((star) => <Star key={star} className="size-4 fill-current" />)}</div>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">5/5 تقييم حقيقي</p>
        </div>
      </div>
      <a href={whatsappUrl(teacher, locale)} target="_blank" rel="noreferrer" className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">
        <MessageCircle className="size-4" />
        {locale === "ar" ? `احجز حصة تجريبية مجانية مع ${teacher.name.ar}` : `Book a free trial with ${teacher.name.en}`}
      </a>
    </article>
  )
}

export default function TeachersPage() {
  const { t, locale } = useI18n()
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || ""
  const [filter, setFilter] = useState<Filter>("all")
  const [liveTeachers, setLiveTeachers] = useState<Teacher[]>(teachers)

  useEffect(() => {
    let cancelled = false
    fetch("/api/public/teachers", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Teacher data unavailable")))
      .then((data: Teacher[]) => { if (!cancelled && Array.isArray(data) && data.length) setLiveTeachers(data) })
      .catch(() => undefined)
    return () => { cancelled = true }
  }, [])

  const filteredTeachers = useMemo(() => liveTeachers.filter((teacher) => filter === "all" || (filter === "quran" && teacherPrograms(teacher).includes("quran")) || (filter === "arabic" && teacherPrograms(teacher).includes("arabic")) || (filter === "kids" && teacher.kids) || (filter === "male" && teacher.gender === "male") || (filter === "female" && teacher.gender === "female") || (filter === "ijazah" && teacher.ijazah)), [filter, liveTeachers])
  return (
    <>
      <section className="relative overflow-hidden bg-primary pb-20 pt-32 lg:pb-28 lg:pt-40">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <span className="mb-4 inline-block rounded-full border border-[#d4af37]/40 bg-[#d4af37]/15 px-4 py-1.5 text-sm font-bold text-[#f1d978]">{t("nav.teachers")}</span>
          <h1 className="text-balance text-4xl font-extrabold text-primary-foreground md:text-5xl">{locale === "ar" ? "معلمو ومعلمات القرآن واللغة العربية أونلاين" : "Online Quran and Arabic Teachers"}</h1>
          <p className="mx-auto mt-5 max-w-3xl text-pretty text-lg leading-8 text-primary-foreground/80">تعرّف على فريق المعلمين والمعلمات، واختر من يناسب عمر الطالب ومستواه وهدفه في تعليم القرآن أو تأسيس اللغة العربية، مع حصة تجريبية مجانية قبل بدء البرنامج.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={generalWhatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-6 py-3 font-bold text-[#1f260d] transition hover:brightness-110"><MessageCircle className="size-5" />احجز حصة تجريبية مجانية</a>
            <a href="#teachers-list" className="inline-flex items-center rounded-xl border border-primary-foreground/30 px-6 py-3 font-bold text-primary-foreground transition hover:bg-primary-foreground/10">استعرض المعلمين</a>
          </div>
        </div>
      </section>
      <section id="teachers-list" className="bg-background py-10 lg:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-foreground md:text-4xl">اختر المعلم أو المعلمة المناسبين</h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">استخدم الفلاتر للتعرف على التخصص والخبرة، ثم اقرأ بيانات المعلم واحجز الحصة التجريبية المجانية.</p>
          </div>
          <div className="mb-10 flex flex-wrap justify-center gap-3" role="tablist" aria-label="Teacher filters">
            {filters.map((item) => <button key={item.key} type="button" role="tab" aria-selected={filter === item.key} onClick={() => setFilter(item.key)} className={`rounded-full border px-4 py-2.5 text-sm font-bold transition-colors ${filter === item.key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"}`}>{locale === "ar" ? item.ar : item.en}</button>)}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filteredTeachers.map((teacher, index) => <TeacherCard key={teacher.id} teacher={teacher} index={index} locale={locale} />)}</div>
          {filteredTeachers.length === 0 && <p className="py-12 text-center text-muted-foreground">لا توجد نتائج مطابقة لهذا الاختيار.</p>}
        </div>
      </section>
      <section className="bg-muted/30 py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-3xl text-center"><h2 className="text-3xl font-extrabold text-foreground md:text-4xl">كيف نساعدك على اختيار المعلم؟</h2><p className="mt-4 text-lg leading-8 text-muted-foreground">نبدأ من احتياج الطالب، ثم نساعدك على الوصول إلى الخيار الأقرب إلى هدفه.</p></div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[{ icon: ClipboardCheck, title: "أرسل بيانات الطالب", text: "العمر والمستوى والبرنامج المطلوب والوقت المناسب." }, { icon: BookOpen, title: "نحدد الاحتياج", text: "نراجع الهدف والمهارة التي تحتاج إلى متابعة، قرآن أم لغة عربية." }, { icon: Languages, title: "جرّب قبل البدء", text: "احجز حصة تجريبية مجانية وتعرّف على طريقة الشرح قبل اختيار الباقة." }].map(({ icon: Icon, title, text }, index) => <article key={title} className="rounded-3xl border border-border bg-card p-6 text-center shadow-sm"><div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-6" /></div><p className="mt-3 text-xs font-bold text-primary">الخطوة {index + 1}</p><h3 className="mt-2 text-xl font-extrabold text-foreground">{title}</h3><p className="mt-3 leading-7 text-muted-foreground">{text}</p></article>)}
          </div>
        </div>
      </section>
      <section className="bg-background py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4"><div className="mx-auto max-w-3xl text-center"><h2 className="text-3xl font-extrabold text-foreground md:text-4xl">اختر البرنامج الذي يناسب هدف الطالب</h2></div><div className="mt-10 grid gap-6 md:grid-cols-2">
          <a href="/quran" className="group rounded-3xl border border-border bg-card p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><BookOpen className="size-6" /></div><h3 className="mt-5 text-2xl font-extrabold text-foreground">تعليم القرآن الكريم</h3><p className="mt-3 leading-7 text-muted-foreground">للحفظ والمراجعة والتلاوة والتجويد، مع خطة تناسب مستوى الطالب وهدفه.</p><span className="mt-5 inline-block font-bold text-primary group-hover:underline">تعرّف على برنامج القرآن ←</span></a>
          <a href="/arabic" className="group rounded-3xl border border-border bg-card p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Languages className="size-6" /></div><h3 className="mt-5 text-2xl font-extrabold text-foreground">تأسيس اللغة العربية</h3><p className="mt-3 leading-7 text-muted-foreground">للقراءة والكتابة والإملاء والفهم والتعبير، حسب عمر الطالب ومستواه.</p><span className="mt-5 inline-block font-bold text-primary group-hover:underline">تعرّف على برنامج العربية ←</span></a>
        </div></div>
      </section>
      <section className="relative overflow-hidden bg-primary py-16"><div className="absolute inset-0 islamic-pattern opacity-20" /><div className="relative z-10 mx-auto max-w-4xl px-4 text-center"><h2 className="text-3xl font-extrabold text-primary-foreground">هل تحتاج إلى مساعدة في اختيار المعلم؟</h2><p className="mx-auto mt-4 max-w-2xl leading-8 text-primary-foreground/80">أرسل بيانات الطالب، وسنساعدك في اختيار المعلم أو المعلمة الأقرب إلى احتياجه، ثم يمكنك حجز حصة تجريبية مجانية.</p><a href={generalWhatsappUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-8 py-4 font-bold text-[#1f260d] transition hover:brightness-110"><MessageCircle className="size-5" />تواصل معنا لاختيار المعلم</a><div className="mt-8 border-t border-primary-foreground/20 pt-6"><p className="text-sm text-primary-foreground/70">هل أنت معلم أو معلمة وتريد الانضمام لفريقنا؟</p><a href={contactEmail ? `mailto:${contactEmail}` : "#"} className="mt-2 inline-block font-bold text-[#f1d978] hover:underline">تواصل معنا للانضمام</a></div></div></section>
    </>
  )
}
