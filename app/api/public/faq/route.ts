import { NextResponse } from "next/server"
import { siteFaqRepository } from "@/lib/repositories"

export const revalidate = 0

export async function GET() {
  if (!siteFaqRepository) return NextResponse.json([], { headers: { "Cache-Control": "no-store" } })
  try {
    const data = await siteFaqRepository.listPublic()
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("[Public FAQ] Failed to load FAQ:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "FAQ unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } })
  }
}
