const CURRENCY_SYMBOLS: Readonly<Record<string, string>> = {
  QAR: "ر.ق",
  AED: "د.إ",
  USD: "$",
  SAR: "ر.س",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  EUR: "€",
  KWD: "د.ك",
  BHD: "د.ب",
  OMR: "ر.ع",
  JOD: "د.أ",
  SEK: "kr",
  ZAR: "R",
  CNY: "¥",
  RUB: "₽",
  NOK: "kr",
  CHF: "CHF",
  BRL: "R$",
  MXN: "MX$",
  COP: "COP$",
  VES: "VES",
  DKK: "kr",
  NZD: "NZ$",
  TRY: "₺",
  IDR: "Rp",
  MYR: "RM",
  PLN: "zł",
  ARS: "ARS$",
  XOF: "CFA",
  NGN: "₦",
}

const CURRENCY_NAMES_AR: Readonly<Record<string, string>> = {
  QAR: "ريال قطري",
  AED: "درهم إماراتي",
  USD: "دولار أمريكي",
  SAR: "ريال سعودي",
  GBP: "جنيه إسترليني",
  CAD: "دولار كندي",
  AUD: "دولار أسترالي",
  EUR: "يورو",
  KWD: "دينار كويتي",
  BHD: "دينار بحريني",
  OMR: "ريال عماني",
  JOD: "دينار أردني",
  SEK: "كرونة سويدية",
  ZAR: "راند جنوب أفريقي",
  CNY: "يوان صيني",
  RUB: "روبل روسي",
  NOK: "كرونة نرويجية",
  CHF: "فرنك سويسري",
  BRL: "ريال برازيلي",
  MXN: "بيزو مكسيكي",
  COP: "بيزو كولومبي",
  VES: "بوليفار فنزويلي",
  DKK: "كرونة دنماركية",
  NZD: "دولار نيوزيلندي",
  TRY: "ليرة تركية",
  IDR: "روبية إندونيسية",
  MYR: "رينغيت ماليزي",
  PLN: "زلوتي بولندي",
  ARS: "بيزو أرجنتيني",
  XOF: "فرنك غرب أفريقي",
  NGN: "نايرا نيجيري",
}

/** Returns the local symbol and Arabic currency name, without repeating the country. */
export function formatCurrencyPresentation(currencyCode: string | null | undefined, fallbackSymbol?: string | null): string {
  const code = currencyCode?.trim().toUpperCase() ?? ""
  const symbol = CURRENCY_SYMBOLS[code]
    ?? (fallbackSymbol?.trim() && !/^[A-Z]{3}$/u.test(fallbackSymbol.trim()) ? fallbackSymbol.trim() : code)
  const name = CURRENCY_NAMES_AR[code]
    ?? (code && typeof Intl !== "undefined" ? new Intl.DisplayNames(["ar"], { type: "currency" }).of(code) : undefined)
    ?? "العملة المحلية"
  return `${symbol || code} — ${name}`
}
