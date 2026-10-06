import Link from "next/link"
import { ArrowLeft, Check, Clock3, MessageCircle, MapPin, Sparkles, CalendarDays, BookOpen, Gamepad2, Scale, Home, Newspaper, Globe2, ChevronDown } from "lucide-react"
import type { NewCountryConfig } from "@/lib/new-country-pages"
import { areaLocalized, getAreaLandingData, getAreaLinkHref, getAreaWhatsAppUrl, toAreaDisplayPlan, type AreaDisplayPlan, type AreaLink } from "@/lib/country-content"
import { getPublishedClassroomVideos, type LandingVideo } from "@/lib/classroom-videos"
import { getTeachers, type Teacher } from "@/lib/data-store"
import { NewCountryVideos } from "@/components/new-country-videos"
import { CountryLearningHub } from "@/components/country-learning-hub"
import { CountryServiceLinks } from "@/components/country-service-links"
import { countryPages } from "@/components/layout/country-pages-section"
import { germanyLandingConfig } from "@/lib/germany-landing-config"
import { austriaLandingConfig } from "@/lib/austria-landing-config"
import { AustriaPricingPanel } from "@/app/austria/austria-pricing-panel"
import { AustriaVideoWindow } from "@/app/austria/austria-video-window"

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

function PackageIncludes() {
  return <section className="new-country-package-includes"><div className="new-country-narrow"><p className="new-country-kicker">محتوى كل باقة</p><div className="new-country-package-features"><article><b>30 دقيقة</b><span>مدة كل حصة</span></article><article><b>مجانية</b><span>حصة تجريبية قبل الاشتراك</span></article><article><b>فردية</b><span>حصة خاصة بالطالب</span></article><article><b>مستمرة</b><span>متابعة وتقرير بعد كل حصة</span></article></div></div></section>
}

function SharedClosing({ config, videos = [], contactUrl }: Props) {
  return <><PackageIncludes /><NewCountryVideos videos={videos} /><CountryLearningHub slug={config.variant} variant="minimal" /><section className="new-country-section new-country-closing"><div className="new-country-narrow"><p className="new-country-kicker">خطوة عملية</p><h2>ابدأ بما يناسب أسبوعك الآن</h2><p>أرسل عمر الطالب ومستواه والبرنامج المطلوب، وسنوضح لك الخطوة التالية قبل التسجيل.</p><WhatsApp config={config} contactUrl={contactUrl} /><p className="new-country-independent-note">صفحة مستقلة لـ{config.name} · تعليم أونلاين فقط</p></div></section><CountryFooter config={config} /></>
}

const countryLinks = [
  ["/saudi-arabia", "السعودية", "🇸🇦"], ["/united-arab-emirates", "الإمارات", "🇦🇪"], ["/united-states", "الولايات المتحدة", "🇺🇸"],
  ["/canada", "كندا", "🇨🇦"], ["/united-kingdom", "المملكة المتحدة", "🇬🇧"], ["/australia", "أستراليا", "🇦🇺"],
  ["/austria", "النمسا", "🇦🇹"], ["/germany", "ألمانيا", "🇩🇪"], ["/kuwait", "الكويت", "🇰🇼"],
  ["/qatar", "قطر", "🇶🇦"], ["/oman", "عُمان", "🇴🇲"], ["/jordan", "الأردن", "🇯🇴"],
  ["/bahrain", "البحرين", "🇧🇭"], ["/france", "فرنسا", "🇫🇷"], ["/spain", "إسبانيا", "🇪🇸"],
  ["/netherlands", "هولندا", "🇳🇱"], ["/belgium", "بلجيكا", "🇧🇪"], ["/sweden", "السويد", "🇸🇪"], ["/south-africa", "جنوب أفريقيا", "🇿🇦"],
] as const

function CountryFooter({ config }: Props) {
  const className = `new-country-footer new-country-footer-${config.variant}`
  return <footer className={className} aria-label={`تذييل صفحة ${config.name}`}>
    <div className="new-country-footer-inner">
      <div className="new-country-footer-brand"><span>{config.flag}</span><div><b>الحافظ · {config.name}</b><small>تعليم فردي أونلاين</small></div></div>
      <div className="new-country-footer-links"><h3>روابط تساعدك على القرار</h3><nav><Link href="/"><Home size={15} /> الرئيسية</Link><Link href="/blog"><Newspaper size={15} /> المدونة</Link><Link href="/games"><Gamepad2 size={15} /> الألعاب</Link><Link href="/library"><BookOpen size={15} /> المكتبة</Link></nav></div>
      <div className="new-country-footer-links new-country-footer-countries"><details><summary><Globe2 size={15} /> <span>صفحاتنا حسب الدولة</span><ChevronDown size={16} /></summary><div className="new-country-country-links">{countryLinks.map(([href, name, flag]) => <a href={href} key={href} className={href === `/${config.slug}` ? "is-current" : ""}>{flag} {name}</a>)}</div></details></div>
      <div className="new-country-footer-legal"><h3><Scale size={15} /> الشروط والخصوصية</h3><a href="/privacy">سياسة الخصوصية</a><a href="/terms">شروط الاستخدام</a><a href="/refund-policy">سياسة الاسترداد</a></div>
    </div><div className="new-country-footer-bottom">© 2026 · صفحة {config.name} المستقلة · <a href="/contact">تواصل معنا</a></div>
  </footer>
}

function QatarLayout({ config, videos, teachers, contactUrl }: Props) {
  return <><section className="new-country-intro new-country-intro-qatar"><div className="new-country-orbit" /><div className="new-country-intro-copy"><p className="new-country-kicker"><Sparkles size={16} /> {config.eyebrow}</p><h1>{config.title}</h1><p className="new-country-lead">{config.description}</p><div className="new-country-actions"><WhatsApp config={config} contactUrl={contactUrl} /><a className="new-country-ghost" href="#path">شاهد المسار <ArrowLeft size={17} /></a></div></div><div className="new-country-intro-card"><span>{config.flag}</span><b>من الهدف</b><small>إلى متابعة منتظمة</small></div></section><section id="path" className="new-country-section"><div className="new-country-narrow"><p className="new-country-kicker">ثلاث انتقالات واضحة</p><h2>رحلة لا تبدأ من السعر</h2><Steps config={config} /></div></section><section className="new-country-section new-country-accent"><div className="new-country-narrow"><h2>اختر باقتك بالريال القطري</h2><p>مصفوفة بسيطة تقارن البرنامجين دون بطاقات متشابهة.</p><PriceTable config={config} /></div></section><LocalSection config={config} /><FAQ config={config} /><section className="new-country-note"><b>يوجد باقات مخصصة</b><span>خصم 10٪ للأخوات والإحالة</span></section><SharedClosing config={config} videos={videos} teachers={teachers} contactUrl={contactUrl} /></>
}

function OmanLayout({ config, videos, teachers, contactUrl }: Props) {
  return <><section className="new-country-intro new-country-intro-oman"><div className="new-country-intro-copy"><p className="new-country-kicker">{config.flag} {config.eyebrow}</p><h1>{config.title}</h1><p className="new-country-lead">{config.description}</p><WhatsApp config={config} contactUrl={contactUrl} label="ابدأ بهدوء" /></div><div className="new-country-quiet-card"><span>قبل أن تبدأ</span><strong>مستوى الطالب</strong><small>الوقت المتاح · الهدف</small></div></section><section className="new-country-section new-country-paper"><div className="new-country-narrow"><p className="new-country-kicker">منهج متدرج</p><h2>الحفظ والمراجعة في ثلاث حركات</h2><Steps config={config} /></div></section><section className="new-country-section"><div className="new-country-narrow"><h2>اختيار الباقة</h2><PriceTable config={config} compact /></div></section><LocalSection config={config} /><FAQ config={config} /><section className="new-country-note"><b>يوجد باقات مخصصة</b><span>خصم 10٪ للأخوات والإحالة</span></section><SharedClosing config={config} videos={videos} teachers={teachers} contactUrl={contactUrl} /></>
}

function JordanLayout({ config, videos, teachers, contactUrl }: Props) {
  return <><section className="new-country-intro new-country-intro-jordan"><div className="new-country-decision-sheet"><p className="new-country-kicker">{config.flag} {config.eyebrow}</p><h1>{config.title}</h1><p className="new-country-lead">{config.description}</p><WhatsApp config={config} contactUrl={contactUrl} label="اطلب خطة البداية" /></div><div className="new-country-checklist"><span><Check size={16} /> احتياج واضح</span><span><Check size={16} /> وقت مناسب</span><span><Check size={16} /> متابعة منتظمة</span></div></section><section className="new-country-section"><div className="new-country-narrow"><p className="new-country-kicker">ورقة القرار</p><h2>ما الذي نحتاج معرفته أولًا؟</h2><Steps config={config} /></div></section><section className="new-country-section new-country-olive"><div className="new-country-narrow"><h2>سُلّم الباقة الشهرية</h2><PriceTable config={config} /></div></section><LocalSection config={config} /><FAQ config={config} /><section className="new-country-note"><b>يوجد باقات مخصصة</b><span>خصم 10٪ للأخوات والإحالة</span></section><SharedClosing config={config} videos={videos} teachers={teachers} contactUrl={contactUrl} /></>
}

function BahrainLayout({ config, videos, teachers, contactUrl }: Props) {
  return <><section className="new-country-intro new-country-intro-bahrain"><div className="new-country-intro-copy"><p className="new-country-kicker">{config.flag} {config.eyebrow}</p><h1>{config.title}</h1><p className="new-country-lead">{config.description}</p><a className="new-country-cta" href="#week"><CalendarDays size={18} /> ضع الحصة في أسبوعك</a></div><div className="new-country-week-grid">{["السبت","الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس"].map((day, i) => <span key={day} className={i === 2 ? "is-selected" : ""}>{day}</span>)}</div></section><section id="week" className="new-country-section"><div className="new-country-narrow"><p className="new-country-kicker">مخطط أسبوعي</p><h2>ضع الحصة في مكانها ثم اختر المسار</h2><Steps config={config} /></div></section><section className="new-country-section new-country-coral"><div className="new-country-narrow"><h2>قرار الباقة</h2><PriceTable config={config} /></div></section><LocalSection config={config} /><FAQ config={config} /><section className="new-country-note"><b>يوجد باقات مخصصة</b><span>خصم 10٪ للأخوات والإحالة</span></section><SharedClosing config={config} videos={videos} teachers={teachers} contactUrl={contactUrl} /></>
}

function AustriaLayout({ config, videos, contactUrl, programContactUrl, timezoneLabel }: Props & { programContactUrl: string; timezoneLabel: string }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", "@id": `${austriaLandingConfig.seo.canonical}#webpage`, url: austriaLandingConfig.seo.canonical, name: config.seoTitle, description: config.seoDescription, inLanguage: "ar" },
    { "@type": "EducationalOrganization", "@id": `${austriaLandingConfig.seo.canonical}#organization`, name: "أكاديمية الحافظ المتميز", url: "https://quran-elhafez.com/", areaServed: { "@type": "Country", name: "Austria" } },
    { "@type": "Course", name: "تحفيظ القرآن أونلاين في النمسا", description: "حصص فردية للحفظ والمراجعة والقراءة عبر الإنترنت.", provider: { "@id": `${austriaLandingConfig.seo.canonical}#organization` }, offers: config.quranPrices.map((price, index) => ({ "@type": "Offer", price, priceCurrency: "EUR", category: `${[4, 8, 12, 16][index]} حصص شهريًا`, url: austriaLandingConfig.seo.canonical })) },
    { "@type": "Course", name: "تأسيس العربية أونلاين في النمسا", description: "حصص فردية لبناء أساس القراءة والفهم بالعربية عبر الإنترنت.", provider: { "@id": `${austriaLandingConfig.seo.canonical}#organization` }, offers: config.arabicPrices.map((price, index) => ({ "@type": "Offer", price, priceCurrency: "EUR", category: `${[4, 8, 12, 16][index]} حصص شهريًا`, url: austriaLandingConfig.seo.canonical })) },
    { "@type": "FAQPage", mainEntity: config.faq.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) },
  ] }
  return <>
    <header className="border-b border-[#F4DDE5] bg-[#FFF9F2] px-5 py-4 sm:px-8"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4"><span className="font-black tracking-wide">النمسا · القرآن والعربية</span><a href={contactUrl} target="_blank" rel="noreferrer" className="rounded-full bg-[#4B3B67] px-4 py-2 text-sm font-black text-white">احجز الحصة التجريبية</a></div></header>
    <section className="relative overflow-hidden bg-[#4B3B67] px-5 pb-20 pt-16 text-[#FFF9F2] sm:px-8 lg:pb-28"><div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true"><div className="absolute -right-10 top-12 h-px w-[120%] rotate-[-9deg] bg-[#C49A45] shadow-[0_34px_0_#C49A45,0_68px_0_#C49A45,0_102px_0_#C49A45]" /><div className="absolute -left-10 bottom-20 h-px w-[120%] rotate-[8deg] bg-[#F4DDE5] shadow-[0_30px_0_#F4DDE5,0_60px_0_#F4DDE5]" /></div><div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end"><div><p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.25em] text-[#F4DDE5]"><Sparkles size={16} /> {config.eyebrow}</p><h1 className="mt-6 max-w-4xl text-5xl font-black leading-[1.08] sm:text-7xl">{config.title}</h1><p className="mt-7 max-w-2xl text-lg leading-9 text-[#FFF9F2]/85">{config.description}</p><div className="mt-8 flex flex-wrap gap-3"><a href="#austria-plans" className="rounded-full bg-[#C49A45] px-6 py-3 font-black text-[#2C2438]">اعرض الباقات الشهرية</a><a href={contactUrl} target="_blank" rel="noreferrer" className="rounded-full border border-[#FFF9F2] px-6 py-3 font-black">احجز الحصة التجريبية</a></div></div><div className="rounded-[2.5rem] border border-[#F4DDE5]/45 bg-[#2C2438]/20 p-7"><span className="text-7xl">{config.flag}</span><p className="mt-6 text-sm font-black text-[#F4DDE5]">تعلم فردي أونلاين</p><p className="mt-2 text-2xl font-black">مسار يناسب وقتك وهدفك.</p><div className="mt-6 grid grid-cols-2 gap-2 text-sm font-bold">{config.cities.map((city) => <span key={city} className="border-r-2 border-[#C49A45] pr-3">{city}</span>)}</div></div></div></section>
    <section lang="de" className="bg-[#FFF9F2] px-5 py-12 sm:px-8" aria-labelledby="austria-local-card-title"><div className="mx-auto max-w-5xl border-b-4 border-[#C49A45] bg-[#F4DDE5] p-6 text-left text-[#2C2438] sm:p-9"><p className="text-xs font-black tracking-[0.2em] text-[#4B3B67]">{austriaLandingConfig.localCard.title}</p><h2 id="austria-local-card-title" className="mt-3 text-2xl font-black sm:text-3xl">{austriaLandingConfig.localCard.heading}</h2><p className="mt-4 max-w-4xl text-lg leading-8">{austriaLandingConfig.localCard.body}</p></div></section>
    <section className="bg-[#FFF9F2] px-5 py-14 sm:px-8"><div className="mx-auto max-w-6xl"><div className="grid gap-5 md:grid-cols-2"><article className="rounded-[2rem] border-2 border-[#4B3B67]/20 bg-[#F4DDE5] p-7"><span className="text-4xl text-[#C49A45]">✓</span><p className="mt-4 font-black text-[#4B3B67]">تحفيظ القرآن الكريم</p><h2 className="mt-3 text-3xl font-black">خطة ثابتة للحفظ والمراجعة</h2><p className="mt-4 leading-8 text-[#2C2438]/70">حصص فردية لتنظيم الحفظ والتسميع والمراجعة والقراءة وفق هدف الطالب، مع باقات شهرية واضحة باليورو.</p><a href={programContactUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-full bg-[#4B3B67] px-5 py-3 font-black text-white">اسأل عن برنامج القرآن</a></article><article className="rounded-[2rem] border-2 border-[#C49A45]/40 bg-[#4B3B67] p-7 text-white"><span className="text-4xl text-[#C49A45]">＋</span><p className="mt-4 font-black text-[#F4DDE5]">تأسيس اللغة العربية</p><h2 className="mt-3 text-3xl font-black">سلم تدريجي للقراءة والفهم</h2><p className="mt-4 leading-8 text-white/80">مسار فردي لبناء أساس القراءة والفهم بالعربية، يبدأ من مستوى الطالب وهدفه التعليمي.</p><a href={programContactUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-full border-2 border-[#F4DDE5] px-5 py-3 font-black">اسأل عن برنامج العربية</a></article></div></div></section>
    <AustriaVideoWindow videos={videos ?? []} />
    <section className="bg-[#FFF9F2] px-5 py-16 sm:px-8"><div className="mx-auto max-w-6xl"><div className="flex items-start gap-4"><MapPin className="mt-1 text-[#C49A45]" /><div><p className="text-sm font-black text-[#4B3B67]">السياق المحلي</p><h2 className="mt-2 text-3xl font-black">التعلم أونلاين من مدن النمسا</h2><p className="mt-4 max-w-3xl leading-8 text-[#2C2438]/70">يمكنك التعلم أونلاين من المدن النمساوية المذكورة، مع تنسيق الموعد حسب التوقيت المحلي.</p><div className="mt-6 flex flex-wrap gap-2">{config.cities.map((city) => <span key={city} className="rounded-full border border-[#F4DDE5] bg-white px-4 py-2 text-sm font-bold">{city}</span>)}</div><p className="mt-5 flex items-center gap-2 text-sm font-bold text-[#4B3B67]"><Clock3 size={16} /> {timezoneLabel}</p></div></div></div></section>
    <AustriaPricingPanel whatsapp={programContactUrl} quranPrices={config.quranPrices} arabicPrices={config.arabicPrices} />
    <FAQ config={config} />
    <section className="bg-[#C49A45] px-5 py-16 text-center text-[#2C2438] sm:px-8"><div className="mx-auto max-w-3xl"><h2 className="text-4xl font-black">ابدأ خطتك التعليمية</h2><p className="mt-4 leading-8">اذكر مدينتك والبرنامج الذي تريده والوقت المناسب لك، وابدأ التواصل باللغة العربية.</p><a href={contactUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#4B3B67] px-6 py-3 font-black text-white"><MessageCircle size={18} /> أريد الحصة التجريبية</a></div></section>
    <CountryLearningHub slug="austria" variant="timeline" showLocalCard={false} /><CountryServiceLinks />
    <footer className="border-t-4 border-[#F4DDE5] bg-[#4B3B67] px-5 py-8 text-[#FFF9F2] sm:px-8"><div className="mx-auto max-w-6xl"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><span className="text-sm font-black tracking-wide">النمسا · {new Date().getFullYear()}</span><nav aria-label="روابط صفحة النمسا" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-[#FFF9F2]/85"><Link href="/">الرئيسية</Link><Link href="/games">الألعاب والمسابقات</Link><Link href="/library">المكتبة</Link><Link href="/contact">التواصل</Link><Link href="/privacy">الخصوصية</Link><Link href="/terms">الشروط</Link></nav></div><details className="mt-6 border-t border-white/15 pt-5"><summary className="cursor-pointer text-sm font-black text-[#F4DDE5]">صفحاتنا حسب الدولة</summary><nav aria-label="كل صفحات الدول" className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">{countryPages.map((country) => <Link key={country.href} href={country.href} className="rounded-md border border-white/15 px-3 py-2 text-sm text-[#FFF9F2]/85 transition hover:border-[#C49A45] hover:text-white"><span className="me-2" aria-hidden="true">{country.flag}</span>{country.label}</Link>)}</nav></details></div></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  </>
}

function GermanyPlanCard({ plan, contactUrl }: { plan: AreaDisplayPlan; contactUrl: string }) {
  return <article className={`saudi-plan-card ${plan.popular ? "saudi-plan-card-featured" : ""}`}>
    {plan.popular && <span className="saudi-popular-badge"><Sparkles size={14} /> الأكثر طلباً</span>}
    <p className="text-sm font-semibold text-muted-foreground">{plan.program === "quran" ? "تحفيظ القرآن" : "تأسيس اللغة العربية"}</p>
    <h3 className="mt-2 text-xl font-bold">{plan.duration} دقيقة للحصة</h3>
    <div className="mt-6 flex items-end gap-2"><strong className="text-4xl font-bold text-primary">€{plan.price}</strong><span className="pb-1 text-sm text-muted-foreground">شهرياً</span></div>
    <p className="mt-2 text-sm text-muted-foreground">{plan.monthlySessions} حصص شهرياً، {plan.weeklySessions} أسبوعياً</p>
    <p className="mt-4 min-h-12 text-sm leading-6 text-muted-foreground">{plan.description}</p>
    <ul className="mt-5 grid gap-3 border-t border-border pt-5 text-sm">{plan.features.map((feature) => <li key={feature} className="flex items-center gap-2"><Check size={17} className="text-accent" />{feature}</li>)}</ul>
    <a className="saudi-plan-cta mt-7" href={contactUrl} target="_blank" rel="noreferrer"><MessageCircle size={18} /> احجز عبر واتساب</a>
  </article>
}

function GermanyLayout({ config, videos, contactUrl, plans, links }: Props & { plans: AreaDisplayPlan[]; links: Array<Partial<AreaLink>> }) {
  const whatsappFallback = `https://wa.me/${germanyLandingConfig.whatsappNumber}`
  const quranPlans = plans.filter((plan) => plan.program === "quran")
  const arabicPlans = plans.filter((plan) => plan.program === "arabic")
  const jsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: config.faq.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }
  const planCards = (items: AreaDisplayPlan[]) => <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{items.map((plan) => <GermanyPlanCard key={plan.id} plan={plan} contactUrl={getAreaWhatsAppUrl(links, plan.name, whatsappFallback)} />)}</div>
  return <>
    <section className="new-country-intro new-country-intro-germany"><div className="new-country-intro-copy">
      <p className="new-country-kicker"><Sparkles size={16} /> <span lang="en" dir="ltr">{config.eyebrow}</span></p>
      <h1>{config.title}</h1><p className="new-country-lead">{config.description}</p>
      <div className="new-country-actions"><WhatsApp config={config} contactUrl={contactUrl} label="احجز الحصة التجريبية الأولى المجانية" /><a className="new-country-ghost" href="#plans">استعرض الباقات <ArrowLeft size={17} /></a></div>
    </div></section>
    <NewCountryVideos videos={videos ?? []} />
    <section id="plans" className="new-country-section"><div className="new-country-narrow">
      <section className="mb-16"><h2 className="text-center">حفظ القرآن ومراجعته مع التلاوة والتجويد</h2><p className="mx-auto mt-4 max-w-3xl text-center leading-8">باقات شهرية باليورو لحصص فردية في الحفظ والتسميع والمراجعة.</p>{planCards(quranPlans)}</section>
      <section><h2 className="text-center">تأسيس العربية قراءة وكتابة أونلاين في ألمانيا</h2><p className="mx-auto mt-4 max-w-3xl text-center leading-8">تأسيس القراءة والكتابة والنطق والفهم بالعربية.</p>{planCards(arabicPlans)}</section>
    </div></section>
    <LocalSection config={config} /><FAQ config={config} />
    <CountryLearningHub slug="germany" variant="minimal" showLocalCard={false} />
    <CountryServiceLinks />
    <PackageIncludes />
    <section className="new-country-section new-country-closing"><div className="new-country-narrow"><p className="new-country-kicker">الخطوة التالية</p><h2>ابدأ بحصة تجريبية مجانية</h2><p>أرسل بيانات الطالب والبرنامج والوقت المناسب، وسننسق معك موعد الحصة التجريبية الأولى.</p><WhatsApp config={config} contactUrl={contactUrl} label="اطلب الحصة التجريبية الأولى المجانية" /></div></section>
    <CountryFooter config={config} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  </>
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
    eyebrow: config.slug === "austria" ? config.eyebrow : contentValue("eyebrow") || config.eyebrow,
    title: config.slug === "austria" ? config.title : contentValue("page_title") || config.title,
    description: config.slug === "austria" ? config.description : contentValue("page_description") || config.description,
    localLead: contentValue("local_lead") || config.localLead,
    currencyCode: areaData.area?.currency_symbol || areaData.area?.currency_code || config.currencyCode,
    quranPrices: quranPlans.length >= 4 ? quranPlans.slice(0, 4).map((plan) => plan.price) : config.quranPrices,
    arabicPrices: arabicPlans.length >= 4 ? arabicPlans.slice(0, 4).map((plan) => plan.price) : config.arabicPrices,
    cities: areaData.cities.length ? areaData.cities.map((city) => city.name_ar) : config.cities,
    faq: areaData.faq.length ? areaData.faq.map((item) => [item.question_ar, item.answer_ar] as [string, string]) : config.faq,
    theme: areaData.theme ? { primary: areaData.theme.primary_color, accent: areaData.theme.accent_color, background: areaData.theme.background_color, surface: areaData.theme.secondary_color, ink: areaData.theme.text_color } : config.theme,
  }
  const germanyWhatsAppFallback = `https://wa.me/${germanyLandingConfig.whatsappNumber}`
  const fallbackWhatsApp = dynamicConfig.variant === "germany" ? germanyWhatsAppFallback : "https://bit.ly/4aJfOl6"
  const configuredWhatsApp = getAreaLinkHref(areaData.links, "whatsapp", fallbackWhatsApp)
  const trialMessage = dynamicConfig.variant === "germany" ? dynamicConfig.whatsappMessage : dynamicConfig.variant === "austria" ? "السلام عليكم، أرغب في حجز باقة حصة تجريبية مجانية في النمسا." : undefined
  const contactUrl = getAreaWhatsAppUrl(areaData.links, "حصة تجريبية مجانية", configuredWhatsApp, trialMessage)
  const props = { config: dynamicConfig, videos, teachers, contactUrl }
  if (dynamicConfig.variant === "austria") {
    const programContactUrl = getAreaWhatsAppUrl(areaData.links, "باقات القرآن أو العربية في النمسا", configuredWhatsApp)
    const timezoneLabel = areaData.timezones.find((timezone) => timezone.is_primary)?.label_ar || dynamicConfig.timezone
    return <main dir="rtl" className="min-h-screen overflow-hidden bg-[#FFF9F2] text-[#2C2438]" style={{ "--country-primary": dynamicConfig.theme.primary, "--country-accent": dynamicConfig.theme.accent, "--country-background": dynamicConfig.theme.background, "--country-surface": dynamicConfig.theme.surface, "--country-ink": dynamicConfig.theme.ink } as React.CSSProperties}><AustriaLayout {...props} programContactUrl={programContactUrl} timezoneLabel={timezoneLabel} /></main>
  }
  if (dynamicConfig.variant === "germany") {
    const fallbackGermanyPlans = germanyLandingConfig.plans.map((plan) => ({ ...plan, popular: Boolean(plan.popular) }))
    const germanyPlans = (["quran", "arabic"] as const).flatMap((program) => {
      const databaseProgramPlans = databasePlans.filter((plan) => plan.program === program)
      return databaseProgramPlans.length ? databaseProgramPlans : fallbackGermanyPlans.filter((plan) => plan.program === program)
    })
    return <main dir="rtl" className="new-country-page" style={{ "--country-primary": dynamicConfig.theme.primary, "--country-accent": dynamicConfig.theme.accent, "--country-background": dynamicConfig.theme.background, "--country-surface": dynamicConfig.theme.surface, "--country-ink": dynamicConfig.theme.ink } as React.CSSProperties}><GermanyLayout {...props} plans={germanyPlans} links={areaData.links} /></main>
  }
  if (dynamicConfig.variant === "qatar") return <main dir="rtl" className="new-country-page" style={{"--country-primary":dynamicConfig.theme.primary,"--country-accent":dynamicConfig.theme.accent,"--country-background":dynamicConfig.theme.background,"--country-surface":dynamicConfig.theme.surface,"--country-ink":dynamicConfig.theme.ink} as React.CSSProperties}><QatarLayout {...props}/></main>
  if (dynamicConfig.variant === "oman") return <main dir="rtl" className="new-country-page" style={{"--country-primary":dynamicConfig.theme.primary,"--country-accent":dynamicConfig.theme.accent,"--country-background":dynamicConfig.theme.background,"--country-surface":dynamicConfig.theme.surface,"--country-ink":dynamicConfig.theme.ink} as React.CSSProperties}><OmanLayout {...props}/></main>
  if (dynamicConfig.variant === "jordan") return <main dir="rtl" className="new-country-page" style={{"--country-primary":dynamicConfig.theme.primary,"--country-accent":dynamicConfig.theme.accent,"--country-background":dynamicConfig.theme.background,"--country-surface":dynamicConfig.theme.surface,"--country-ink":dynamicConfig.theme.ink} as React.CSSProperties}><JordanLayout {...props}/></main>
  if (dynamicConfig.variant === "bahrain") return <main dir="rtl" className="new-country-page" style={{"--country-primary":dynamicConfig.theme.primary,"--country-accent":dynamicConfig.theme.accent,"--country-background":dynamicConfig.theme.background,"--country-surface":dynamicConfig.theme.surface,"--country-ink":dynamicConfig.theme.ink} as React.CSSProperties}><BahrainLayout {...props}/></main>
  if (dynamicConfig.variant === "spain") return <main dir="rtl" className="new-country-page" style={{"--country-primary":dynamicConfig.theme.primary,"--country-accent":dynamicConfig.theme.accent,"--country-background":dynamicConfig.theme.background,"--country-surface":dynamicConfig.theme.surface,"--country-ink":dynamicConfig.theme.ink} as React.CSSProperties}><SpainLayout {...props}/></main>
  if (dynamicConfig.variant === "netherlands") return <main dir="rtl" className="new-country-page" style={{"--country-primary":dynamicConfig.theme.primary,"--country-accent":dynamicConfig.theme.accent,"--country-background":dynamicConfig.theme.background,"--country-surface":dynamicConfig.theme.surface,"--country-ink":dynamicConfig.theme.ink} as React.CSSProperties}><NetherlandsLayout {...props}/></main>
  if (dynamicConfig.variant === "sweden") return <main dir="rtl" className="new-country-page" style={{"--country-primary":dynamicConfig.theme.primary,"--country-accent":dynamicConfig.theme.accent,"--country-background":dynamicConfig.theme.background,"--country-surface":dynamicConfig.theme.surface,"--country-ink":dynamicConfig.theme.ink} as React.CSSProperties}><SwedenLayout {...props}/></main>
  return <main dir="rtl" className="new-country-page" style={{"--country-primary":dynamicConfig.theme.primary,"--country-accent":dynamicConfig.theme.accent,"--country-background":dynamicConfig.theme.background,"--country-surface":dynamicConfig.theme.surface,"--country-ink":dynamicConfig.theme.ink} as React.CSSProperties}><LanguageLayout {...props}/></main>
}
