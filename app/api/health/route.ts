import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const dynamic = "force-dynamic"
export const revalidate = 0

const noStore = { "Cache-Control": "no-store" }

export async function GET() {
  const checkedAt = new Date().toISOString()
  if (!supabaseAdmin) {
    return NextResponse.json(
      { status: "degraded", checkedAt, checks: { database: "not_configured" } },
      { status: 503, headers: noStore },
    )
  }

  const checks = await Promise.all([
    supabaseAdmin.from("site_areas").select("id").limit(1),
    supabaseAdmin.from("blog_posts").select("id").eq("is_published", true).limit(1),
    supabaseAdmin.from("classroom_videos").select("id").eq("is_published", true).limit(1),
  ])

  const [areas, blog, classroomVideos] = checks
  const results = {
    database: areas.error ? "error" : "ok",
    siteAreas: areas.error ? "error" : "ok",
    publishedBlog: blog.error ? "error" : "ok",
    publishedClassroomVideos: classroomVideos.error ? "error" : "ok",
  }
  const healthy = Object.values(results).every((value) => value === "ok")

  return NextResponse.json(
    { status: healthy ? "ok" : "degraded", checkedAt, checks: results },
    { status: healthy ? 200 : 503, headers: noStore },
  )
}
