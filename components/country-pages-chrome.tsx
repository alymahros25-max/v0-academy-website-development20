"use client"

import Link from "next/link"
import Image from "next/image"
import { BookOpen, Feather } from "lucide-react"
import { usePathname } from "next/navigation"

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

function CountryFlag({ code, size = 80, alt = "" }: { code: string; size?: number; alt?: string }) {
  return <Image loader={({ src }) => src} unoptimized src={`https://flagcdn.com/w${size}/${code}.png`} alt={alt} width={size} height={Math.round(size * 0.65)} />
}

export function CountryPagesChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const country = countries[pathname]
  if (!country) return <>{children}</>

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
  </div>
}
