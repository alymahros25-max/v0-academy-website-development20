import { NextResponse } from "next/server"
import { addMessage, getMessages } from "@/lib/data-store"
import { z } from "zod"
import { verifyAdminSession } from "@/lib/admin-auth"
import { consumeRateLimit, getClientIp, rateLimitResponse } from "@/lib/request-rate-limit"
import { recordInternalAnalyticsEvent } from "@/lib/internal-analytics"

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().min(1).max(5000),
  subject: z.string().trim().max(200).optional().default("Contact Form"),
  language: z.enum(["ar", "en", "fr"]).optional().default("ar"),
}).strict()

async function notifyContactByEmail(message: { name: string; email: string; phone: string; subject: string; message: string }) {
  const apiKey = process.env.RESEND_API_KEY
  const recipient = process.env.CONTACT_INBOX_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@quran-elhafez.com"
  const sender = process.env.CONTACT_FROM_EMAIL || "info@quran-elhafez.com"
  if (!apiKey) return false
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      reply_to: [message.email],
      subject: `رسالة جديدة من الموقع: ${message.subject}`,
      text: `الاسم: ${message.name}\nالبريد: ${message.email}\nالهاتف: ${message.phone || "غير مذكور"}\n\n${message.message}`,
    }),
  })
  return response.ok
}

export async function POST(request: Request) {
  try {
    const limit = consumeRateLimit(`contact:${getClientIp(request)}`, 5, 10 * 60_000)
    if (!limit.allowed) return rateLimitResponse(limit.retryAfterSeconds)

    const parsed = contactSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid contact form data" }, { status: 400 })
    }
    const { name, email, phone, message, subject, language } = parsed.data

    const newMessage = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || "",
      subject: subject || "Contact Form",
      message,
      language: language || "ar",
      createdAt: new Date().toISOString(),
      read: false,
      replied: false,
    }

    await addMessage(newMessage)
    void recordInternalAnalyticsEvent({
      eventName: "contact_form_submit",
      pagePath: "/contact",
      consentState: "server-confirmed",
    })
    try {
      await notifyContactByEmail({ name, email, phone, subject, message })
    } catch (emailError) {
      console.error("Contact email notification error:", emailError)
    }

    return NextResponse.json({
      success: true,
      message:
        language === "ar"
          ? "تم إرسال رسالتك بنجاح"
          : language === "fr"
            ? "Votre message a été envoyé avec succès"
            : "Message sent successfully",
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const messages = await getMessages()
    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    return NextResponse.json({ messages: [] })
  }
}
