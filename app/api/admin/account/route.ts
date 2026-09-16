import { NextResponse } from "next/server"
import { verifyAdminSession } from "@/lib/admin-auth"

export async function GET() {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return NextResponse.json({ email: process.env.ADMIN_EMAIL ?? "", source: "Vercel environment variable ADMIN_EMAIL" })
}

export async function POST() {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return NextResponse.json({
    error: "تغيير البريد الأساسي يتم من Vercel فقط لأن ADMIN_EMAIL هو مصدر التوثيق الرئيسي.",
    envVar: "ADMIN_EMAIL",
    requiresVercelUpdate: true,
  }, { status: 409 })
}
