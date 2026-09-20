import Link from "next/link"
import { ArrowLeft, Check, Clock3, MessageCircle, MapPin, Sparkles, CalendarDays, BookOpen, Gamepad2, Scale, Home, Newspaper, Globe2, ChevronDown } from "lucide-react"
import type { NewCountryConfig } from "@/lib/new-country-pages"
import { areaLocalized, getAreaLandingData, getAreaLinkHref, getAreaWhatsAppUrl, toAreaDisplayPlan } from "@/lib/country-content"
import { getPublishedClassroomVideos, type LandingVideo } from "@/lib/classroom-videos"
import { getTeachers, type Teacher } from "@/lib/data-store"
import { NewCountryVideos } from "@/components/new-country-videos"

type Props = { config: NewCountryConfig; videos?: LandingVideo[]; teachers?: Teacher[]; contactUrl?: string }

function WhatsApp({ config, label = "احجز الحصة التجريبية", contactUrl }: { config: NewCountryConfig; label?: string; contactUrl?: string }) {
  const href = contactUrl || `https://bit.ly/4aJfOl6?text=${encodeURIComponent(config.whatsappMessage)}`
  return <a href={href} target="_blank" rel="noreferrer" className="new-country-cta"><MessageCircle size={18} />{label}</a>
}

function PriceTable({ config, compact = false }: { config: NewCountryConfig; compact?: boolean }) {
  const rows = [4, 8, 12, 16]
  const mode = ["qatar", "france", "sweden"].includes(config.variant) ? "cards" : ["oman", "spain", "belgium"].includes(config.variant) ? "rail" : ["jordan", "netherlands"].includes(config.variant) ? "columns" : "table"
  if (mode === "cards") return <div className={`new-country-price-cards ${compact ? "is-compact" : ""}`}>{rows.map((sessions, index) => <article key={sessions}><span>{sessions} حصص</span><b>{config.quranPrices[index]} {config.currencyCode}</b><small>قرآن</small><strong>{config.arabicPrices[index]} {config.currencyCode}</strong><small>عربية</small></article>)}</div>
  if (mode === "rail") return <div className="new-country-price-rail">{rows.map((sessions, index) => <article key={sessions}><div><b>{sessions}</b><small>حصص</small></div><span><strong>{config.quranPrices[index]} {config.currencyCode}</strong><small>تحفيظ القرآن</small></span><span><strong>{config.arabicPrices[index]} {config.currencyCode}</strong><small>تأسيس العربية</small></span></article>)}</div>
  if (mode === "columns") return <div className="new-country-price-columns"><div className="new-country-price-column"><h3>تحفيظ القرآن</h3>{rows.map((sessions, index) => <p key={sessions}><span>{sessions} حصص</span><b>{config.quranPrices[index]} {config.currencyCode}</b></p>)}</div><div className="new-country-price-column is-secondary"><h3>تأسيس العربية</h3>{rows.map((sessions, index) => <p key={sessions}><span>{sessions} حصص</span><b>{config.arabicPrices[index]} {config.currencyCode}</b></p>)}</div></div>
  return <div className={`new-country-price-table ${compact ? "new-country-price-table-compact" : ""}`}><div className="new-country-price-head"><span>الباقة الشهرية</span><span>تحفيظ القرآن</span><span>تأسيس العربية</span></div>{rows.map((sessions, index) => <div className="new-country-price-row" key={sessions}><span><b>{sessions}</b> حصص <small>· {sessions / 4} أسبوعيًا</small></span><strong>{config.quranPrices[index]} {config.currencyCode}</strong><strong>{config.arabicPrices[index]} {config.currencyCode}</strong></div>)}</div>
}

function Steps({ config, numbered = true }: { config: NewCountryConfig; numbered?: boolean }) {
  return <div className="new-country-steps">{config.steps.map((step, index) => <article key={step.title} className="new-country-step">{numbered && <span className="new-country-step-number">{String(index + 1).padStart(2, "0")}</span>}<h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
}

function FAQ({ config }: Props) {
  return <section className="new-country-section new-country-faq" aria-labelledby="faq-title"><div className="new-country-narrow"><p className="new-country-kicker">إجابات قبل البداية</p><h2 id="faq-title">أسئلة تختصر عليك القرار</h2><div className="new-country-faq-grid">{config.faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>
}

function LocalSection({ config }: Props) {
  return <section className="new-country-section new-country-local"><div className="new-country-narrow"><div className="new-country-local-icon"><MapPin size={20} /></div><p className="new-country-kicker">الخدمة من أي مكان</p><h2>أونلاين للعائلات في {config.name}</h2><p>{config.localLead}</p><div className="new-country-city-list">{config.cities.map(city => <span key={city}>{city}</span>)}</div><div className="new-country-time"><Clock3 size={18} /><span>المواعيد تُنسق حسب {config.timezone}</span></div></div></section>
}

function TeacherTrust({ teachers }: { teachers: Teacher[] }) {
  const activeTeachers = teachers.filter((teacher) => teacher.active)
  return <section className="new-country-trust"><div className="new-country-narrow"><p className="new-country-kicker">فريق التعليم</p><h2>معلمون ومعلمات للطلاب والطالبات</h2><p>بيانات الفريق التعليمي تُدار من لوحة التحكم. عند الحجز يمكنك توضيح ما إذا كان الطالب يحتاج إلى معلم أو تحتاج الطالبة إلى معلمة، ويتم تنسيق البرنامج وفق المعلومات المسجلة والمتاحة في النظام.</p><div className="new-country-trust-stats"><span><b>{activeTeachers.length ? "مُدار" : "—"}</b><small>بيانات الفريق من لوحة التحكم</small></span><span><b>30</b><small>دقيقة للحصة</small></span><span><b>1:1</b><small>حصة فردية</small></span></div></div></section>
}

function PackageIncludes() {
  return <section className="new-country-package-includes"><div className="new-country-narrow"><p className="new-country-kicker">محتوى كل باقة</p><div className="new-country-package-features"><article><b>30 دقيقة</b><span>مدة كل حصة</span></article><article><b>مجانية</b><span>حصة تجريبية قبل الاشتراك</span></article><article><b>فردية</b><span>حصة خاصة بالطالب</span></article><article><b>مستمرة</b><span>متابعة وتقرير بعد كل حصة</span></article></div></div></section>
}

function SharedClosing({ config, videos = [], teachers = [], contactUrl }: Props) {
  return <><PackageIncludes /><NewCountryVideos videos={videos} /><TeacherTrust teachers={teachers} /><section className="new-country-section new-country-closing"><div className="new-country-narrow"><p className="new-country-kicker">خطوة عملية</p><h2>ابدأ بما يناسب أسبوعك الآن</h2><p>أرسل عمر الطالب ومستواه والبرنامج المطلوب، وسنوضح لك الخطوة التالية قبل التسجيل.</p><WhatsApp config={config} contactUrl={contactUrl} /><p className="new-country-independent-note">صفحة مستقلة لـ{config.name} · تعليم أونلاين فقط</p></div></section><CountryFooter config={config} /></>
}

const countryLinks = [
  ["/saudi-arabia", "السعودية", "🇸🇦"], ["/united-arab-emirates", "الإمارات", "🇦🇪"], ["/united-states", "الولايات المتحدة", "🇺🇸"],
  ["/canada", "كندا", "🇨🇦"], ["/united-kingdom", "المملكة المتحدة", "🇬🇧"], ["/australia", "أستراليا", "🇦🇺"],
  ["/germany", "ألمانيا", "🇩🇪"], ["/kuwait", "الكويت", "🇰🇼"],
  ["/qatar", "قطر", "🇶🇦"], ["/oman", "عُمان", "🇴🇲"], ["/jordan", "الأردن", "🇯🇴"],
  ["/bahrain", "البحرين", "🇧🇭"], ["/france", "فرنسا", "🇫🇷"], ["/spain", "إسبانيا", "🇪🇸"],
  ["/netherlands", "هولندا", "🇳🇱"], ["/belgium", "بلجيكا", "🇧🇪"], ["/sweden", "السويد", "🇸🇪"],
] as const

function CountryFooter({ config }: Props) {
  const className = `new-country-footer new-country-footer-${config.variant}`
  return <footer className={className} aria-label={`تذييل صفحة ${config.name}`}>
    <div className="new-country-footer-inner">
      <div className="new-country-footer-brand"><span>{config.flag}</span><div><b>الحافظ · {config.name}</b><small>تعليم فردي أونلاين</small></div></div>
      <div className="new-country-footer-links"><h3>روابط تساعدك على القرار</h3><nav><Link href="/"><Home size={15} /> الرئيسية</Link><Link href="/blog"><Newspaper size={15} /> المدونة</Link><a href="/games"><Gamepad2 size={15} /> الألعاب</a><a href="/library"><BookOpen size={15} /> المكتبة</a></nav></div>
      <div className="new-country-footer-links new-country-footer-countries"><details><summary><Globe2 size={15} /> <span>صفحاتنا حسب الدولة</span><ChevronDown size={16} /></summary><div className="new-country-country-links">{countryLinks.map(([href, name, flag]) => <a href={href} key={href} className={href === `/${config.slug}` ? "is-current" : ""}>{flag} {name}</a>)}</div></details></div>
      <div className="new-country-footer-legal"><h3><Scale size={15} /> الشروط والخصوصية</h3><a href="/privacy">سياسة الخصوصية</a><a href="/terms">شروط الاستخدام</a><a href="/refund-policy">سياسة الاسترداد</a></div>
    </div><div className="new-country-footer-bottom">© 2026 · صفحة {config.name} المستقلة · <a href="/contact">تواصل معنا</a></div>
  </footer>
}

function QatarLayout({ config, videos, teachers, contactUrl }: Props) {
  return <><section className="new-country-intro new-country-intro-qatar"><div className="new-country-orbit" /><div className="new-country-intro-copy"><p className="new-country-kicker"><Sparkles size={16} /> {config.eyebrow}</p><h1>{config.title}</h1><p className="new-country-lead">{config.description}</p><div className="new-country-actions"><WhatsApp config={config} contactUrl={contactUrl} /><a className="new-country-ghost" href="#path">شاهد المسار <ArrowLeft size={17} /></a></div></div><div className="new-country-intro-card"><span>{config.flag}</span><b>من الهدف</b><small>إلى متابعة منتظمة</small></div></section><section id="path" className="new-country-section"><div className="new-country-narrow"><p className="new-country-kicker">ثلاث انتقالات واضحة</p><h2>رحلة لا تبدأ من السعر</h2><Steps config={config} /></div></section><section className="new-country-section new-country-accent"><div className="new-country-narrow"><h2>اختر باقتك بالريال القطري</h2><p>مصفوفة بسيطة تقارن البرنامجين دون بطاقات متشابهة.</p><PriceTable config={config} /></div></section><LocalSection config={config} /><FAQ config={config} /><section className="new-country-note"><b>يوجد باقات مخصصة</b><span>خصم 10٪ للأخوات والإحالة</span></section><SharedClosing config={config} videos={videos} teachers={teachers} contactUrl={contactUrl} /></>
}

function OmanLayout({ config, videos, teachers, contactUrl }: Props) {
  return <><section className="new-country-intro new-country-intro-oman"><div className="new-country-intro-copy"><p className="new-country-kicker">{config.flag} {config.eyebrow}</p><h1>{config.title}</h1><p className="new-country-lead">{config.description}</p><WhatsApp config={config} contactUrl={contactUrl} label="ابدأ بهدوء" /></div><div className="new-country-quiet-card"><span>قبل ��ن تبدأ</span><strong>مستوى الطالب</strong><small>الوقت المتاح · الهدف</small></div></section><section className="new-country-section new-country-paper"><div className="new-country-narrow"><p className="new-country-kicker">منهج متدرج</p><h2>الحفظ والمراجعة في ثلاث حركات</h2><Steps config={config} /></div></section><section className="new-country-section"><div className="new-country-narrow"><h2>اختيار الباقة</h2><PriceTable config={config} compact /></div></section><LocalSection config={config} /><FAQ config={config} /><section className="new-country-note"><b>يوجد باقات مخصصة</b><span>خصم 10٪ للأخوات والإحالة</span></section><SharedClosing config={config} videos={videos} teachers={teachers} contactUrl={contactUrl} /></>
}

function JordanLayout({ config, videos, teachers, contactUrl }: Props) {
  return <><section className="new-country-intro new-country-intro-jordan"><div className="new-country-decision-sheet"><p className="new-country-kicker">{config.flag} {config.eyebrow}</p><h1>{config.title}</h1><p className="new-country-lead">{config.description}</p><WhatsApp config={config} contactUrl={contactUrl} label="اطلب خطة البداية" /></div><div className="new-country-checklist"><span><Check size={16} /> احتياج واضح</span><span><Check size={16} /> وقت مناسب</span><span><Check size={16} /> متابعة منتظمة</span></div></section><section className="new-country-section"><div className="new-country-narrow"><p className="new-country-kicker">ورقة القرار</p><h2>ما الذي نحتاج معرفته أولًا؟</h2><Steps config={config} /></div></section><section className="new-country-section new-country-olive"><div className="new-country-narrow"><h2>سُلّم الباقة الشهرية</h2><PriceTable config={config} /></div></section><LocalSection config={config} /><FAQ config={config} /><section className="new-country-note"><b>يوجد باقات مخصصة</b><span>خصم 10٪ للأخوات والإحالة</span></section><SharedClosing config={config} videos={videos} teachers={teachers} contactUrl={contactUrl} /></>
}

function BahrainLayout({ config, videos, teachers, contactUrl }: Props) {
  return <><section className="new-country-intro new-country-intro-bahrain"><div className="new-country-intro-copy"><p className="new-country-kicker">{config.flag} {config.eyebrow}</p><h1>{config.title}</h1><p className="new-country-lead">{config.description}</p><a className="new-country-cta" href="#week"><CalendarDays size={18} /> ضع الحصة في أسبوعك</a></div><div className="new-country-week-grid">{["السبت","الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس"].map((day, i) => <span key={day} className={i === 2 ? "is-selected" : ""}>{day}</span>)}</div></section><section id="week" className="new-country-section"><div className="new-country-narrow"><p className="new-country-kicker">مخطط أسبوعي</p><h2>ضع الحصة في مكانها ثم اختر المسار</h2><Steps config={config} /></div></section><section className="new-country-section new-country-coral"><div className="new-country-narrow"><h2>قرار الباقة</h2><PriceTable config={config} /></div></section><LocalSection config={config} /><FAQ config={config} /><section className="new-country-note"><b>يوجد باقات مخصصة</b><span>خصم 10٪ للأخوات والإحالة</span></section><SharedClosing config={config} videos={videos} teachers={teachers} contactUrl={contactUrl} /></>
}

function LanguageLayout({ config, videos, teachers, contactUrl }: Props) {
  const isBelgium = config.variant === "belgium"
  return <><section className={`new-country-intro ${isBelgium ? "new-country-intro-belgium" : "new-country-intro-france"}`}><div className="new-country-language-card"><p className="new-country-kicker">{config.flag} {config.eyebrow}</p><h1>{config.title}</h1><p className="new-country-lead">{config.description}</p><div className="new-country-language-pills"><span>العربية</span><span>{isBelgium ? "المنطقة" : "اللغة العربية"}</span><span>{config.currency}</span></div><WhatsApp config={config} contactUrl={contactUrl} label="اسأل عن المسار" /></div></section><section className="new-country-section"><div className="new-country-narrow"><p className="new-country-kicker">بوابة الاختيار</p><h2>{isBelgium ? "البرنامج ثم المنطقة" : "البرنامج ثم اللغة"}</h2><Steps config={config} /></div></section><section className="new-country-section new-country-language-surface"><div className="new-country-narrow"><h2>باقات شهرية واضحة</h2><PriceTable config={config} /></div></section><LocalSection config={config} /><FAQ config={config} /><section className="new-country-note"><b>يوجد باقات مخصصة</b><span>خصم 10٪ للأخوات والإحالة</span></section><SharedClosing config={config} videos={videos} teachers={teachers} contactUrl={contactUrl}/></>
}

function SpainLayout({ config, videos, teachers, contactUrl }: Props) {
  return <><section className="new-country-intro new-country-intro-spain"><div className="new-country-journey"><p className="new-country-kicker">{config.flag} {config.eyebrow}</p><h1>{config.title}</h1><p className="new-country-lead">{config.description}</p><WhatsApp config={config} contactUrl={contactUrl} label="ابدأ التعارف" /></div><div className="new-country-journey-line"><span>تعارف</span><span>اختيار</span><span>أول حصة</span></div></section><section className="new-country-section"><div className="new-country-narrow"><p className="new-country-kicker">رحلة الأسرة</p><h2>ثلاث محطات قبل الباقة</h2><Steps config={config} /></div></section><section className="new-country-section new-country-sun"><div className="new-country-narrow"><h2>باقات بسيطة باليورو</h2><PriceTable config={config} /></div></section><LocalSection config={config} /><FAQ config={config} /><section className="new-country-note"><b>يوجد باقات مخصصة</b><span>خصم 10٪ للأخوات والإحالة</span></section><SharedClosing config={config} videos={videos} teachers={teachers} contactUrl={contactUrl}/></>
}

function NetherlandsLayout({ config, videos, teachers, contactUrl }: Props) {
  return <><section className="new-country-intro new-country-intro-netherlands"><div className="new-country-timebar"><span>الآن</span><b>اختيار موعدك المحلي</b><span>{config.timezone}</span></div><div className="new-country-intro-copy"><p className="new-country-kicker">{config.flag} {config.eyebrow}</p><h1>{config.title}</h1><p className="new-country-lead">{config.description}</p><WhatsApp config={config} contactUrl={contactUrl} label="اختَر وقتك" /></div></section><section className="new-country-section"><div className="new-country-narrow"><p className="new-country-kicker">ثلاث خطوات زمنية</p><h2>الوقت أولًا، ثم البرنامج</h2><Steps config={config} /></div></section><section className="new-country-section new-country-blue-surface"><div className="new-country-narrow"><h2>مصفوفة الباقات الشهرية</h2><PriceTable config={config} /></div></section><LocalSection config={config} /><FAQ config={config} /><section className="new-country-note"><b>يوجد باقات مخصصة</b><span>خصم 10٪ للأخوات والإحالة</span></section><SharedClosing config={config} videos={videos} teachers={teachers} contactUrl={contactUrl}/></>
}

function SwedenLayout({ config, videos, teachers, contactUrl }: Props) {
  return <><section className="new-country-intro new-country-intro-sweden"><div className="new-country-sweden-sun" /><div className="new-country-intro-copy"><p className="new-country-kicker">{config.flag} {config.eyebrow}</p><h1>{config.title}</h1><p className="new-country-lead">{config.description}</p><WhatsApp config={config} contactUrl={contactUrl} label="ابدأ باقتك" /></div><div className="new-country-progress-ring"><span>01</span><small>الخطوة التالية</small></div></section><section className="new-country-section"><div className="new-country-narrow"><p className="new-country-kicker">خريطة الاستمرارية</p><h2>اختر عدد حصص يمكن المحافظة عليه</h2><Steps config={config} /></div></section><section className="new-country-section new-country-swedish-surface"><div className="new-country-narrow"><h2>مقياس الباقات</h2><PriceTable config={config} /></div></section><LocalSection config={config} /><FAQ config={config} /><section className="new-country-note"><b>يوجد باقات مخصصة</b><span>خصم 10٪ للأخوات والإحالة</span></section><SharedClosing config={config} videos={videos} teachers={teachers} contactUrl={contactUrl}/></>
}

export async function NewCountryLanding({ config }: Props) {
  const [areaData, videos, teachers] = await Promise.all([
    getAreaLandingData(config.slug),
    getPublishedClassroomVideos(),
    getTeachers(),
  ])
  const databasePlans = areaData.packages.map(toAreaDisplayPlan)
  const quranPlans = databasePlans.filter((plan) => plan.program === "quran")
  const arabicPlans = databasePlans.filter((plan) => plan.program === "arabic")
  const contentValue = (key: string) => areaLocalized(areaData.content.find((item) => item.content_key === key), "ar")
  const dynamicConfig: NewCountryConfig = {
    ...config,
    eyebrow: contentValue("eyebrow") || config.eyebrow,
    title: contentValue("page_title") || config.title,
    description: contentValue("page_description") || config.description,
    localLead: contentValue("local_lead") || config.localLead,
    currencyCode: areaData.area?.currency_symbol || areaData.area?.currency_code || config.currencyCode,
    quranPrices: quranPlans.length >= 4 ? quranPlans.slice(0, 4).map((plan) => plan.price) : config.quranPrices,
    arabicPrices: arabicPlans.length >= 4 ? arabicPlans.slice(0, 4).map((plan) => plan.price) : config.arabicPrices,
    cities: areaData.cities.length ? areaData.cities.map((city) => city.name_ar) : config.cities,
    faq: areaData.faq.length ? areaData.faq.map((item) => [item.question_ar, item.answer_ar] as [string, string]) : config.faq,
    theme: areaData.theme ? { primary: areaData.theme.primary_color, accent: areaData.theme.accent_color, background: areaData.theme.background_color, surface: areaData.theme.secondary_color, ink: areaData.theme.text_color } : config.theme,
  }
  const configuredWhatsApp = getAreaLinkHref(areaData.links, "whatsapp", "https://bit.ly/4aJfOl6")
  const contactUrl = getAreaWhatsAppUrl(areaData.links, "حصة تجريبية مجانية", configuredWhatsApp)
  const props = { config: dynamicConfig, videos, teachers, contactUrl }
  if (dynamicConfig.variant === "qatar") return <main dir="rtl" className="new-country-page" style={{"--country-primary":dynamicConfig.theme.primary,"--country-accent":dynamicConfig.theme.accent,"--country-background":dynamicConfig.theme.background,"--country-surface":dynamicConfig.theme.surface,"--country-ink":dynamicConfig.theme.ink} as React.CSSProperties}><QatarLayout {...props}/></main>
  if (dynamicConfig.variant === "oman") return <main dir="rtl" className="new-country-page" style={{"--country-primary":dynamicConfig.theme.primary,"--country-accent":dynamicConfig.theme.accent,"--country-background":dynamicConfig.theme.background,"--country-surface":dynamicConfig.theme.surface,"--country-ink":dynamicConfig.theme.ink} as React.CSSProperties}><OmanLayout {...props}/></main>
  if (dynamicConfig.variant === "jordan") return <main dir="rtl" className="new-country-page" style={{"--country-primary":dynamicConfig.theme.primary,"--country-accent":dynamicConfig.theme.accent,"--country-background":dynamicConfig.theme.background,"--country-surface":dynamicConfig.theme.surface,"--country-ink":dynamicConfig.theme.ink} as React.CSSProperties}><JordanLayout {...props}/></main>
  if (dynamicConfig.variant === "bahrain") return <main dir="rtl" className="new-country-page" style={{"--country-primary":dynamicConfig.theme.primary,"--country-accent":dynamicConfig.theme.accent,"--country-background":dynamicConfig.theme.background,"--country-surface":dynamicConfig.theme.surface,"--country-ink":dynamicConfig.theme.ink} as React.CSSProperties}><BahrainLayout {...props}/></main>
  if (dynamicConfig.variant === "spain") return <main dir="rtl" className="new-country-page" style={{"--country-primary":dynamicConfig.theme.primary,"--country-accent":dynamicConfig.theme.accent,"--country-background":dynamicConfig.theme.background,"--country-surface":dynamicConfig.theme.surface,"--country-ink":dynamicConfig.theme.ink} as React.CSSProperties}><SpainLayout {...props}/></main>
  if (dynamicConfig.variant === "netherlands") return <main dir="rtl" className="new-country-page" style={{"--country-primary":dynamicConfig.theme.primary,"--country-accent":dynamicConfig.theme.accent,"--country-background":dynamicConfig.theme.background,"--country-surface":dynamicConfig.theme.surface,"--country-ink":dynamicConfig.theme.ink} as React.CSSProperties}><NetherlandsLayout {...props}/></main>
  if (dynamicConfig.variant === "sweden") return <main dir="rtl" className="new-country-page" style={{"--country-primary":dynamicConfig.theme.primary,"--country-accent":dynamicConfig.theme.accent,"--country-background":dynamicConfig.theme.background,"--country-surface":dynamicConfig.theme.surface,"--country-ink":dynamicConfig.theme.ink} as React.CSSProperties}><SwedenLayout {...props}/></main>
  return <main dir="rtl" className="new-country-page" style={{"--country-primary":dynamicConfig.theme.primary,"--country-accent":dynamicConfig.theme.accent,"--country-background":dynamicConfig.theme.background,"--country-surface":dynamicConfig.theme.surface,"--country-ink":dynamicConfig.theme.ink} as React.CSSProperties}><LanguageLayout {...props}/></main>
}
