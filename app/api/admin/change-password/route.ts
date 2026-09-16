import { NextRequest, NextResponse } from "next/server"
import { randomBytes, scryptSync } from "crypto"
import { verifyAdminSession } from "@/lib/admin-auth"

function encodePassword(password: string) {
  const salt = randomBytes(16)
  const derived = scryptSync(password, salt, 64)
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`
}

export async function POST(request: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  const password = typeof body.newPassword === "string" ? body.newPassword : ""
  if (password.length < 12) return NextResponse.json({ error: "كلمة المرور يجب أن تكون 12 حرفًا على الأقل" }, { status: 400 })
  const hash = encodePassword(password)
  return NextResponse.json({
    success: true,
    requiresVercelUpdate: true,
    envVar: "ADMIN_PASSWORD_SCRYPT_HASH",
    hash,
    message: "تم توليد hash. يجب تحديث متغير ADMIN_PASSWORD_SCRYPT_HASH في Vercel ثم إعادة النشر قبل استخدام كلمة المرور الجديدة.",
  })
}
