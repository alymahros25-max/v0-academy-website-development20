"use client"

import Link from "next/link"
import Image from "next/image"
import { BookOpen, Feather } from "lucide-react"
import { usePathname } from "next/navigation"

const countries: Record<string, { ar: string; local: string; flag: string }> = {
  "/argentina": { ar: "الأرجنتين", local: "Argentina", flag: "🇦🇷" },
  "/australia": { ar: "أستراليا", local: "Australia", flag: "🇦🇺" },
  "/austria": { ar: "النمسا", local: "Österreich", flag: "🇦🇹" },
  "/bahrain": { ar: "البحرين", local: "البحرين", flag: "🇧🇭" },
  "/belgium": { ar: "بلجيكا", local: "België", flag: "🇧🇪" },
  "/brazil": { ar: "البرازيل", local: "Brasil", flag: "🇧🇷" },
  "/canada": { ar: "كندا", local: "Canada", flag: "🇨🇦" },
  "/china": { ar: "الصين", local: "中国", flag: "🇨🇳" },
  "/colombia": { ar: "كولومبيا", local: "Colombia", flag: "🇨🇴" },
  "/denmark": { ar: "الدنمارك", local: "Danmark", flag: "🇩🇰" },
  "/finland": { ar: "فنلندا", local: "Suomi", flag: "🇫🇮" },
  "/france": { ar: "فرنسا", local: "France", flag: "🇫🇷" },
  "/germany": { ar: "ألمانيا", local: "Deutschland", flag: "🇩🇪" },
  "/greece": { ar: "اليونان", local: "Ελλάδα", flag: "🇬🇷" },
  "/indonesia": { ar: "إندونيسيا", local: "Indonesia", flag: "🇮🇩" },
  "/italy": { ar: "إيطاليا", local: "Italia", flag: "🇮🇹" },
  "/jordan": { ar: "الأردن", local: "الأردن", flag: "🇯🇴" },
  "/kuwait": { ar: "الكويت", local: "الكويت", flag: "🇰🇼" },
  "/malaysia": { ar: "ماليزيا", local: "Malaysia", flag: "🇲🇾" },
  "/mexico": { ar: "المكسيك", local: "México", flag: "🇲🇽" },
  "/netherlands": { ar: "هولندا", local: "Nederland", flag: "🇳🇱" },
  "/new-zealand": { ar: "نيوزيلندا", local: "New Zealand", flag: "🇳🇿" },
  "/nigeria": { ar: "نيجيريا", local: "Nigeria", flag: "🇳🇬" },
  "/norway": { ar: "النرويج", local: "Norge", flag: "🇳🇴" },
  "/oman": { ar: "عُمان", local: "عُمان", flag: "🇴🇲" },
  "/poland": { ar: "بولندا", local: "Polska", flag: "🇵🇱" },
  "/portugal": { ar: "البرتغال", local: "Portugal", flag: "🇵🇹" },
  "/qatar": { ar: "قطر", local: "قطر", flag: "🇶🇦" },
  "/russia": { ar: "روسيا", local: "Россия", flag: "🇷🇺" },
  "/saudi-arabia": { ar: "السعودية", local: "السعودية", flag: "🇸🇦" },
  "/senegal": { ar: "السنغال", local: "Sénégal", flag: "🇸🇳" },
  "/south-africa": { ar: "جنوب أفريقيا", local: "South Africa", flag: "🇿🇦" },
  "/spain": { ar: "إسبانيا", local: "España", flag: "🇪🇸" },
  "/sweden": { ar: "السويد", local: "Sverige", flag: "🇸🇪" },
  "/switzerland": { ar: "سويسرا", local: "Schweiz", flag: "🇨🇭" },
  "/turkey": { ar: "تركيا", local: "Türkiye", flag: "🇹🇷" },
  "/united-arab-emirates": { ar: "الإمارات العربية المتحدة", local: "الإمارات العربية المتحدة", flag: "🇦🇪" },
  "/united-kingdom": { ar: "المملكة المتحدة", local: "United Kingdom", flag: "🇬🇧" },
  "/united-states": { ar: "الولايات المتحدة", local: "United States", flag: "🇺🇸" },
  "/venezuela": { ar: "فنزويلا", local: "Venezuela", flag: "🇻🇪" },
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
            <span>أكاديمية الحافظ المتميز</span>
            <i>—</i>
            <b>{country.ar}</b>
            <i>—</i>
            <em dir="ltr">{country.local}</em>
          </div>
          <div className="country-pages-ornament" aria-hidden="true">
            <span className="country-pages-country-visual">{countryVisuals[pathname] ?? "✒️"}</span>
            <BookOpen size={25} strokeWidth={1.7} />
            <Feather size={17} strokeWidth={1.7} />
          </div>
          <div className="country-pages-flag" role="img" aria-label={`علم ${country.ar}`}>{country.flag}</div>
        </div>
      </header>
      {children}
      <footer className="country-pages-footer">
        <div className="country-pages-footer-inner">
          <div><strong>أكاديمية الحافظ المتميز</strong><span>تعليم فردي أونلاين للقرآن والعربية</span></div>
          <nav aria-label="روابط صفحة الدولة"><Link href="/">الرئيسية</Link><Link href="/contact">تواصل معنا</Link><Link href="/privacy">الخصوصية</Link><Link href="/terms">الشروط</Link></nav>
          <p>{country.flag} صفحة {country.ar} المستقلة · © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}
