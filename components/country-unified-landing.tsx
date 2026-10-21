import { Fragment, type ReactNode } from "react"
import { Check, Clock3, MapPin, MessageCircle, Sparkles } from "lucide-react"
import type { CountryPageModel } from "@/lib/country-page-model"
import { getAreaWhatsAppUrl } from "@/lib/country-content"
import { getPublishedClassroomVideos } from "@/lib/classroom-videos"
import { NewCountryVideos } from "@/components/new-country-videos"
import { CountryLearningHub } from "@/components/country-learning-hub"
import { getCountryThemeStyle } from "@/components/country-enrichment-section"
import { getCountryPageDesign, type CountryFaqVariant, type CountryHeroVariant, type CountryLocalVariant, type CountryPageSection, type CountryPlanVariant } from "@/lib/country-page-designs"

const defaultWhatsApp = "https://wa.me/message/RCJSLAJQHAWHA1"

async function getLandingVideosSafely() {
  try {
    return await Promise.race([
      getPublishedClassroomVideos(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Landing videos timed out")), 500)),
    ])
  } catch (error) {
    console.warn("[Country Landing] optional videos skipped:", error instanceof Error ? error.message : error)
    return []
  }
}

type Plan = CountryPageModel["quranPlans"][number]

function priceLabel(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value)
}

function sessionUnit(sessions: number) {
  return sessions >= 3 && sessions <= 10 ? "حصص" : "حصة"
}

function normalizePlanName(name: string, sessions: number) {
  const unit = sessionUnit(sessions)
  return name.replace(/([0-9٠-٩]+)\s*(?:حصص|حصة|حصتان)/gu, (count) => `${count.match(/[0-9٠-٩]+/u)?.[0] ?? count} ${unit}`)
}

const heroLayout: Record<CountryHeroVariant, { section: string; grid: string; copy: string; aside: string; card: string }> = {
  split: {
    section: "border-b border-border bg-gradient-to-br from-secondary/70 via-background to-background px-5 py-16 sm:px-8 sm:py-24 lg:py-28",
    grid: "mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_.85fr]",
    copy: "", aside: "rounded-3xl border border-border bg-card/90 p-6 shadow-xl sm:p-8",
    card: "rounded-2xl bg-secondary/60 p-5",
  },
  centered: {
    section: "border-b border-border bg-secondary/35 px-5 py-16 text-center sm:px-8 sm:py-20",
    grid: "mx-auto flex max-w-5xl flex-col items-center gap-9",
    copy: "mx-auto max-w-4xl", aside: "grid w-full gap-4 text-right sm:grid-cols-2",
    card: "rounded-3xl border border-border bg-card p-6 shadow-sm",
  },
  editorial: {
    section: "border-b-4 border-primary/25 bg-background px-5 py-14 sm:px-8 sm:py-20",
    grid: "mx-auto grid max-w-6xl items-stretch gap-8 lg:grid-cols-[.72fr_1.28fr]",
    copy: "border-r-4 border-primary pr-6 lg:py-5", aside: "grid gap-4 sm:grid-cols-2 lg:grid-cols-1",
    card: "rounded-xl border-b-2 border-primary/30 bg-secondary/40 p-5",
  },
  offset: {
    section: "relative overflow-hidden border-b border-border bg-gradient-to-l from-primary/10 via-background to-secondary/50 px-5 py-16 sm:px-8 sm:py-24",
    grid: "mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr]",
    copy: "lg:order-2", aside: "lg:order-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-1",
    card: "rounded-2xl border border-primary/20 bg-card p-5 shadow-lg",
  },
  framed: {
    section: "bg-background px-4 py-10 sm:px-8 sm:py-14",
    grid: "mx-auto grid max-w-6xl items-center gap-8 rounded-[2rem] border-2 border-primary/20 bg-secondary/30 p-6 sm:p-10 lg:grid-cols-[1.1fr_.9fr]",
    copy: "", aside: "grid gap-3",
    card: "rounded-xl border border-border bg-background p-5",
  },
  banner: {
    section: "border-b border-border bg-primary/5 px-5 py-12 sm:px-8 sm:py-16",
    grid: "mx-auto grid max-w-6xl items-center gap-6 lg:grid-cols-[1fr_auto]",
    copy: "", aside: "grid gap-3 sm:grid-cols-2 lg:col-span-2",
    card: "rounded-2xl border border-border bg-background p-5",
  },
  stacked: {
    section: "border-b border-border bg-gradient-to-b from-secondary/70 to-background px-5 py-16 sm:px-8 sm:py-20",
    grid: "mx-auto grid max-w-5xl gap-8",
    copy: "max-w-4xl", aside: "grid gap-4 md:grid-cols-2",
    card: "rounded-2xl border border-border bg-card p-6",
  },
  mirror: {
    section: "border-b border-border bg-secondary/25 px-5 py-16 sm:px-8 sm:py-24",
    grid: "mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[.85fr_1.15fr]",
    copy: "lg:order-2", aside: "lg:order-1 grid gap-4 sm:grid-cols-2",
    card: "rounded-[1.5rem] border border-border bg-card p-5 shadow-sm",
  },
}

function CountryHero({ page, variant }: { page: CountryPageModel; variant: CountryHeroVariant }) {
  const country = page.areaData.area?.name_ar || page.seo?.country || page.slug
  const contactUrl = getAreaWhatsAppUrl(page.areaData.links, "حصة تجريبية مجانية", defaultWhatsApp, `السلام عليكم، أرغب في حجز حصة تجريبية مجانية للطالب في ${country}.`)
  const style = heroLayout[variant]
  return <section data-hero-layout={variant} className={`relative isolate overflow-hidden ${style.section}`}>
    <div aria-hidden="true" className="pointer-events-none absolute -left-16 top-12 size-64 rounded-full bg-primary/10 blur-3xl" />
    <div className={`relative ${style.grid}`}>
      <div className={style.copy}>
        <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-4 py-2 text-sm font-bold text-primary"><Sparkles size={16} /> أكاديمية الحافظ المتميز · {country}</p>
        <h1 className="mt-6 max-w-4xl text-balance text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">{page.seo?.h1 || `تحفيظ القرآن وتأسيس العربية أونلاين في ${country}`}</h1>
        <p className="mt-6 max-w-3xl text-pretty text-lg leading-9 text-muted-foreground">{page.seo?.description || `حصص فردية مباشرة باللغة العربية لتحفيظ القرآن وتأسيس اللغة العربية أونلاين للطلاب في ${country}.`}</p>
        <div className={`mt-8 flex flex-wrap gap-3 ${variant === "centered" ? "justify-center" : ""}`}>
          <a className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-sm transition hover:opacity-90" href={contactUrl} target="_blank" rel="noreferrer"><MessageCircle size={18} /> احجز حصة تجريبية</a>
          <a className="inline-flex items-center rounded-xl border border-border bg-background px-6 py-3 font-bold transition hover:border-primary" href="#quran-plans">استعرض الباقات</a>
        </div>
        <div className={`mt-6 flex flex-wrap gap-2 text-sm ${variant === "centered" ? "justify-center" : ""}`}><span className="rounded-full bg-background/80 px-4 py-2">حصص فردية مباشرة</span><span className="rounded-full bg-background/80 px-4 py-2">التعلم أونلاين فقط</span><span className="rounded-full bg-background/80 px-4 py-2">{page.currencyLabel}</span></div>
      </div>
      <aside className={style.aside} aria-label="مسارا التعلم">
        <p className="text-sm font-bold text-primary">مسارا التعلم</p>
        <div className={`${style.card} ${variant === "banner" ? "border-r-4 border-primary" : ""}`}><span className="text-sm font-bold text-muted-foreground">01 · القرآن</span><h2 className="mt-2 text-xl font-black">تحفيظ القرآن الكريم</h2><p className="mt-2 leading-7 text-muted-foreground">حفظ ومراجعة وتلاوة وتجويد وفق مستوى الطالب.</p></div>
        <div className={`${style.card} ${variant === "banner" ? "border-r-4 border-secondary-foreground/30" : ""}`}><span className="text-sm font-bold text-muted-foreground">02 · العربية</span><h2 className="mt-2 text-xl font-black">تأسيس اللغة العربية</h2><p className="mt-2 leading-7 text-muted-foreground">تدريب فردي على القراءة والكتابة والنطق والفهم.</p></div>
      </aside>
    </div>
  </section>
}

const localLayout: Record<CountryLocalVariant, { grid: string; city: string; time: string; chip: string }> = {
  bento: { grid: "grid gap-5 lg:grid-cols-[1.3fr_.7fr]", city: "rounded-3xl border border-border bg-card p-7 shadow-sm", time: "rounded-3xl bg-primary/5 p-7", chip: "rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold" },
  rail: { grid: "grid gap-5 md:grid-cols-2", city: "rounded-none border-r-4 border-primary bg-secondary/25 p-7", time: "rounded-2xl border border-border bg-card p-7", chip: "block border-b border-border py-2 text-sm font-semibold" },
  band: { grid: "grid gap-4", city: "rounded-2xl bg-primary/5 p-6", time: "flex flex-col gap-2 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between", chip: "rounded-lg bg-background px-4 py-2 text-sm font-semibold" },
  split: { grid: "grid gap-5 lg:grid-cols-2", city: "rounded-[2rem] border border-border bg-card p-7", time: "rounded-[2rem] border-2 border-primary/20 bg-background p-7", chip: "rounded-xl border border-primary/15 bg-secondary/40 px-4 py-3 text-sm font-semibold" },
  clock: { grid: "grid gap-5 lg:grid-cols-[.75fr_1.25fr]", city: "order-2 rounded-2xl border border-border bg-card p-7 lg:order-1", time: "order-1 rounded-2xl bg-secondary/50 p-7 lg:order-2", chip: "rounded-full bg-background px-4 py-2 text-sm font-semibold shadow-sm" },
}

function LocalContextSection({ page, variant }: { page: CountryPageModel; variant: CountryLocalVariant }) {
  const country = page.areaData.area?.name_ar || page.seo?.country || page.slug
  const layout = localLayout[variant]
  return <section data-local-layout={variant} className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
    <div className={layout.grid}>
      <article className={layout.city}><div className="flex items-center gap-3"><MapPin className="shrink-0 text-primary" /><h2 className="text-xl font-black">التعلم أونلاين في {country}</h2></div><p className="mt-3 leading-7 text-muted-foreground">يمكن حضور الحصص من أي مدينة، مع تنسيق موعد يناسب الطالب والأسرة.</p>{page.cities.length > 0 && <div className={`${variant === "rail" ? "mt-5 grid" : "mt-5 flex flex-wrap gap-2"}`}>{page.cities.map((city, index) => <span key={city} className={layout.chip}>{variant === "rail" ? `${String(index + 1).padStart(2, "0")} · ${city}` : city}</span>)}</div>}</article>
      <article className={layout.time}><div className="flex items-center gap-3"><Clock3 className="shrink-0 text-primary" /><h2 className="text-xl font-black">تنسيق المواعيد</h2></div><p className="mt-3 leading-7 text-muted-foreground">تُنسق المواعيد حسب {page.timezoneLabel} وبعد معرفة الوقت المناسب للأسرة.</p><p className="mt-5 inline-flex rounded-full bg-background px-4 py-2 text-sm font-bold text-primary">{page.timezoneLabel}</p></article>
    </div>
  </section>
}

function PlanCard({ page, plan, program, layout, index }: { page: CountryPageModel; plan: Plan; program: "quran" | "arabic"; layout: CountryPlanVariant; index: number }) {
  const planTitle = normalizePlanName(plan.name, plan.monthlySessions)
  const contact = getAreaWhatsAppUrl(page.areaData.links, planTitle, defaultWhatsApp, `السلام عليكم، أرغب في الاستفسار عن ${planTitle} في ${page.seo?.country || page.slug}.`)
  const cardClass = layout === "rows"
    ? "grid gap-4 rounded-2xl border border-border bg-card p-5 md:grid-cols-[1fr_auto_auto] md:items-center"
    : layout === "ladder"
      ? "relative rounded-r-none border-r-4 border-primary bg-card p-6 shadow-sm"
      : layout === "spotlight" && plan.popular
        ? "rounded-3xl border-2 border-primary bg-primary/5 p-7 shadow-xl xl:col-span-2"
        : "flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm"
  return <article key={plan.id} data-plan-index={index} className={cardClass}>
    {plan.popular && <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground"><Sparkles size={14} /> الأكثر طلبًا</span>}
    <div><p className="text-sm font-bold text-muted-foreground">{program === "quran" ? "تحفيظ القرآن" : "تأسيس العربية"}</p><h3 className="mt-2 text-xl font-black">{planTitle}</h3></div>
    <p className="mt-3 text-3xl font-black text-primary">{priceLabel(plan.price)} <span className="text-sm font-bold">{page.currencyLabel}</span></p>
    <p className="mt-2 text-sm text-muted-foreground">{plan.monthlySessions} {sessionUnit(plan.monthlySessions)} شهريًا · {plan.duration} دقيقة للحصة</p>
    {plan.description && <p className="mt-3 text-sm leading-7 text-muted-foreground">{plan.description}</p>}
    {plan.features.length > 0 && <ul className="mt-4 grid gap-2 text-sm">{plan.features.map((feature) => <li key={feature} className="flex items-start gap-2"><Check size={16} className="mt-1 shrink-0 text-primary" />{feature}</li>)}</ul>}
    <a className={`mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${layout === "cards" || layout === "spotlight" ? "mt-auto" : ""}`} href={contact} target="_blank" rel="noreferrer"><MessageCircle size={17} /> اسأل عن هذه الباقة</a>
  </article>
}

function PlanTable({ page, plans }: { page: CountryPageModel; plans: Plan[] }) {
  return <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card"><table className="w-full min-w-[720px] border-collapse text-right"><thead className="bg-secondary/50"><tr>{["الباقة", "الحصص", "مدة الحصة", "السعر", "التواصل"].map((label) => <th key={label} className="p-4 text-sm font-black">{label}</th>)}</tr></thead><tbody>{plans.map((plan) => {
    const planTitle = normalizePlanName(plan.name, plan.monthlySessions)
    const contact = getAreaWhatsAppUrl(page.areaData.links, planTitle, defaultWhatsApp, `السلام عليكم، أرغب في الاستفسار عن ${planTitle} في ${page.seo?.country || page.slug}.`)
    return <tr key={plan.id} className="border-t border-border"><td className="p-4"><b className="block">{planTitle}</b>{plan.description && <span className="mt-1 block text-sm text-muted-foreground">{plan.description}</span>}{plan.features.length > 0 && <span className="mt-1 block text-xs text-muted-foreground">{plan.features.join(" · ")}</span>}</td><td className="p-4">{plan.monthlySessions} {sessionUnit(plan.monthlySessions)} شهريًا</td><td className="p-4">{plan.duration} دقيقة</td><td className="p-4 font-black text-primary">{priceLabel(plan.price)} {page.currencyLabel}</td><td className="p-4"><a className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground" href={contact} target="_blank" rel="noreferrer"><MessageCircle size={16} /> اسأل عن الباقة</a></td></tr>
  })}</tbody></table></div>
}

function PlanGroup({ page, program, title, layout }: { page: CountryPageModel; program: "quran" | "arabic"; title: string; layout: CountryPlanVariant }) {
  const plans = program === "quran" ? page.quranPlans : page.arabicPlans
  return <section id={program === "quran" ? "quran-plans" : "arabic-plans"} data-plan-layout={layout} className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
    <div className="mx-auto max-w-3xl text-center"><p className="text-sm font-bold text-primary">{program === "quran" ? "المسار الأول" : "المسار الثاني"}</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">{title}</h2><p className="mt-4 leading-8 text-muted-foreground">باقات شهرية لحصص فردية مباشرة أونلاين باللغة العربية.</p></div>
    {plans.length ? layout === "table" ? <PlanTable page={page} plans={plans} />
      : <div className={`mt-8 ${layout === "rows" ? "grid gap-3" : layout === "ladder" ? "mx-auto grid max-w-4xl gap-4 border-r-2 border-primary/20 pr-5" : layout === "spotlight" ? "grid gap-5 xl:grid-cols-3" : "grid gap-5 sm:grid-cols-2 xl:grid-cols-4"}`}>{plans.map((plan, index) => <PlanCard key={plan.id} page={page} plan={plan} program={program} layout={layout} index={index} />)}</div>
      : <div className="mt-8 rounded-2xl border border-dashed border-border p-6 text-center"><p className="font-bold">تواصل معنا لمعرفة الباقات المتاحة حاليًا.</p><a className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground" href={getAreaWhatsAppUrl(page.areaData.links, "الباقات", defaultWhatsApp)} target="_blank" rel="noreferrer"><MessageCircle size={17} /> تواصل عبر WhatsApp</a></div>}
  </section>
}

function CountryFaqSection({ page, variant }: { page: CountryPageModel; variant: CountryFaqVariant }) {
  if (!page.faq.length) return null
  return <section id="country-faq" data-faq-layout={variant} className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
    <div className="text-center"><p className="text-sm font-bold text-primary">إجابات قبل البداية</p><h2 className="mt-3 text-3xl font-black">الأسئلة الشائعة</h2></div>
    <div className={`mt-8 ${variant === "columns" || variant === "cards" ? "grid gap-4 md:grid-cols-2" : "grid gap-3"}`}>
      {page.faq.map(([question, answer], index) => variant === "cards" || variant === "columns"
        ? <article key={question} className={`${variant === "cards" ? "rounded-2xl border border-border bg-card p-6 shadow-sm" : "border-r-2 border-primary/30 bg-secondary/20 p-5"}`}><h3 className="font-black">{question}</h3><p className="mt-3 leading-8 text-muted-foreground">{answer}</p></article>
        : <details key={question} className={`${variant === "strip" ? "border-b border-border py-5" : "rounded-xl border border-border bg-card p-5"}`}><summary className="flex cursor-pointer list-none items-start gap-3 font-bold"><span className="text-primary">{variant === "numbered" ? `${String(index + 1).padStart(2, "0")}.` : "＋"}</span>{question}</summary><p className="mt-3 leading-8 text-muted-foreground">{answer}</p></details>)}
    </div>
  </section>
}

export async function CountryUnifiedLanding({ page }: { page: CountryPageModel }) {
  const videos = await getLandingVideosSafely()
  const design = getCountryPageDesign(page.slug)
  const country = page.areaData.area?.name_ar || page.seo?.country || page.slug
  const themeStyle = getCountryThemeStyle(page.areaData.theme)
  const sections: Record<CountryPageSection, ReactNode> = {
    local: <LocalContextSection page={page} variant={design.local} />,
    quranPlans: <PlanGroup page={page} program="quran" title={`باقات تحفيظ القرآن في ${country}`} layout={design.plans} />,
    arabicPlans: <PlanGroup page={page} program="arabic" title={`باقات تأسيس العربية في ${country}`} layout={design.plans} />,
    videos: videos.length > 0 ? <div className="mx-auto max-w-6xl px-5 sm:px-8"><NewCountryVideos videos={videos} /></div> : null,
    learning: <CountryLearningHub slug={page.slug} content={page.learning} variant={design.learning} showLocalCard={false} />,
    faq: <CountryFaqSection page={page} variant={design.faq} />,
  }

  return <main dir="rtl" data-country-unified-landing={page.slug} data-country-layout={design.profileId} data-section-order={design.order.join(",")} className="min-h-screen overflow-hidden bg-background text-foreground" style={themeStyle}>
    <CountryHero page={page} variant={design.hero} />
    {design.order.map((section) => <Fragment key={section}>{sections[section]}</Fragment>)}
  </main>
}
