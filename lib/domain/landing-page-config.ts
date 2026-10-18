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
    heroTitle: "تحفيظ القرآن وتعليم العربية أونلاين في السعودية",
    heroDescription: "تقدم الأكاديمية حصصًا فردية مباشرة عبر الإنترنت باللغة العربية لتحفيظ القرآن ومراجعته وتصحيح التلاوة، إلى جانب مسار لتأسيس القراءة والكتابة العربية. تعرّف إلى تفاصيل كل مسار واختر ما يلائم حاجة المتعلم قبل التواصل.",
    closingTitle: "ابدأ بالحصة التجريبية الأولى المجانية",
    closingDescription: "أرسل لنا بيانات الطالب والوقت المناسب، وسنساعدك في اختيار البرنامج الأفضل.",
  },
  uae: {
    seo: { ...uaeLandingConfig.seo },
    heroTitle: "تحفيظ القرآن ومراجعته أونلاين في الإمارات",
    heroDescription: "للطلاب في الإمارات، تقدم الأكاديمية حصصًا فردية مباشرة باللغة العربية لحفظ القرآن ومراجعته والتدرب على التلاوة والتجويد. ويتوفر مسار مستقل لتأسيس القراءة والكتابة بالعربية بحسب حاجة الطالب.",
    closingTitle: "ابدأ بالحصة التجريبية الأولى المجانية",
    closingDescription: "أرسل لنا بيانات الطالب والوقت المناسب، وسنساعدك في اختيار البرنامج الأفضل.",
  },
}
