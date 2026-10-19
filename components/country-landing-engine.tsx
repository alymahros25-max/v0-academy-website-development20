import { CountryLocalLanguageBanner } from "@/components/country-local-language-banner"
import { CountryUnifiedLanding } from "@/components/country-unified-landing"
import { CountrySharedFooter, CountrySharedStructuredData } from "@/components/country-page-shared"
import { getCountryPageModel } from "@/lib/country-page-model"

type CountryLandingEngineProps = {
  slug: string
}

/** All country routes share one model and one visual renderer. */
export async function CountryLandingEngine({ slug }: CountryLandingEngineProps) {
  const page = await getCountryPageModel(slug)
  return <><CountryLocalLanguageBanner slug={slug} /><CountryUnifiedLanding page={page} /><CountrySharedFooter page={page} /><CountrySharedStructuredData page={page} /></>
}
