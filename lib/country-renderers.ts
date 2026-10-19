import type { ReactElement } from "react"
import type { CountryPageModel } from "@/lib/country-page-model"
import { ArgentinaLanding } from "@/components/country-landings/ArgentinaLanding"
import { BrazilLanding } from "@/components/country-landings/BrazilLanding"
import { CanadaLanding } from "@/components/country-landings/CanadaLanding"
import { ChinaLanding } from "@/components/country-landings/ChinaLanding"
import { ColombiaLanding } from "@/components/country-landings/ColombiaLanding"
import { DenmarkLanding } from "@/components/country-landings/DenmarkLanding"
import { FinlandLanding } from "@/components/country-landings/FinlandLanding"
import { GreeceLanding } from "@/components/country-landings/GreeceLanding"
import { IndonesiaLanding } from "@/components/country-landings/IndonesiaLanding"
import { ItalyLanding } from "@/components/country-landings/ItalyLanding"
import { MalaysiaLanding } from "@/components/country-landings/MalaysiaLanding"
import { MexicoLanding } from "@/components/country-landings/MexicoLanding"
import { NewZealandLanding } from "@/components/country-landings/NewZealandLanding"
import { NigeriaLanding } from "@/components/country-landings/NigeriaLanding"
import { NorwayLanding } from "@/components/country-landings/NorwayLanding"
import { PolandLanding } from "@/components/country-landings/PolandLanding"
import { PortugalLanding } from "@/components/country-landings/PortugalLanding"
import { RussiaLanding } from "@/components/country-landings/RussiaLanding"
import { SaudiArabiaLanding } from "@/components/country-landings/SaudiArabiaLanding"
import { SenegalLanding } from "@/components/country-landings/SenegalLanding"
import { SouthAfricaLanding } from "@/components/country-landings/SouthAfricaLanding"
import { SwitzerlandLanding } from "@/components/country-landings/SwitzerlandLanding"
import { TurkeyLanding } from "@/components/country-landings/TurkeyLanding"
import { UaeLanding } from "@/components/country-landings/UaeLanding"
import { UnitedKingdomLanding } from "@/components/country-landings/UnitedKingdomLanding"
import { UnitedStatesLanding } from "@/components/country-landings/UnitedStatesLanding"
import { VenezuelaLanding } from "@/components/country-landings/VenezuelaLanding"

export type CountryRenderer = (page: CountryPageModel) => Promise<ReactElement>

/**
 * Compatibility registry for the 27 specialized experiences.
 *
 * This is the first migration step: routes no longer choose a component
 * themselves. The renderers remain visually independent until their data,
 * shell, and Schema responsibilities are moved behind CountryPageModel.
 */
export const countryRenderers: Readonly<Record<string, CountryRenderer>> = {
  "saudi-arabia": SaudiArabiaLanding,
  "united-arab-emirates": UaeLanding,
  "united-states": UnitedStatesLanding,
  "united-kingdom": UnitedKingdomLanding,
  canada: CanadaLanding,
  brazil: BrazilLanding,
  china: ChinaLanding,
  indonesia: IndonesiaLanding,
  nigeria: NigeriaLanding,
  "south-africa": SouthAfricaLanding,
  italy: ItalyLanding,
  russia: RussiaLanding,
  norway: NorwayLanding,
  switzerland: SwitzerlandLanding,
  mexico: MexicoLanding,
  colombia: ColombiaLanding,
  venezuela: VenezuelaLanding,
  denmark: DenmarkLanding,
  greece: GreeceLanding,
  "new-zealand": NewZealandLanding,
  finland: FinlandLanding,
  turkey: TurkeyLanding,
  malaysia: MalaysiaLanding,
  portugal: PortugalLanding,
  poland: PolandLanding,
  argentina: ArgentinaLanding,
  senegal: SenegalLanding,
}

export function getCountryRenderer(slug: string): CountryRenderer | undefined {
  return countryRenderers[slug]
}
