import { getCountrySeoPlan } from "@/lib/country-seo"
import { getCountryLocalLanguage } from "@/lib/country-local-language"

type CountryLocalLanguageBannerProps = { slug: string }

export function CountryLocalLanguageBanner({ slug }: CountryLocalLanguageBannerProps) {
  const page = getCountrySeoPlan(slug)
  if (!page) return null

  const local = getCountryLocalLanguage(slug)
  const hasDistinctLocalName = local.localCountryName !== page.country

  return (
    <div className="border-b border-slate-200 bg-white px-4 py-2 text-center text-xs text-slate-600" dir="rtl">
      <p className="font-semibold">
        أكاديمية الحافظ المتميز <span className="mx-1 text-slate-400">|</span> {page.country}
        {hasDistinctLocalName && (
          <>
            <span className="mx-1 text-slate-400">|</span>
            <b dir="ltr" className="font-medium text-slate-700">{local.localCountryName}</b>
          </>
        )}
      </p>
      {local.localLanguagePhrase && (
        <p dir="ltr" className="mt-0.5 text-[11px] text-slate-500">{local.localLanguagePhrase}</p>
      )}
    </div>
  )
}
