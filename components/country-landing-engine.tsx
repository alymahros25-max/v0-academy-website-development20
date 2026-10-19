import { NewCountryLanding } from "@/components/new-country-landing"
import { getNewCountryConfig } from "@/lib/new-country-pages"
import { CountryLocalLanguageBanner } from "@/components/country-local-language-banner"
import { getCountryRenderer } from "@/lib/country-renderers"
import { getCountryPageModel } from "@/lib/country-page-model"
import { CountrySharedFooter, CountrySharedStructuredData } from "@/components/country-page-shared"

type CountryLandingEngineProps = {
  slug: string
}

/** Central route dispatcher: specialized country experiences remain intact while using one engine entry point. */
export async function CountryLandingEngine({ slug }: CountryLandingEngineProps) {
  const Renderer = getCountryRenderer(slug)
  if (Renderer) {
    const page = await getCountryPageModel(slug)
    // Specialized renderers are selected centrally and now receive the same
    // data contract. Their visual identity is preserved while each renderer
    // is migrated away from direct repository reads.
    return <><CountryLocalLanguageBanner slug={slug} />{await Renderer(page)}<CountrySharedFooter page={page} /><CountrySharedStructuredData page={page} /></>
  }

  const config = getNewCountryConfig(slug)
  if (!config) throw new Error(`Missing centralized country landing configuration for ${slug}`)
  const page = await getCountryPageModel(slug)
  return <><CountryLocalLanguageBanner slug={slug} /><NewCountryLanding config={config} page={page} /></>
}
