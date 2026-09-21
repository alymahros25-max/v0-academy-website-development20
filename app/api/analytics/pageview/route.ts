import { NextResponse } from "next/server"

const MEASUREMENT_ID = "G-XPT3R8M0EC"
const CLIENT_ID_COOKIE = "ga4_client_id"
const SESSION_ID_COOKIE = "ga4_session_id"

function isGranted(request: Request) {
  return request.headers.get("cookie")?.split(";").some((cookie) => cookie.trim() === "analytics_consent=granted")
}

export async function POST(request: Request) {
  if (!isGranted(request)) return new NextResponse(null, { status: 204 })

  const apiSecret = process.env.GA4_API_SECRET?.trim()
  if (!apiSecret) return new NextResponse(null, { status: 204 })

  let body: { pathname?: string; page_title?: string; referrer?: string } = {}
  try {
    body = await request.json()
  } catch {
    return new NextResponse(null, { status: 400 })
  }

  const pathname = typeof body.pathname === "string" && body.pathname.startsWith("/")
    ? body.pathname.slice(0, 500)
    : "/"
  const pageTitle = typeof body.page_title === "string" ? body.page_title.slice(0, 200) : undefined
  const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : undefined

  const requestUrl = new URL(request.url)
  const existingClientId = request.headers.get("cookie")
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${CLIENT_ID_COOKIE}=`))
    ?.slice(`${CLIENT_ID_COOKIE}=`.length)
  const clientId = existingClientId || `${Date.now()}.${crypto.randomUUID()}`
  const existingSessionId = request.headers.get("cookie")
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${SESSION_ID_COOKIE}=`))
    ?.slice(`${SESSION_ID_COOKIE}=`.length)
  const sessionId = existingSessionId || String(Math.floor(Date.now() / 1000))

  const params: Record<string, string> = {
    page_location: `${requestUrl.origin}${pathname}`,
    page_path: pathname,
  }
  if (pageTitle) params.page_title = pageTitle
  if (referrer) params.page_referrer = referrer
  params.session_id = sessionId
  params.engagement_time_msec = "1000"
  params.session_engaged = "1"

  const response = await fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(MEASUREMENT_ID)}&api_secret=${encodeURIComponent(apiSecret)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        events: [{ name: "page_view", params }],
      }),
      cache: "no-store",
    },
  )

  const result = new NextResponse(null, { status: response.ok ? 204 : 502 })
  if (!existingClientId) {
    result.cookies.set(CLIENT_ID_COOKIE, clientId, {
      maxAge: 60 * 60 * 24 * 395,
      path: "/",
      sameSite: "lax",
      secure: requestUrl.protocol === "https:",
      httpOnly: true,
    })
  }
  if (!existingSessionId) {
    result.cookies.set(SESSION_ID_COOKIE, sessionId, {
      maxAge: 60 * 30,
      path: "/",
      sameSite: "lax",
      secure: requestUrl.protocol === "https:",
      httpOnly: true,
    })
  }
  return result
}
