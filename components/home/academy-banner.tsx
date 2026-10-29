import { Star } from "lucide-react"

function LocalizedBannerText() {
  return (
    <>
      <span lang="ar" className="home-locale-ar">تحفيظ القرآن وتأسيس العربية أونلاين للناطقين بالعربية</span>
      <span lang="en" className="home-locale-en">Online Quran memorization and Arabic foundation for Arabic speakers</span>
      <span lang="fr" className="home-locale-fr">Mémorisation du Coran et bases de l’arabe en ligne pour les arabophones</span>
    </>
  )
}

export function AcademyBanner() {
  return (
    <section
      aria-label="رسالة الأكاديمية"
      className="academy-banner relative z-10 overflow-hidden border-b border-[#DDBB85]/70 bg-[#102B49] pt-20 text-[#F4D58D] shadow-sm lg:pt-24"
    >
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-center px-4 py-5 text-center sm:min-h-24 sm:py-6">
        <p className="banner-enter flex items-center justify-center gap-2 text-sm font-bold leading-6 [text-shadow:0_1px_2px_rgba(0,0,0,0.35)] sm:text-base">
          <Star className="size-4 shrink-0 fill-current" aria-hidden="true" />
          <LocalizedBannerText />
        </p>
      </div>
    </section>
  )
}
