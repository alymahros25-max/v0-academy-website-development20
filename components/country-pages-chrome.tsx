"use client"

import Link from "next/link"
import Image from "next/image"
import { BookOpen, Feather } from "lucide-react"
import { usePathname } from "next/navigation"

const countries: Record<string, { ar: string; code: string }> = {
  "/argentina": { ar: "الأرجنتين", code: "ar" }, "/australia": { ar: "أستراليا", code: "au" }, "/austria": { ar: "النمسا", code: "at" },
  "/bahrain": { ar: "البحرين", code: "bh" }, "/belgium": { ar: "بلجيكا", code: "be" }, "/brazil": { ar: "البرازيل", code: "br" },
  "/canada": { ar: "كندا", code: "ca" }, "/china": { ar: "الصين", code: "cn" }, "/colombia": { ar: "كولومبيا", code: "co" },
  "/denmark": { ar: "الدنمارك", code: "dk" }, "/finland": { ar: "فنلندا", code: "fi" }, "/france": { ar: "فرنسا", code: "fr" },
  "/germany": { ar: "ألمانيا", code: "de" }, "/greece": { ar: "اليونان", code: "gr" }, "/indonesia": { ar: "إندونيسيا", code: "id" },
  "/italy": { ar: "إيطاليا", code: "it" }, "/jordan": { ar: "الأردن", code: "jo" }, "/kuwait": { ar: "الكويت", code: "kw" },
  "/malaysia": { ar: "ماليزيا", code: "my" }, "/mexico": { ar: "المكسيك", code: "mx" }, "/netherlands": { ar: "هولندا", code: "nl" },
  "/new-zealand": { ar: "نيوزيلندا", code: "nz" }, "/nigeria": { ar: "نيجيريا", code: "ng" }, "/norway": { ar: "النرويج", code: "no" },
  "/oman": { ar: "عُمان", code: "om" }, "/poland": { ar: "بولندا", code: "pl" }, "/portugal": { ar: "البرتغال", code: "pt" },
  "/qatar": { ar: "قطر", code: "qa" }, "/russia": { ar: "روسيا", code: "ru" }, "/saudi-arabia": { ar: "السعودية", code: "sa" },
  "/senegal": { ar: "السنغال", code: "sn" }, "/south-africa": { ar: "جنوب أفريقيا", code: "za" }, "/spain": { ar: "إسبانيا", code: "es" },
  "/sweden": { ar: "السويد", code: "se" }, "/switzerland": { ar: "سويسرا", code: "ch" }, "/turkey": { ar: "تركيا", code: "tr" },
  "/united-arab-emirates": { ar: "الإمارات العربية المتحدة", code: "ae" }, "/united-kingdom": { ar: "المملكة المتحدة", code: "gb" },
  "/united-states": { ar: "الولايات المتحدة", code: "us" }, "/venezuela": { ar: "فنزويلا", code: "ve" },
}

const countryVisuals: Record<string, string> = {
  "/saudi-arabia": "🌴", "/united-arab-emirates": "🕌", "/qatar": "☪️", "/oman": "🪔",
  "/kuwait": "✒️", "/bahrain": "🌊", "/jordan": "🏛️", "/turkey": "🌙",
  "/france": "🗼", "/italy": "🏛️", "/germany": "📖", "/spain": "🌞",
  "/australia": "🪃", "/new-zealand": "🌿", "/canada": "🍁", "/united-states": "🗽",
  "/united-kingdom": "🖋️", "/china": "🏮", "/brazil": "🌿",
}

export function CountryPagesChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const country = countries[pathname]
  if (!country) return <>{children}</>

  return (
    <div className="country-pages-shell">
      <header className="country-pages-header">
        <div className="country-pages-header-inner">
          <div className="country-pages-logo" aria-label="شعار أكاديمية الحافظ المتميز">
            <Image src="/logo.png" alt="" width={44} height={44} priority className="country-pages-logo-image" />
          </div>
          <div className="country-pages-title">
            <span>أكاديمية الحافظ المتميز Online</span>
            <i>—</i>
            <b>{country.ar}</b>
            <i>—</i>
            <em dir="ltr">{pathname.slice(1)}</em>
          </div>
          <div className="country-pages-ornament" aria-hidden="true">
            <span className="country-pages-country-visual">{countryVisuals[pathname] ?? "✒️"}</span>
            <BookOpen size={25} strokeWidth={1.7} />
            <Feather size={17} strokeWidth={1.7} />
          </div>
          <div className="country-pages-flag" role="img" aria-label={`علم ${country.ar}`}><Image loader={({ src }) => src} unoptimized src={`https://flagcdn.com/w80/${country.code}.png`} alt={`علم ${country.ar}`} width={80} height={52} /></div>
        </div>
      </header>
      {children}
      <footer className="country-pages-footer">
        <div className="country-pages-footer-inner">
          <div><strong>أكاديمية الحافظ المتميز</strong><span>تعليم فردي أونلاين للقرآن والعربية</span></div>
          <nav aria-label="روابط صفحة الدولة"><Link href="/">الرئيسية</Link><Link href="/contact">تواصل معنا</Link><Link href="/privacy">الخصوصية</Link><Link href="/terms">الشروط</Link></nav>
          <p>صفحة {country.ar} المستقلة · © {new Date().getFullYear()}</p>
        </div>
        <div className="country-pages-countries"><details><summary>صفحاتنا حسب الدولة</summary><nav>{Object.entries(countries).map(([href, item]) => <Link key={href} href={href} className={href === pathname ? "is-current" : ""}><Image loader={({ src }) => src} unoptimized src={`https://flagcdn.com/w40/${item.code}.png`} alt="" width={40} height={26} /> {item.ar}</Link>)}</nav></details></div>
      </footer>
    </div>
  )
}
