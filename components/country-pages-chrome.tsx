"use client"

import Link from "next/link"
import Image from "next/image"
import { BookOpen, Feather } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { trackGA4Event } from "@/components/ga4-events"

type Country = { ar: string; code: string; currency: string }

const countries: Record<string, Country> = {
  "/argentina": { ar: "الأرجنتين", code: "ar", currency: "البيزو الأرجنتيني" }, "/australia": { ar: "أستراليا", code: "au", currency: "الدولار الأسترالي" }, "/austria": { ar: "النمسا", code: "at", currency: "اليورو" },
  "/bahrain": { ar: "البحرين", code: "bh", currency: "الدينار البحريني" }, "/belgium": { ar: "بلجيكا", code: "be", currency: "اليورو" }, "/brazil": { ar: "البرازيل", code: "br", currency: "الريال البرازيلي" },
  "/canada": { ar: "كندا", code: "ca", currency: "الدولار الكندي" }, "/china": { ar: "الصين", code: "cn", currency: "اليوان الصيني" }, "/colombia": { ar: "كولومبيا", code: "co", currency: "البيزو الكولومبي" },
  "/denmark": { ar: "الدنمارك", code: "dk", currency: "الكرونة الدنماركية" }, "/finland": { ar: "فنلندا", code: "fi", currency: "اليورو" }, "/france": { ar: "فرنسا", code: "fr", currency: "اليورو" },
  "/germany": { ar: "ألمانيا", code: "de", currency: "اليورو" }, "/greece": { ar: "اليونان", code: "gr", currency: "اليورو" }, "/indonesia": { ar: "إندونيسيا", code: "id", currency: "الروبية الإندونيسية" },
  "/italy": { ar: "إيطاليا", code: "it", currency: "اليورو" }, "/jordan": { ar: "الأردن", code: "jo", currency: "الدينار الأردني" }, "/kuwait": { ar: "الكويت", code: "kw", currency: "الدينار الكويتي" },
  "/malaysia": { ar: "ماليزيا", code: "my", currency: "الرنغيت الماليزي" }, "/mexico": { ar: "المكسيك", code: "mx", currency: "البيزو المكسيكي" }, "/netherlands": { ar: "هولندا", code: "nl", currency: "اليورو" },
  "/new-zealand": { ar: "نيوزيلندا", code: "nz", currency: "الدولار النيوزيلندي" }, "/nigeria": { ar: "نيجيريا", code: "ng", currency: "النايرا النيجيري" }, "/norway": { ar: "النرويج", code: "no", currency: "الكرونة النرويجية" },
  "/oman": { ar: "عُمان", code: "om", currency: "الريال العُماني" }, "/poland": { ar: "بولندا", code: "pl", currency: "الزلوتي البولندي" }, "/portugal": { ar: "البرتغال", code: "pt", currency: "اليورو" },
  "/qatar": { ar: "قطر", code: "qa", currency: "الريال القطري" }, "/russia": { ar: "روسيا", code: "ru", currency: "الروبل الروسي" }, "/saudi-arabia": { ar: "السعودية", code: "sa", currency: "الريال السعودي" },
  "/senegal": { ar: "السنغال", code: "sn", currency: "فرنك غرب أفريقيا" }, "/south-africa": { ar: "جنوب أفريقيا", code: "za", currency: "الراند الجنوب أفريقي" }, "/spain": { ar: "إسبانيا", code: "es", currency: "اليورو" },
  "/sweden": { ar: "السويد", code: "se", currency: "الكرونة السويدية" }, "/switzerland": { ar: "سويسرا", code: "ch", currency: "الفرنك السويسري" }, "/turkey": { ar: "تركيا", code: "tr", currency: "الليرة التركية" },
  "/united-arab-emirates": { ar: "الإمارات العربية المتحدة", code: "ae", currency: "الدرهم الإماراتي" }, "/united-kingdom": { ar: "المملكة المتحدة", code: "gb", currency: "الجنيه الإسترليني" },
  "/united-states": { ar: "الولايات المتحدة", code: "us", currency: "الدولار الأمريكي" }, "/venezuela": { ar: "فنزويلا", code: "ve", currency: "البوليفار الفنزويلي" },
}

const countryVisuals: Record<string, string> = {
  "/saudi-arabia": "🌴", "/united-arab-emirates": "🕌", "/qatar": "☪️", "/oman": "🪔", "/kuwait": "✒️", "/bahrain": "🌊", "/jordan": "🏛️", "/turkey": "🌙",
  "/france": "🗼", "/italy": "🏛️", "/germany": "📖", "/spain": "🌞", "/australia": "🪃", "/new-zealand": "🌿", "/canada": "🍁", "/united-states": "🗽", "/united-kingdom": "🖋️", "/china": "🏮", "/brazil": "🌿",
}

const suggestionDismissalKey = "country-currency-suggestion-dismissed"
const suggestionDismissalDays = 30
type Suggestion = { kind: "country"; country: Country & { path: string } } | { kind: "usd" }

function CountryFlag({ code, size = 80, alt = "" }: { code: string; size?: number; alt?: string }) {
  return <Image loader={({ src }) => src} unoptimized src={`https://flagcdn.com/w${size}/${code}.png`} alt={alt} width={size} height={Math.round(size * 0.65)} />
}

function CountryCurrencySuggestion({ currentPath }: { currentPath: string }) {
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null)
  const trackedSuggestion = useRef<string | null>(null)

  useEffect(() => {
    let cancelled = false
    try {
      const dismissedAt = Number(window.localStorage.getItem(suggestionDismissalKey) || 0)
      if (dismissedAt && Date.now() - dismissedAt < suggestionDismissalDays * 86400000) return
    } catch { return }

    void fetch("/api/visitor-country", { cache: "no-store" })
      .then((response) => response.ok ? response.json() as Promise<{ countryCode: string | null }> : null)
      .then((data) => {
        if (cancelled || !data?.countryCode) return
        const match = Object.entries(countries).find(([, item]) => item.code.toUpperCase() === data.countryCode)
        if (!match) {
          if (currentPath !== "/quran" && currentPath !== "/arabic") {
            setSuggestion({ kind: "usd" })
            if (trackedSuggestion.current !== `usd:${currentPath}`) {
              trackedSuggestion.current = `usd:${currentPath}`
              trackGA4Event("country_suggestion_shown", { suggestion_type: "usd", detected_country: data.countryCode, current_path: currentPath, destination: "/quran,/arabic" })
            }
          }
          return
        }
        if (match[0] === currentPath) return
        const [path, item] = match
        setSuggestion({ kind: "country", country: { path, ...item } })
        if (trackedSuggestion.current !== `country:${path}:${currentPath}`) {
          trackedSuggestion.current = `country:${path}:${currentPath}`
          trackGA4Event("country_suggestion_shown", { suggestion_type: "local_currency", detected_country: item.code.toUpperCase(), suggested_currency: item.currency, current_path: currentPath, destination: path })
        }
      })
      .catch(() => undefined)
    return () => { cancelled = true }
  }, [currentPath])

  if (!suggestion) return null
  const dismiss = (trackNo = true) => {
    if (trackNo) trackGA4Event("country_suggestion_no", { suggestion_type: suggestion.kind, current_path: currentPath })
    try { window.localStorage.setItem(suggestionDismissalKey, String(Date.now())) } catch { /* private browsing */ }
    setSuggestion(null)
  }

  if (suggestion.kind === "usd") {
    const quranVisible = currentPath !== "/quran"
    const arabicVisible = currentPath !== "/arabic"
    return <aside className="country-currency-suggestion country-usd-suggestion" role="status" aria-live="polite">
      <div className="country-currency-suggestion-flag country-usd-mark">$</div>
      <div className="country-currency-suggestion-copy"><strong>هل تريد مشاهدة الأسعار بالدولار الأمريكي؟</strong><span>اختر القسم الذي تريد معرفة أسعاره بالدولار.</span></div>
      <div className="country-currency-suggestion-actions">{quranVisible && <Link href="/quran" onClick={() => { trackGA4Event("usd_pricing_quran_click", { current_path: currentPath, destination: "/quran" }); dismiss(false) }}>أسعار القرآن بالدولار</Link>}{arabicVisible && <Link href="/arabic" onClick={() => { trackGA4Event("usd_pricing_arabic_click", { current_path: currentPath, destination: "/arabic" }); dismiss(false) }}>أسعار العربي بالدولار</Link>}<button type="button" onClick={() => dismiss()}>لا، أبقى هنا</button></div>
    </aside>
  }

  const suggestedCountry = suggestion.country
  return <aside className="country-currency-suggestion" role="status" aria-live="polite">
    <div className="country-currency-suggestion-flag"><CountryFlag code={suggestedCountry.code} alt="" /></div>
    <div className="country-currency-suggestion-copy"><strong>هل تريد مشاهدة الأسعار بـ{suggestedCountry.currency}؟</strong><span>اطّلع على الباقات والمواعيد المناسبة للعائلات في {suggestedCountry.ar}.</span></div>
    <div className="country-currency-suggestion-actions"><Link href={suggestedCountry.path} onClick={() => { trackGA4Event("country_suggestion_yes", { suggestion_type: "local_currency", current_path: currentPath, detected_country: suggestedCountry.code.toUpperCase(), suggested_currency: suggestedCountry.currency, destination: suggestedCountry.path }); dismiss(false) }}>نعم، انتقل إلى صفحة {suggestedCountry.ar}</Link><button type="button" onClick={() => dismiss()}>لا، أبقى هنا</button></div>
  </aside>
}

export function CountryPagesChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const country = countries[pathname]
  const suggestion = <CountryCurrencySuggestion currentPath={pathname} />
  if (!country) return <><div>{children}</div>{suggestion}</>

  return <div className="country-pages-shell">
    <header className="country-pages-header">
      <div className="country-pages-header-inner">
        <div className="country-pages-logo" aria-label="شعار أكاديمية الحافظ المتميز"><Image src="/logo.png" alt="" width={44} height={44} priority className="country-pages-logo-image" /></div>
        <div className="country-pages-title"><span>أكاديمية الحافظ المتميز Online</span><i>—</i><b>{country.ar}</b><i>—</i><em dir="ltr">{pathname.slice(1)}</em></div>
        <div className="country-pages-ornament" aria-hidden="true"><span className="country-pages-country-visual">{countryVisuals[pathname] ?? "✒️"}</span><BookOpen size={25} strokeWidth={1.7} /><Feather size={17} strokeWidth={1.7} /></div>
        <div className="country-pages-flag" role="img" aria-label={`علم ${country.ar}`}><CountryFlag code={country.code} alt={`علم ${country.ar}`} /></div>
      </div>
    </header>
    {children}
    <footer className="country-pages-footer">
      <div className="country-pages-footer-inner"><div><strong>أكاديمية الحافظ المتميز</strong><span>تعليم فردي أونلاين للقرآن والعربية</span></div><nav aria-label="روابط صفحة الدولة"><Link href="/">الرئيسية</Link><Link href="/contact">تواصل معنا</Link><Link href="/privacy">الخصوصية</Link><Link href="/terms">الشروط</Link></nav><p>صفحة {country.ar} المستقلة · © {new Date().getFullYear()}</p></div>
      <div className="country-pages-countries"><details><summary>صفحاتنا حسب الدولة</summary><nav>{Object.entries(countries).map(([href, item]) => <Link key={href} href={href} className={href === pathname ? "is-current" : ""}><CountryFlag code={item.code} size={40} /> {item.ar}</Link>)}</nav></details></div>
    </footer>
    {suggestion}
  </div>
}
