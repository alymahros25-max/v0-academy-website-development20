"use client"

import { type ReactNode, useEffect } from "react"
import dynamic from "next/dynamic"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { usePathname } from "next/navigation"
import { DeferredClientIntegrations } from "@/components/deferred-client-integrations"
import { GoogleAnalyticsConsent } from "@/components/google-analytics-consent"
import { PublicWidgetLayer } from "@/components/public-widget-layer"

const Header = dynamic(() => import("@/components/layout/header").then((module) => module.Header))
const Footer = dynamic(() => import("@/components/layout/footer").then((module) => module.Footer))
const TeachingLanguageNotice = dynamic(() => import("@/components/teaching-language-notice").then((module) => module.TeachingLanguageNotice))

function LayoutWrapper({ children }: { children: ReactNode }) {
  const { dir, locale } = useI18n()
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")
  const isCountryArticle = pathname.startsWith("/blog/country/")
  const isSaudiLanding = pathname === "/saudi-arabia"
  const isUaeLanding = pathname === "/united-arab-emirates"
  const isUnitedStatesLanding = pathname === "/united-states"
  const isCanadaLanding = pathname === "/canada"
  const isUnitedKingdomLanding = pathname === "/united-kingdom"
  const isAustraliaLanding = pathname === "/australia"
  const isGermanyLanding = pathname === "/germany"
  const isKuwaitLanding = pathname === "/kuwait"
  const isNewCountryLanding = [
    "/qatar",
    "/oman",
    "/jordan",
    "/bahrain",
    "/france",
    "/spain",
    "/netherlands",
    "/belgium",
    "/sweden",
    "/south-africa",
    "/china",
    "/italy",
    "/russia",
    "/norway",
    "/austria",
    "/switzerland",
    "/brazil",
    "/mexico",
    "/colombia",
    "/venezuela",
    "/denmark",
    "/greece",
    "/new-zealand",
    "/finland",
    "/turkey",
    "/indonesia",
    "/malaysia",
    "/portugal",
    "/poland",
    "/argentina",
    "/senegal",
    "/nigeria",
  ].includes(pathname)

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [dir, locale])

  if (isAdmin) {
    return <div dir={dir}>{children}</div>
  }

  if (isCountryArticle || isSaudiLanding || isUaeLanding || isUnitedStatesLanding || isCanadaLanding || isUnitedKingdomLanding || isAustraliaLanding || isGermanyLanding || isKuwaitLanding || isNewCountryLanding) {
    return (
      <div dir={dir}>
        <GoogleAnalyticsConsent />
        <DeferredClientIntegrations />
        {children}
      </div>
    )
  }

  return (
    <div dir={dir} className="flex flex-col min-h-screen">
      <GoogleAnalyticsConsent />
      <DeferredClientIntegrations />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <TeachingLanguageNotice />
    </div>
  )
}

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <PublicWidgetLayer />
      <LayoutWrapper>{children}</LayoutWrapper>
    </I18nProvider>
  )
}
