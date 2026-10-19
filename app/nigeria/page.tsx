import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { NigeriaLanding } from "@/components/country-landings/NigeriaLanding"
import { nigeriaLandingConfig } from "@/lib/nigeria-landing-config"
const canonical = nigeriaLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("nigeria")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="nigeria" />
}
