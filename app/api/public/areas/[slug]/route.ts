import { NextResponse } from "next/server"
import { getAreaLandingData } from "@/lib/country-content"

export const revalidate = 0

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const { area, packages, faq, content, links, theme, cities, timezones } = await getAreaLandingData(slug)

  if (!area) {
    return NextResponse.json({ error: "Area not found" }, { status: 404 })
  }

  return NextResponse.json(
    { area, packages, faq, content, links, theme, cities, timezones },
    { headers: { "Cache-Control": "no-store" } },
  )
}
