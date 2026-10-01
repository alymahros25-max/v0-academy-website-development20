import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CountryPageRenderer } from "@/components/country-pages/country-page-renderer"
import { getCountryPageModel } from "@/lib/country-pages/repository"
import { getNewCountryConfig } from "@/lib/new-country-pages"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const config = getNewCountryConfig(slug)
  return {
    title: config ? `Preview: ${config.seoTitle}` : "Country preview",
    robots: { index: false, follow: false },
  }
}

export default async function CountryPreviewPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ token?: string }> }) {
  const expectedToken = process.env.COUNTRY_PREVIEW_TOKEN
  const { token } = await searchParams
  if (!expectedToken || token !== expectedToken) notFound()
  const { slug } = await params
  const page = await getCountryPageModel(slug)
  if (!page) notFound()
  return <CountryPageRenderer page={page} />
}
