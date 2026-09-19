import Link from "next/link"
import { ArrowLeft, Check, Clock3, MessageCircle, MapPin, Sparkles, CalendarDays, BookOpen, Gamepad2, Scale, Home, Newspaper, Globe2 } from "lucide-react"
import type { NewCountryConfig } from "@/lib/new-country-pages"

type Props = { config: NewCountryConfig }

function WhatsApp({ config, label = "احجز الحصة التجريبية" }: { config: NewCountryConfig; label?: string }) {
  const href = `https://bit.ly/4aJfOl6?text=${encodeURIComponent(config.whatsappMessage)}`
  return <a href={href} target="_blank" rel="noreferrer" className="new-country-cta"><MessageCircle size={18} />{label}</a>
}

function PriceTable({ config, compact = false }: { config: NewCountryConfig; compact?: boolean }) {
  const rows = [4, 8, 12, 16]
  const mode = ["qatar", "france", "sweden"].includes(config.variant) ? "cards" : ["oman", "spain", "belgium"].includes(config.variant) ? "rail" : ["jordan", "netherlands"].includes(config.variant) ? "columns" : "table"
  if (mode === "cards") return <div className={`new-country-price-cards ${compact ? "is-compact" : ""}`}>{rows.map((sessions, index) => <article key={sessions}><span>{sessions} حصص</span><b>{config.quranPrices[index]} {config.currencyCode}</b><small>قرآن</small><strong>{config.arabicPrices[index]} {config.currencyCode}</strong><small>عربية</small></article>)}</div>
  if (mode === "rail") return <div className="new-country-price-rail">{rows.map((sessions, index) => <article key={sessions}><div><b>{sessions}</b><small>حصص</small></div><span><strong>{config.quranPrices[index]} {config.currencyCode}</strong><small>تحفيظ القرآن</small></span><span><strong>{config.arabicPrices[index]} {config.currencyCode}</strong><small>تأسيس العربية</small></span></article>)}</div>
  if (mode === "columns") return <div className="new-country-price-columns"><div className="new-country-price-column"><h3>تحفيظ القرآن</h3>{rows.map((sessions, index) => <p key={sessions}><span>{sessions} حصص</span><b>{config.quranPrices[index]} {config.currencyCode}</b></p>)}</div><div className="new-country-price-column is-secondary"><h3>تأسيس العربية</h3>{rows.map((sessions, index) => <p key={sessions}><span>{sessions} حصص</span><b>{config.arabicPrices[index]} {config.currencyCode}</b></p>)}</div></div>
  return <div className={`new-country-price-table ${compact ? "new-country-price-table-compact" : ""}`}><div className="new-country-price-head"><span>الإيقاع الشهري</span><span>تحفيظ القرآن</span><span>تأسيس العربية</span></div>{rows.map((sessions, index) => <div className="new-country-price-row" key={sessions}><span><b>{sessions}</b> حصص <small>· {sessions / 4} أسبوعيًا</small></span><strong>{config.quranPrices[index]} {config.currencyCode}</strong><strong>{config.arabicPrices[index]} {config.currencyCode}</strong></div>)}</div>
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

function SharedClosing({ config }: Props) {
  return <><section className="new-country-section new-country-closing"><div className="new-country-narrow"><p className="new-country-kicker">خطوة عملية</p><h2>ابدأ بما يناسب أسبوعك الآن</h2><p>أرسل عمر الطالب ومستواه والبرنامج المطلوب، وسنوضح لك الخطوة التالية قبل التسجيل.</p><WhatsApp config={config} /><p className="new-country-independent-note">صفحة مستقلة لـ{config.name} · تعليم أونلاين فقط</p></div></section><CountryFooter config={config} /></>
}

const countryLinks = [
  ["/qatar", "قطر", "🇶🇦"], ["/oman", "عُمان", "🇴🇲"], ["/jordan", "الأردن", "🇯🇴"],
  ["/bahrain", "البحرين", "🇧🇭"], ["/france", "فرنسا", "🇫🇷"], ["/spain", "إسبانيا", "🇪🇸"],
  ["/netherlands", "هولندا", "🇳🇱"], ["/belgium", "بلجيكا", "🇧🇪"], ["/sweden", "السويد", "🇸🇪"],
] as const

function CountryFooter({ config }: Props) {
  const className = `new-country-footer new-country-footer-${config.variant}`
  return <footer className={className} aria-label={`تذييل صفحة ${config.name}`}>
    <div className="new-country-footer-inner">
      <div className="new-country-footer-brand"><span>{config.flag}</span><div><b>الحافظ · {config.name}</b><small>تعليم فردي أونلاين</small></div></div>
      <div className="new-country-footer-links"><h3>روابط تساعدك على القرار</h3><nav><a href="/"><Home size={15} /> الرئيسية</a><a href="/blog"><Newspaper size={15} /> المدونة</a><a href="/games"><Gamepad2 size={15} /> الألعاب</a><a href="/library"><BookOpen size={15} /> المكتبة</a></nav></div>
      <div className="new-country-footer-links"><h3><Globe2 size={15} /> صفحاتنا حسب الدولة</h3><div className="new-country-country-links">{countryLinks.map(([href, name, flag]) => <a href={href} key={href} className={href === `/${config.slug}` ? "is-current" : ""}>{flag} {name}</a>)}</div></div>
      <div className="new-country-footer-legal"><h3><Scale size={15} /> الشروط والخصوصية</h3><a href="/privacy">سياسة الخصوصية</a><a href="/terms">شروط الاستخدام</a><a href="/refund-policy">سياسة الاسترداد</a></div>
    </div><div className="new-country-footer-bottom">© 2026 · صفحة {config.name} المستقلة · <a href="/contact">تواصل معنا</a></div>
  </footer>
}

function QatarLayout({ config }: Props) {
  return <><section className="new-country-intro new-country-intro-qatar"><div className="new-country-orbit" /><div className="new-country-intro-copy"><p className="new-country-kicker"><Sparkles size={16} /> {config.eyebrow}</p><h1>{config.title}</h1><p className="new-country-lead">{config.description}</p><div className="new-country-actions"><WhatsApp config={config} /><a className="new-country-ghost" href="#path">شاهد المسار <ArrowLeft size={17} /></a></div></div><div className="new-country-intro-card"><span>{config.flag}</span><b>من الهدف</b><small>إلى متابعة منتظمة</small></div></section><section id="path" className="new-country-section"><div className="new-country-narrow"><p className="new-country-kicker">ثلاث انتقالات واضحة</p><h2>رحلة لا تبدأ من السعر</h2><Steps config={config} /></div></section><section className="new-country-section new-country-accent"><div className="new-country-narrow"><h2>اختر إيقاعك بالريال القطري</h2><p>مصفوفة بسيطة تقارن البرنامجين دون بطاقات متشابهة.</p><PriceTable config={config} /></div></section><LocalSection config={config} /><FAQ config={config} /><section className="new-country-note"><b>يوجد باقات مخصصة</b><span>خصم 10٪ للأخوات والإحالة</span></section><SharedClosing config={config} /></>
}

function OmanLayout({ config }: Props) {
  return <><section className="new-country-intro new-country-intro-oman"><div className="new-country-intro-copy"><p className="new-country-kicker">{config.flag} {config.eyebrow}</p><h1>{config.title}</h1><p className="new-country-lead">{config.description}</p><WhatsApp config={config} label="ابدأ بهدوء" /></div><div className="new-country-quiet-card"><span>قبل أن تبدأ</span><strong>مستوى الطالب</strong><small>الوقت المتاح · الهدف</small></div></section><section className="new-country-section new-country-paper"><div className="new-country-narrow"><p className="new-country-kicker">منهج متدرج</p><h2>الحفظ والمراجعة في ثلاث حركات</h2><Steps config={config} /></div></section><section className="new-country-section"><div className="new-country-narrow"><h2>اختيار الإيقاع</h2><PriceTable config={config} compact /></div></section><LocalSection config={config} /><FAQ config={config} /><section className="new-country-note"><b>يوجد باقات مخصصة</b><span>خصم 10٪ للأخوات والإحالة</span></section><SharedClosing config={config} /></>
}

function JordanLayout({ config }: Props) {
  return <><section className="new-country-intro new-country-intro-jordan"><div className="new-country-decision-sheet"><p className="new-country-kicker">{config.flag} {config.eyebrow}</p><h1>{config.title}</h1><p className="new-country-lead">{config.description}</p><WhatsApp config={config} label="اطلب خطة البداية" /></div><div className="new-country-checklist"><span><Check size={16} /> احتياج واضح</span><span><Check size={16} /> وقت مناسب</span><span><Check size={16} /> متابعة منتظمة</span></div></section><section className="new-country-section"><div className="new-country-narrow"><p className="new-country-kicker">ورقة القرار</p><h2>ما الذي نحتاج معرفته أولًا؟</h2><Steps config={config} /></div></section><section className="new-country-section new-country-olive"><div className="new-country-narrow"><h2>سُلّم الوتيرة الشهرية</h2><PriceTable config={config} /></div></section><LocalSection config={config} /><FAQ config={config} /><section className="new-country-note"><b>يوجد باقات مخصصة</b><span>خصم 10٪ للأخوات والإحالة</span></section><SharedClosing config={config} /></>
}

function BahrainLayout({ config }: Props) {
  return <><section className="new-country-intro new-country-intro-bahrain"><div className="new-country-intro-copy"><p className="new-country-kicker">{config.flag} {config.eyebrow}</p><h1>{config.title}</h1><p className="new-country-lead">{config.description}</p><a className="new-country-cta" href="#week"><CalendarDays size={18} /> ضع الحصة في أسبوعك</a></div><div className="new-country-week-grid">{["السبت","الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس"].map((day, i) => <span key={day} className={i === 2 ? "is-selected" : ""}>{day}</span>)}</div></section><section id="week" className="new-country-section"><div className="new-country-narrow"><p className="new-country-kicker">مخطط أسبوعي</p><h2>ضع الحصة في مكانها ثم اختر المسار</h2><Steps config={config} /></div></section><section className="new-country-section new-country-coral"><div className="new-country-narrow"><h2>قرار الباقة</h2><PriceTable config={config} /></div></section><LocalSection config={config} /><FAQ config={config} /><section className="new-country-note"><b>يوجد باقات مخصصة</b><span>خصم 10٪ للأخوات والإحالة</span></section><SharedClosing config={config} /></>
}

function LanguageLayout({ config }: Props) {
  const isBelgium = config.variant === "belgium"
  return <><section className={`new-country-intro ${isBelgium ? "new-country-intro-belgium" : "new-country-intro-france"}`}><div className="new-country-language-card"><p className="new-country-kicker">{config.flag} {config.eyebrow}</p><h1>{config.title}</h1><p className="new-country-lead">{config.description}</p><div className="new-country-language-pills"><span>العربية</span><span>{isBelgium ? "المنطقة" : "لغة التواصل حسب التوفر"}</span><span>{config.currency}</span></div><WhatsApp config={config} label="اسأل عن المسار" /></div></section><section className="new-country-section"><div className="new-country-narrow"><p className="new-country-kicker">بوابة الاختيار</p><h2>{isBelgium ? "البرنامج ثم المنطقة" : "البرنامج ثم اللغة"}</h2><Steps config={config} /></div></section><section className="new-country-section new-country-language-surface"><div className="new-country-narrow"><h2>إيقاع شهري واضح</h2><PriceTable config={config} /></div></section><LocalSection config={config} /><FAQ config={config} /><section className="new-country-note"><b>يوجد باقات مخصصة</b><span>خصم 10٪ للأخوات والإحالة</span></section><SharedClosing config={config}/></>
}

function SpainLayout({ config }: Props) {
  return <><section className="new-country-intro new-country-intro-spain"><div className="new-country-journey"><p className="new-country-kicker">{config.flag} {config.eyebrow}</p><h1>{config.title}</h1><p className="new-country-lead">{config.description}</p><WhatsApp config={config} label="ابدأ التعارف" /></div><div className="new-country-journey-line"><span>تعارف</span><span>اختيار</span><span>أول حصة</span></div></section><section className="new-country-section"><div className="new-country-narrow"><p className="new-country-kicker">رحلة الأسرة</p><h2>ثلاث محطات قبل الباقة</h2><Steps config={config} /></div></section><section className="new-country-section new-country-sun"><div className="new-country-narrow"><h2>باقات بسيطة باليورو</h2><PriceTable config={config} /></div></section><LocalSection config={config} /><FAQ config={config} /><section className="new-country-note"><b>يوجد باقات مخصصة</b><span>خصم 10٪ للأخوات والإحالة</span></section><SharedClosing config={config}/></>
}

function NetherlandsLayout({ config }: Props) {
  return <><section className="new-country-intro new-country-intro-netherlands"><div className="new-country-timebar"><span>الآن</span><b>اختيار موعدك المحلي</b><span>{config.timezone}</span></div><div className="new-country-intro-copy"><p className="new-country-kicker">{config.flag} {config.eyebrow}</p><h1>{config.title}</h1><p className="new-country-lead">{config.description}</p><WhatsApp config={config} label="اختَر وقتك" /></div></section><section className="new-country-section"><div className="new-country-narrow"><p className="new-country-kicker">ثلاث خطوات زمنية</p><h2>الوقت أولًا، ثم المسار</h2><Steps config={config} /></div></section><section className="new-country-section new-country-blue-surface"><div className="new-country-narrow"><h2>مصفوفة الكثافة الشهرية</h2><PriceTable config={config} /></div></section><LocalSection config={config} /><FAQ config={config} /><section className="new-country-note"><b>يوجد باقات مخصصة</b><span>خصم 10٪ للأخوات والإحالة</span></section><SharedClosing config={config}/></>
}

function SwedenLayout({ config }: Props) {
  return <><section className="new-country-intro new-country-intro-sweden"><div className="new-country-sweden-sun" /><div className="new-country-intro-copy"><p className="new-country-kicker">{config.flag} {config.eyebrow}</p><h1>{config.title}</h1><p className="new-country-lead">{config.description}</p><WhatsApp config={config} label="ابدأ إيقاعك" /></div><div className="new-country-progress-ring"><span>01</span><small>الخطوة التالية</small></div></section><section className="new-country-section"><div className="new-country-narrow"><p className="new-country-kicker">خريطة الاستمرارية</p><h2>اختر إيقاعًا يمكن المحافظة عليه</h2><Steps config={config} /></div></section><section className="new-country-section new-country-swedish-surface"><div className="new-country-narrow"><h2>مقياس الإيقاع</h2><PriceTable config={config} /></div></section><LocalSection config={config} /><FAQ config={config} /><section className="new-country-note"><b>يوجد باقات مخصصة</b><span>خصم 10٪ للأخوات والإحالة</span></section><SharedClosing config={config}/></>
}

export function NewCountryLanding({ config }: Props) {
  if (config.variant === "qatar") return <main dir="rtl" className="new-country-page" style={{"--country-primary":config.theme.primary,"--country-accent":config.theme.accent,"--country-background":config.theme.background,"--country-surface":config.theme.surface,"--country-ink":config.theme.ink} as React.CSSProperties}><QatarLayout config={config}/></main>
  if (config.variant === "oman") return <main dir="rtl" className="new-country-page" style={{"--country-primary":config.theme.primary,"--country-accent":config.theme.accent,"--country-background":config.theme.background,"--country-surface":config.theme.surface,"--country-ink":config.theme.ink} as React.CSSProperties}><OmanLayout config={config}/></main>
  if (config.variant === "jordan") return <main dir="rtl" className="new-country-page" style={{"--country-primary":config.theme.primary,"--country-accent":config.theme.accent,"--country-background":config.theme.background,"--country-surface":config.theme.surface,"--country-ink":config.theme.ink} as React.CSSProperties}><JordanLayout config={config}/></main>
  if (config.variant === "bahrain") return <main dir="rtl" className="new-country-page" style={{"--country-primary":config.theme.primary,"--country-accent":config.theme.accent,"--country-background":config.theme.background,"--country-surface":config.theme.surface,"--country-ink":config.theme.ink} as React.CSSProperties}><BahrainLayout config={config}/></main>
  if (config.variant === "spain") return <main dir="rtl" className="new-country-page" style={{"--country-primary":config.theme.primary,"--country-accent":config.theme.accent,"--country-background":config.theme.background,"--country-surface":config.theme.surface,"--country-ink":config.theme.ink} as React.CSSProperties}><SpainLayout config={config}/></main>
  if (config.variant === "netherlands") return <main dir="rtl" className="new-country-page" style={{"--country-primary":config.theme.primary,"--country-accent":config.theme.accent,"--country-background":config.theme.background,"--country-surface":config.theme.surface,"--country-ink":config.theme.ink} as React.CSSProperties}><NetherlandsLayout config={config}/></main>
  if (config.variant === "sweden") return <main dir="rtl" className="new-country-page" style={{"--country-primary":config.theme.primary,"--country-accent":config.theme.accent,"--country-background":config.theme.background,"--country-surface":config.theme.surface,"--country-ink":config.theme.ink} as React.CSSProperties}><SwedenLayout config={config}/></main>
  return <main dir="rtl" className="new-country-page" style={{"--country-primary":config.theme.primary,"--country-accent":config.theme.accent,"--country-background":config.theme.background,"--country-surface":config.theme.surface,"--country-ink":config.theme.ink} as React.CSSProperties}><LanguageLayout config={config}/></main>
}
