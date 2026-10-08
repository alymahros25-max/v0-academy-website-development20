import { z } from "zod"
import { saudiLandingConfig } from "@/lib/saudi-landing-config"
import { uaeLandingConfig } from "@/lib/uae-landing-config"

export const landingPageSlugs = ["saudi-arabia", "uae"] as const
export type LandingPageSlug = (typeof landingPageSlugs)[number]

export const landingPageConfigSchema = z.object({
  seo: z.object({
    title: z.string().trim().min(1).max(160),
    description: z.string().trim().min(1).max(320),
    canonical: z.string().url().refine((value) => value.startsWith("https://"), "Canonical URL must use HTTPS"),
  }).strict(),
  heroTitle: z.string().trim().min(1).max(180),
  heroDescription: z.string().trim().min(1).max(1200),
  closingTitle: z.string().trim().min(1).max(180),
  closingDescription: z.string().trim().min(1).max(1200),
}).strict()
export type LandingPageConfig = z.infer<typeof landingPageConfigSchema>

export const defaultLandingPageConfigs: Record<LandingPageSlug, LandingPageConfig> = {
  "saudi-arabia": {
    seo: { ...saudiLandingConfig.seo },
    heroTitle: "تحفيظ القرآن أونلاين في السعودية",
    heroDescription: "إذا كنت تبحث عن تعلّم القرآن أو تأسيس العربية أونلاين في السعودية، تقدّم أكاديمية الحافظ المتميز حصصًا فردية مباشرة باللغة العربية. تشمل الحصص حفظ القرآن ومراجعته وتلاوته وتجويده، إلى جانب تأسيس القراءة والكتابة بالعربية، عبر Zoom أو Google Meet.",
    closingTitle: "ابدأ بالحصة التجريبية الأولى المجانية",
    closingDescription: "أرسل لنا بيانات الطالب والوقت المناسب، وسنساعدك في اختيار البرنامج الأفضل.",
  },
  uae: {
    seo: { ...uaeLandingConfig.seo },
    heroTitle: "تحفيظ القرآن أونلاين في الإمارات",
    heroDescription: "إذا كنت تبحث عن تحفيظ القرآن أونلاين في الإمارات، تقدم الأكاديمية حصصًا فردية مباشرة باللغة العربية لتحفيظ القرآن ومراجعته وتلاوته وتجويده، مع إمكانية تأسيس العربية قراءة وكتابة. تتم الحصص عبر Zoom أو Google Meet، ويبدأ التواصل عبر WhatsApp.",
    closingTitle: "ابدأ بالحصة التجريبية الأولى المجانية",
    closingDescription: "أرسل لنا بيانات الطالب والوقت المناسب، وسنساعدك في اختيار البرنامج الأفضل.",
  },
}
