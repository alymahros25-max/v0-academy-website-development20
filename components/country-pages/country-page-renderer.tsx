import type { CountryPageModel, CountryPageSection } from "@/lib/country-pages/types"

type Props = {
  page: CountryPageModel
}

function sectionClass(section: CountryPageSection) {
  return `country-central-section country-central-${section.type} country-central-${section.variant}`
}

function Hero({ page }: Props) {
  return (
    <section className="country-central-hero" style={{ background: page.theme.background, color: page.theme.ink }}>
      <div>
        <p className="country-central-eyebrow">{page.country.nameAr} · {page.country.currencySymbol}</p>
        <h1>{page.seo.title}</h1>
        <p>{page.seo.description}</p>
        <a href={page.links.find((link) => link.key === "whatsapp")?.href ?? "#"}>اطلب الحصة التجريبية الأولى</a>
      </div>
    </section>
  )
}

function Steps({ page }: Props) {
  return (
    <section className="country-central-section country-central-steps">
      <p className="country-central-kicker">طريقة البداية</p>
      <h2>مسار واضح يبدأ من احتياج الطالب</h2>
      <div className="country-central-grid">
        {page.steps.map((step) => (
          <article key={step.id}>
            <strong>{step.title}</strong>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Pricing({ page }: Props) {
  const groups = ["quran", "arabic", "other"] as const
  const programLabel = (program: (typeof groups)[number]) => program === "quran" ? "تحفيظ القرآن" : program === "arabic" ? "تأسيس اللغة العربية" : "برامج أخرى"

  return (
    <section className="country-central-section country-central-pricing" style={{ background: page.theme.surface, color: page.theme.ink }}>
      <p className="country-central-kicker">الباقات</p>
      <h2>اختر المسار المناسب في {page.country.nameAr}</h2>
      {groups.map((program) => {
        const packages = page.packages.filter((pkg) => pkg.program === program)
        if (packages.length === 0) return null
        return (
          <div className="country-central-program" key={program}>
            <h2>{programLabel(program)} في {page.country.nameAr}</h2>
            <div className="country-central-grid">
              {packages.map((pkg) => (
                <article key={pkg.id} className={pkg.popular ? "is-popular" : undefined}>
                  <p>{programLabel(program)}</p>
                  <h3>{pkg.name}</h3>
                  <strong>{pkg.price} {pkg.currencyCode}</strong>
                  <small>{pkg.sessionsPerMonth} حصة شهريًا</small>
                  <ul>{pkg.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                </article>
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}

function Local({ page }: Props) {
  return (
    <section className="country-central-section country-central-local">
      <p className="country-central-kicker">التنسيق المحلي</p>
      <h2>خدمة أونلاين للطلاب في {page.country.nameAr}</h2>
      <p>{page.localLead}</p>
      <p>{page.country.cities.join(" · ")}</p>
      {page.country.timezone && <p>{page.country.timezone}</p>}
    </section>
  )
}

function Faq({ page }: Props) {
  return (
    <section className="country-central-section country-central-faq">
      <p className="country-central-kicker">الأسئلة الشائعة</p>
      {page.faq.map((item) => (
        <details key={item.id}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </section>
  )
}

function Closing({ page }: Props) {
  return (
    <section className="country-central-section country-central-closing" style={{ background: page.theme.primary, color: "white" }}>
      <h2>ابدأ من {page.country.nameAr}</h2>
      <a href={page.links.find((link) => link.key === "whatsapp")?.href ?? "#"}>تواصل معنا</a>
    </section>
  )
}

export function CountryPageRenderer({ page }: Props) {
  const sections = page.sections.filter((section) => section.isActive).sort((a, b) => a.sortOrder - b.sortOrder)
  return (
    <main dir="rtl" className="country-central-page" data-renderer="central" data-country={page.country.slug}>
      {sections.map((section) => {
        const className = sectionClass(section)
        if (section.type === "hero") return <div className={className} key={section.key}><Hero page={page} /></div>
        if (section.type === "steps") return <div className={className} key={section.key}><Steps page={page} /></div>
        if (section.type === "pricing") return <div className={className} key={section.key}><Pricing page={page} /></div>
        if (section.type === "local") return <div className={className} key={section.key}><Local page={page} /></div>
        if (section.type === "faq") return <div className={className} key={section.key}><Faq page={page} /></div>
        if (section.type === "closing") return <div className={className} key={section.key}><Closing page={page} /></div>
        return null
      })}
    </main>
  )
}
