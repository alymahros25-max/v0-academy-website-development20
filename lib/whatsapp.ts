export const DEFAULT_WHATSAPP_PHONE = "201130127894"

export const DEFAULT_WHATSAPP_MESSAGE_TEMPLATE_AR =
  "السلام عليكم، وصلتكم من {source}.\nالبرنامج: تحفيظ القرآن / تأسيس العربية / كلاهما\nاسم الطالب:\nالعمر:\nملاحظات:"

export function normalizeWhatsAppPhone(value: unknown): string | null {
  const digits = String(value ?? "").replace(/\D/g, "")
  return /^\d{8,15}$/.test(digits) ? digits : null
}

export function createWhatsAppMessage(
  country?: string,
  template = DEFAULT_WHATSAPP_MESSAGE_TEMPLATE_AR,
  program?: string,
): string {
  const source = country
    ? `صفحة ${country} بموقع أكاديمية الحافظ المتميز`
    : "موقع أكاديمية الحافظ المتميز"
  const safeTemplate = template.trim() || DEFAULT_WHATSAPP_MESSAGE_TEMPLATE_AR
  const message = safeTemplate.replaceAll("{source}", source)
  return program ? message.replace(/^البرنامج:.*$/m, `البرنامج: ${program}`) : message
}

export function createWhatsAppUrl(phone: unknown, message: string): string {
  const number = normalizeWhatsAppPhone(phone) ?? DEFAULT_WHATSAPP_PHONE
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
