import { getPublicContent } from "@/lib/public-content-server"
import type { PublicContent } from "@/lib/public-content"

const HOMEPAGE_CONTENT_TIMEOUT_MS = 500

export const homepageContentFallback: Record<string, PublicContent> = {
  hero_title: {
    key: "hero_title",
    content_ar: "تحفيظ القرآن وتأسيس اللغة العربية أونلاين للناطقين بالعربية",
    content_en: "Online Quran memorization and Arabic foundation lessons for Arabic speakers",
    content_fr: "Mémorisation du Coran et cours de langue arabe en ligne pour les arabophones",
  },
  hero_subtitle: {
    key: "hero_subtitle",
    content_ar:
      "حصص فردية مباشرة للأطفال والكبار والمبتدئين، للحفظ والمراجعة وتصحيح التلاوة وتعلم التجويد، ولتأسيس القراءة والكتابة والإملاء باللغة العربية.",
    content_en:
      "One-to-one live lessons for children, adults, and beginners covering memorization, revision, recitation, Tajweed, and Arabic literacy.",
    content_fr:
      "Cours individuels en direct pour enfants, adultes et débutants : mémorisation, révision, récitation, tajwid et bases de l’arabe.",
  },
  homepage_seo_title: {
    key: "homepage_seo_title",
    content_ar: "تحفيظ القرآن وتأسيس العربية أونلاين | الحافظ المتميز",
    content_en: "Online Quran Memorization and Arabic Foundation | Al-Hafiz Academy",
    content_fr: "Mémorisation du Coran et bases de l’arabe en ligne | Académie Al-Hafiz",
  },
  homepage_seo_description: {
    key: "homepage_seo_description",
    content_ar:
      "تحفيظ القرآن وتعليم التجويد وتأسيس القراءة والكتابة العربية أونلاين بحصص فردية للأطفال والكبار والناطقين بالعربية، مع حصة تجريبية مجانية ومواعيد مرنة.",
    content_en:
      "Online Quran memorization, Tajweed, and Arabic literacy through one-to-one lessons for children, adults, and Arabic-speaking learners, with a free trial lesson.",
    content_fr:
      "Mémorisation du Coran, tajwid et bases de la lecture et de l’écriture arabes en ligne, avec cours individuels et séance d’essai gratuite.",
  },
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Homepage content read timed out")), timeoutMs)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      },
    )
  })
}

/**
 * Supabase/CMS is the canonical editable source. The immutable values above
 * are only an outage/timeout safety net so critical SEO HTML never disappears.
 */
export async function getHomepageContent(): Promise<Record<string, PublicContent>> {
  try {
    const content = await withTimeout(
      getPublicContent(Object.keys(homepageContentFallback)),
      HOMEPAGE_CONTENT_TIMEOUT_MS,
    )
    return { ...homepageContentFallback, ...content }
  } catch (error) {
    console.warn("[Homepage Content] using emergency fallback:", error instanceof Error ? error.message : error)
    return homepageContentFallback
  }
}
