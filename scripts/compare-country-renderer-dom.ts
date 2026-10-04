import { promises as fs } from "node:fs"
import path from "node:path"
import { newCountryConfigs } from "@/lib/new-country-pages"

type Signature = {
  status: number
  title: string
  robots: string
  h1Count: number
  h2Count: number
  detailCount: number
  linkCount: number
  textLength: number
  centralMarker: boolean
}

function count(html: string, pattern: RegExp) {
  return (html.match(pattern) ?? []).length
}

function tagText(html: string, tag: string) {
  const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"))
  return match?.[1]?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() ?? ""
}

function signature(status: number, html: string): Signature {
  const visibleText = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  const robots = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)/i)?.[1] ?? ""
  return {
    status,
    title: tagText(html, "title"),
    robots,
    h1Count: count(html, /<h1\b/gi),
    h2Count: count(html, /<h2\b/gi),
    detailCount: count(html, /<details\b/gi),
    linkCount: count(html, /<a\b/gi),
    textLength: visibleText.length,
    centralMarker: html.includes('data-renderer="central"'),
  }
}

async function fetchPage(baseUrl: string, route: string) {
  const response = await fetch(`${baseUrl}${route}`)
  return { status: response.status, html: await response.text() }
}

async function main() {
  const baseUrl = process.env.DOM_COMPARE_BASE_URL ?? "http://127.0.0.1:3021"
  const token = process.env.COUNTRY_PREVIEW_TOKEN ?? ""
  const pages = []
  for (const config of newCountryConfigs) {
    const current = await fetchPage(baseUrl, `/${config.slug}`)
    const central = await fetchPage(baseUrl, `/country-preview/${config.slug}?token=${encodeURIComponent(token)}`)
    const currentSignature = signature(current.status, current.html)
    const centralSignature = signature(central.status, central.html)
    pages.push({
      slug: config.slug,
      current: currentSignature,
      central: centralSignature,
      differences: {
        status: current.status !== central.status,
        title: currentSignature.title !== centralSignature.title,
        h1Count: currentSignature.h1Count !== centralSignature.h1Count,
        h2Count: currentSignature.h2Count !== centralSignature.h2Count,
        detailCount: currentSignature.detailCount !== centralSignature.detailCount,
        linkCount: currentSignature.linkCount !== centralSignature.linkCount,
        textLength: currentSignature.textLength !== centralSignature.textLength,
      },
    })
    console.log(`${config.slug}: current ${current.status}/${currentSignature.h1Count} h1, central ${central.status}/${centralSignature.h1Count} h1`)
  }

  const report = {
    schemaVersion: 1,
    baseUrl,
    scope: "NewCountryLanding first batch",
    currentRenderer: "NewCountryLanding",
    centralRenderer: "CountryPageRenderer",
    pages,
    summary: {
      pages: pages.length,
      currentSuccess: pages.filter((page) => page.current.status === 200).length,
      centralSuccess: pages.filter((page) => page.central.status === 200 && page.central.centralMarker).length,
      pagesWithDomDifferences: pages.filter((page) => Object.values(page.differences).some(Boolean)).length,
      visualParity: "signature-only",
    },
    note: "This is a lightweight server HTML signature comparison, not a pixel screenshot comparison.",
  }
  const outputPath = path.join(process.cwd(), "docs/country-renderer-dom-comparison.json")
  await fs.writeFile(outputPath, JSON.stringify(report, null, 2) + "\n", "utf8")
  console.log(`Wrote ${outputPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
