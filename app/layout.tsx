import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { ErrorBoundary } from "@/components/error-boundary"
import { generateEducationalOrganizationSchema, generateWebSiteSchema, generateCombinedSchema } from "@/lib/schema"
import "./globals.css"
import { ClientProviders } from "@/components/client-providers"
import { ThemeApplicator } from "@/components/theme-applicator"
import Script from "next/script"

const rootStructuredData = generateCombinedSchema(
  generateEducationalOrganizationSchema(),
  generateWebSiteSchema(),
)

const notoArabic = localFont({
  src: "./fonts/noto-sans-arabic-subset.woff2",
  variable: "--font-arabic",
  display: "swap",
  weight: "100 900",
  preload: true,
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
    "أكاديمية الحافظ المتميز لتحفيظ القرآن وتأسيس اللغة العربية أون لاين للناطقين بالعربية فقط؛ تُقدَّم الحصص باللغة العربية، مع دروس فردية ومواعيد مرنة.",
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
    url: "https://quran-elhafez.com/",
    siteName: "أكاديمية الحافظ المتميز",
    title: "أكاديمية الحافظ المتميز أون لاين | تحفيظ قرآن وتأسيس عربي",
    description:
      "تحفيظ القرآن وتأسيس العربية أون لاين للناطقين بها فقط؛ تُقدَّم الحصص بالعربية ضمن دروس فردية مباشرة وخطة تناسب مستوى الطالب.",
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/hero-children-mobile.webp"
          media="(max-width: 767px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/hero-children.webp"
          media="(min-width: 768px)"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootStructuredData) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VE5L1XDFT3"
          strategy="lazyOnload"
        />
        <Script id="google-tag-config" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-VE5L1XDFT3');`}
        </Script>
      </head>
      <body className={`${notoArabic.variable} font-sans antialiased`}>
        <ThemeApplicator />
        <ErrorBoundary context="RootLayout">
          <ClientProviders>{children}</ClientProviders>
        </ErrorBoundary>
      </body>
    </html>
  )
}
