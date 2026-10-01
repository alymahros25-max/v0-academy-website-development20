"use client"

import { type ReactNode, useEffect } from "react"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { usePathname } from "next/navigation"
import { DeferredClientIntegrations } from "@/components/deferred-client-integrations"
import { TeachingLanguageNotice } from "@/components/teaching-language-notice"
import { countryPages } from "@/lib/country-pages-registry"

function LayoutWrapper({ children }: { children: ReactNode }) {
  const { dir, locale } = useI18n()
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")
  const isCountryLanding = countryPages.some(({ href }) => href === pathname)

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [dir, locale])

  if (isAdmin) {
    return <div dir={dir}>{children}</div>
  }

  if (isCountryLanding) {
    return (
      <div dir={dir}>
        {!isAdmin && <DeferredClientIntegrations />}
        {children}
      </div>
    )
  }

  return (
    <div dir={dir} className="flex flex-col min-h-screen">
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
      <LayoutWrapper>{children}</LayoutWrapper>
    </I18nProvider>
  )
}
