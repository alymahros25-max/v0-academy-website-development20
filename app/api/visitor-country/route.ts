import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const countryHeaders = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "x-country-code",
  "x-appengine-country",
]

export function GET(request: Request) {
  const countryCode = countryHeaders
    .map((name) => request.headers.get(name))
    .find((value) => value && /^[A-Za-z]{2}$/.test(value))
    ?.toUpperCase() ?? null

  return NextResponse.json(
    { countryCode },
    { headers: { "Cache-Control": "private, no-store" } },
  )
}
