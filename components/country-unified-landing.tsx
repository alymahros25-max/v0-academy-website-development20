import { Check, Clock3, MapPin, MessageCircle, Sparkles } from "lucide-react"
import type { CountryPageModel } from "@/lib/country-page-model"
import { getAreaWhatsAppUrl } from "@/lib/country-content"
import { getPublishedClassroomVideos } from "@/lib/classroom-videos"
import { NewCountryVideos } from "@/components/new-country-videos"
import { CountryLearningHub } from "@/components/country-learning-hub"
import { getCountryThemeStyle } from "@/components/country-enrichment-section"

const defaultWhatsApp = "https://wa.me/message/RCJSLAJQHAWHA1"

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

function PlanGroup({ page, program, title }: { page: CountryPageModel; program: "quran" | "arabic"; title: string }) {
  const plans = program === "quran" ? page.quranPlans : page.arabicPlans
  return <section id={program === "quran" ? "quran-plans" : "arabic-plans"} className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 lg:py-20">
    <div className="mx-auto max-w-3xl text-center"><p className="text-sm font-bold text-primary">{program === "quran" ? "المسار الأول" : "المسار الثاني"}</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">{title}</h2><p className="mt-4 leading-8 text-muted-foreground">باقات شهرية لحصص فردية مباشرة أونلاين باللغة العربية.</p></div>
    {plans.length ? <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{plans.map((plan) => {
      const planTitle = normalizePlanName(plan.name, plan.monthlySessions)
      const href = getAreaWhatsAppUrl(page.areaData.links, planTitle, defaultWhatsApp, `السلام عليكم، أرغب في الاستفسار عن ${planTitle} في ${page.seo?.country || page.slug}.`)
      return <article key={plan.id} className={`flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm ${plan.popular ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
        {plan.popular && <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground"><Sparkles size={14} /> الأكثر طلبًا</span>}
        <p className="text-sm font-bold text-muted-foreground">{plan.program === "quran" ? "تحفيظ القرآن" : "تأسيس العربية"}</p>
        <h3 className="mt-2 text-xl font-black">{planTitle}</h3>
        <p className="mt-5 text-3xl font-black text-primary">{priceLabel(plan.price)} <span className="text-sm font-bold">{page.currencyLabel}</span></p>
        <p className="mt-2 text-sm text-muted-foreground">{plan.monthlySessions} {sessionUnit(plan.monthlySessions)} شهريًا · {plan.duration} دقيقة للحصة</p>
        {plan.description && <p className="mt-4 text-sm leading-7 text-muted-foreground">{plan.description}</p>}
        {plan.features.length > 0 && <ul className="mt-4 grid gap-2 text-sm">{plan.features.map((feature) => <li key={feature} className="flex items-start gap-2"><Check size={16} className="mt-1 shrink-0 text-primary" />{feature}</li>)}</ul>}
        <a className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={href} target="_blank" rel="noreferrer"><MessageCircle size={17} /> اسأل عن هذه الباقة</a>
      </article>
    })}</div> : <div className="mt-8 rounded-2xl border border-dashed border-border p-6 text-center"><p className="font-bold">تواصل معنا لمعرفة الباقات المتاحة حاليًا.</p><a className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground" href={getAreaWhatsAppUrl(page.areaData.links, "الباقات", defaultWhatsApp)} target="_blank" rel="noreferrer"><MessageCircle size={17} /> تواصل عبر WhatsApp</a></div>}
  </section>
}

export async function CountryUnifiedLanding({ page }: { page: CountryPageModel }) {
  const [videos] = await Promise.all([getPublishedClassroomVideos()])
  const country = page.areaData.area?.name_ar || page.seo?.country || page.slug
  const contactUrl = getAreaWhatsAppUrl(page.areaData.links, "حصة تجريبية مجانية", defaultWhatsApp, `السلام عليكم، أرغب في حجز حصة تجريبية مجانية للطالب في ${country}.`)
  const cities = page.cities
  const themeStyle = getCountryThemeStyle(page.areaData.theme)

  return <main dir="rtl" data-country-unified-landing={page.slug} className="min-h-screen overflow-hidden bg-background text-foreground" style={themeStyle}>
    <section className="relative isolate overflow-hidden border-b border-border bg-gradient-to-br from-secondary/70 via-background to-background px-5 py-16 sm:px-8 sm:py-24 lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -left-16 top-12 size-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_.85fr]">
        <div><p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-4 py-2 text-sm font-bold text-primary"><Sparkles size={16} /> أكاديمية الحافظ المتميز · {country}</p>
          <h1 className="mt-6 max-w-4xl text-balance text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">{page.seo?.h1 || `تحفيظ القرآن وتأسيس العربية أونلاين في ${country}`}</h1>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-9 text-muted-foreground">{page.seo?.description || `حصص فردية مباشرة باللغة العربية لتحفيظ القرآن وتأسيس اللغة العربية أونلاين للطلاب في ${country}.`}</p>
          <div className="mt-8 flex flex-wrap gap-3"><a className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-sm transition hover:opacity-90" href={contactUrl} target="_blank" rel="noreferrer"><MessageCircle size={18} /> احجز حصة تجريبية</a><a className="inline-flex items-center rounded-xl border border-border bg-background px-6 py-3 font-bold transition hover:border-primary" href="#quran-plans">استعرض الباقات</a></div>
          <div className="mt-6 flex flex-wrap gap-2 text-sm"><span className="rounded-full bg-background/80 px-4 py-2">حصص فردية مباشرة</span><span className="rounded-full bg-background/80 px-4 py-2">التعلم أونلاين فقط</span><span className="rounded-full bg-background/80 px-4 py-2">{page.currencyLabel}</span></div>
        </div>
        <aside className="rounded-3xl border border-border bg-card/90 p-6 shadow-xl sm:p-8"><p className="text-sm font-bold text-primary">مسارا التعلم</p><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1"><div className="rounded-2xl bg-secondary/60 p-5"><span className="text-sm font-bold text-muted-foreground">01</span><h2 className="mt-2 text-xl font-black">تحفيظ القرآن الكريم</h2><p className="mt-2 leading-7 text-muted-foreground">حفظ ومراجعة وتلاوة وتجويد وفق مستوى الطالب.</p></div><div className="rounded-2xl bg-secondary/60 p-5"><span className="text-sm font-bold text-muted-foreground">02</span><h2 className="mt-2 text-xl font-black">تأسيس اللغة العربية</h2><p className="mt-2 leading-7 text-muted-foreground">تدريب فردي على القراءة والكتابة والنطق والفهم.</p></div></div></aside>
      </div>
    </section>

    <section className="mx-auto grid max-w-6xl gap-6 px-5 py-12 sm:px-8 md:grid-cols-[1.2fr_.8fr]">
      <article className="rounded-2xl border border-border bg-card p-6"><div className="flex items-center gap-3"><MapPin className="text-primary" /><h2 className="text-xl font-black">التعلم أونلاين في {country}</h2></div><p className="mt-3 leading-7 text-muted-foreground">يمكن حضور الحصص من أي مدينة، مع تنسيق موعد يناسب الطالب والأسرة.</p>{cities.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{cities.map((city) => <span key={city} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold">{city}</span>)}</div>}</article>
      <article className="rounded-2xl border border-border bg-card p-6"><div className="flex items-center gap-3"><Clock3 className="text-primary" /><h2 className="text-xl font-black">تنسيق المواعيد</h2></div><p className="mt-3 leading-7 text-muted-foreground">تُنسق المواعيد حسب {page.timezoneLabel} وبعد معرفة الوقت المناسب للأسرة.</p></article>
    </section>

    <PlanGroup page={page} program="quran" title={`باقات تحفيظ القرآن في ${country}`} />
    <PlanGroup page={page} program="arabic" title={`باقات تأسيس العربية في ${country}`} />

    {videos.length > 0 && <div className="mx-auto max-w-6xl px-5 sm:px-8"><NewCountryVideos videos={videos} /></div>}

    {page.faq.length > 0 && <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8"><div className="text-center"><p className="text-sm font-bold text-primary">إجابات قبل البداية</p><h2 className="mt-3 text-3xl font-black">الأسئلة الشائعة</h2></div><div className="mt-8 grid gap-3">{page.faq.map(([question, answer]) => <details key={question} className="rounded-xl border border-border bg-card p-5"><summary className="cursor-pointer font-bold">{question}</summary><p className="mt-3 leading-8 text-muted-foreground">{answer}</p></details>)}</div></section>}

    <CountryLearningHub slug={page.slug} variant="minimal" showLocalCard={false} />
  </main>
}
