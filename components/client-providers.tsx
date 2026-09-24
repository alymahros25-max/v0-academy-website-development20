"use client"

import { type ReactNode, useEffect } from "react"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FloatingButtons } from "@/components/floating-buttons"
import { usePathname } from "next/navigation"
import { GA4Tracker } from "@/components/ga4-tracker"
import { ClarityTracker } from "@/components/clarity-tracker"

function LayoutWrapper({ children }: { children: ReactNode }) {
  const { dir, locale } = useI18n()
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")
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
  ].includes(pathname)

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [dir, locale])

  if (isAdmin) {
    return <div dir={dir}>{children}</div>
  }

  if (isSaudiLanding || isUaeLanding || isUnitedStatesLanding || isCanadaLanding || isUnitedKingdomLanding || isAustraliaLanding || isGermanyLanding || isKuwaitLanding || isNewCountryLanding) {
    return (
      <div dir={dir}>
        {!isAdmin && <><GA4Tracker /><ClarityTracker /></>}
        {children}
      </div>
    )
  }

  return (
    <div dir={dir} className="flex flex-col min-h-screen">
      <GA4Tracker />
      <ClarityTracker />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingButtons />
    </div>
  )
}

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <LayoutWrapper>{children}</LayoutWrapper>
    </I18nProvider>
  )
}
