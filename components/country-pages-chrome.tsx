import Image from "next/image"
import { BookOpen, Feather } from "lucide-react"

type Country = { ar: string; code: string; currency: string }
type LocalCountryName = { name: string; lang: string }

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

const localCountryNames: Record<string, LocalCountryName> = {
  "/argentina": { name: "Argentina", lang: "es" }, "/australia": { name: "Australia", lang: "en" }, "/austria": { name: "Österreich", lang: "de" },
  "/bahrain": { name: "البحرين", lang: "ar" }, "/belgium": { name: "België", lang: "nl" }, "/brazil": { name: "Brasil", lang: "pt-BR" },
  "/canada": { name: "Canada", lang: "en-CA" }, "/china": { name: "中国", lang: "zh-CN" }, "/colombia": { name: "Colombia", lang: "es" },
  "/denmark": { name: "Danmark", lang: "da" }, "/finland": { name: "Suomi", lang: "fi" }, "/france": { name: "France", lang: "fr" },
  "/germany": { name: "Deutschland", lang: "de" }, "/greece": { name: "Ελλάδα", lang: "el" }, "/indonesia": { name: "Indonesia", lang: "id" },
  "/italy": { name: "Italia", lang: "it" }, "/jordan": { name: "الأردن", lang: "ar" }, "/kuwait": { name: "الكويت", lang: "ar" },
  "/malaysia": { name: "Malaysia", lang: "ms" }, "/mexico": { name: "México", lang: "es" }, "/netherlands": { name: "Nederland", lang: "nl" },
  "/new-zealand": { name: "Aotearoa New Zealand", lang: "mi" }, "/nigeria": { name: "Nigeria", lang: "en" }, "/norway": { name: "Norge", lang: "no" },
  "/oman": { name: "سلطنة عُمان", lang: "ar" }, "/poland": { name: "Polska", lang: "pl" }, "/portugal": { name: "Portugal", lang: "pt" },
  "/qatar": { name: "قطر", lang: "ar" }, "/russia": { name: "Россия", lang: "ru" }, "/saudi-arabia": { name: "المملكة العربية السعودية", lang: "ar" },
  "/senegal": { name: "Sénégal", lang: "fr" }, "/south-africa": { name: "South Africa", lang: "en-ZA" }, "/spain": { name: "España", lang: "es" },
  "/sweden": { name: "Sverige", lang: "sv" }, "/switzerland": { name: "Schweiz", lang: "de-CH" }, "/turkey": { name: "Türkiye", lang: "tr" },
  "/united-arab-emirates": { name: "الإمارات العربية المتحدة", lang: "ar" }, "/united-kingdom": { name: "United Kingdom", lang: "en-GB" },
  "/united-states": { name: "United States", lang: "en-US" }, "/venezuela": { name: "Venezuela", lang: "es" },
}

const countryVisuals: Record<string, string> = {
  "/saudi-arabia": "🌴", "/united-arab-emirates": "🕌", "/qatar": "☪️", "/oman": "🪔", "/kuwait": "✒️", "/bahrain": "🌊", "/jordan": "🏛️", "/turkey": "🌙",
  "/france": "🗼", "/italy": "🏛️", "/germany": "📖", "/spain": "🌞", "/australia": "🪃", "/new-zealand": "🌿", "/canada": "🍁", "/united-states": "🗽", "/united-kingdom": "🖋️", "/china": "🏮", "/brazil": "🌿",
}

function CountryFlag({ code, size = 80, alt = "" }: { code: string; size?: number; alt?: string }) {
  return <Image unoptimized src={`https://flagcdn.com/w${size}/${code}.png`} alt={alt} width={size} height={Math.round(size * 0.65)} />
}

export function CountryPagesChrome({ slug, children }: { slug: string; children: React.ReactNode }) {
  const pathname = `/${slug}`
  const country = countries[pathname]
  if (!country) return children
  const localName = localCountryNames[pathname]

  return <div className="country-pages-shell">
    <header className="country-pages-header">
      <div className="country-pages-header-inner">
        <div className="country-pages-title">
          <span>أكاديمية الحافظ المتميز</span>
          <span className="country-pages-logo" aria-hidden="true"><Image src="/logo.png" alt="" width={44} height={44} priority className="country-pages-logo-image" /></span>
          <i aria-hidden="true">—</i>
          <b>{country.ar}</b>
          {localName && localName.name !== country.ar && <><i aria-hidden="true">—</i><em lang={localName.lang} dir="auto">{localName.name}</em></>}
        </div>
        <div className="country-pages-ornament" aria-hidden="true"><span className="country-pages-country-visual">{countryVisuals[pathname] ?? "✒️"}</span><BookOpen size={25} strokeWidth={1.7} /><Feather size={17} strokeWidth={1.7} /></div>
        <div className="country-pages-flag" role="img" aria-label={`علم ${country.ar}`}><CountryFlag code={country.code} alt={`علم ${country.ar}`} /></div>
      </div>
    </header>
    {children}
  </div>
}
