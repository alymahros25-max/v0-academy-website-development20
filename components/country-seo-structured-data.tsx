import { getCountrySchemaGraph } from "@/lib/country-seo"

type CountrySeoStructuredDataProps = { slug: string }

export function CountrySeoStructuredData({ slug }: CountrySeoStructuredDataProps) {
  const jsonLd = JSON.stringify(getCountrySchemaGraph(slug)).replace(/</g, "\\u003c")
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
}
