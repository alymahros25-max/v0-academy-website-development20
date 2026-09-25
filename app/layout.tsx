import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { GoogleAnalytics } from "@next/third-parties/google"
import { Noto_Sans_Arabic, Inter } from "next/font/google"
import { ErrorBoundary } from "@/components/error-boundary"
import { generateEducationalOrganizationSchema, generateWebSiteSchema, generateCombinedSchema } from "@/lib/schema"
import "./globals.css"
import { ClientProviders } from "@/components/client-providers"
import { AnalyticsConsent } from "@/components/analytics-consent"

const rootStructuredData = generateCombinedSchema(
  generateEducationalOrganizationSchema(),
  generateWebSiteSchema(),
)

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["400", "700"],
  preload: true,
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL("https://quran-elhafez.com"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  title: "أكاديمية الحافظ المتميز أون لاين | تحفيظ قرآن وتأسيس عربي",
  description:
    "أكاديمية الحافظ المتميز لتحفيظ القرآن وتأسيس اللغة العربية أون لاين للناطقين بالعربية، مع حصص فردية ومعلمين مؤهلين ومواعيد مرنة.",
  authors: [{ name: "أكاديمية الحافظ المتميز" }],
  creator: "أكاديمية الحافظ المتميز",
  alternates: { canonical: "https://quran-elhafez.com/" },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: [
      "ar_AE", "ar_KW", "ar_QA", "ar_BH", "ar_OM", "ar_JO",
      "ar_US", "ar_CA", "ar_GB", "ar_AU", "ar_FR", "ar_DE", "ar_ES", "ar_NL", "ar_BE", "ar_SE",
      "en_US", "en_GB", "fr_FR",
    ],
    url: "https://quran-elhafez.com",
    siteName: "أكاديمية الحافظ المتميز اون لاين",
    title: "أكاديمية الحافظ المتميز أون لاين | تحفيظ قرآن وتأسيس عربي",
    description:
      "تحفيظ القرآن وتأسيس العربية أون لاين للناطقين بالعربية، مع تعليم فردي مباشر عن بعد وخطة تناسب مستوى الطالب.",
    images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "أكاديمية الحافظ المتميز اون لاين",
    description:
      "تعليم القرآن وتأسيس اللغة العربية أونلاين للطلاب العرب بحصص فردية مباشرة وخطة تناسب احتياج كل طالب.",
    images: ["https://quran-elhafez.com/images/og-default.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "serviceable-regions": "SA,AE,KW,QA,OM,JO,BH,US,CA,GB,AU,DE,FR,ES,NL,BE,SE",
  },
}

export const viewport: Viewport = {
  themeColor: "#5680A8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

const consentModeScript = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });
`

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <Script id="google-consent-mode" strategy="beforeInteractive">
          {consentModeScript}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootStructuredData) }}
        />
      </head>
      <body className={`${notoArabic.variable} ${inter.variable} font-sans antialiased`}>
        <ErrorBoundary context="RootLayout">
          <ClientProviders>{children}</ClientProviders>
        </ErrorBoundary>
        <AnalyticsConsent />
        <GoogleAnalytics gaId="G-XPT3R8M0EC" />
      </body>
    </html>
  )
}
