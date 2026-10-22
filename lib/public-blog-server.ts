import { unstable_cache } from "next/cache"
import { getCanonicalBlogSlug } from "@/lib/blog-slugs"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export type PublicBlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  image: string
  publishedAt: string | null
  readTime: number
}

const fallbackPosts: PublicBlogPost[] = [
  {
    slug: "quran-memorization-techniques",
    title: "تقنيات عملية لحفظ القرآن الكريم ومراجعته",
    excerpt: "خطوات عملية لتنظيم حفظ القرآن ومراجعته، مع أفكار للتكرار والاستماع وفهم المعاني والمتابعة المناسبة لمستوى الطالب.",
    category: "تحفيظ القرآن",
    author: "فريق الأكاديمية",
    image: "/images/quran-memorization-techniques.webp",
    publishedAt: "2024-06-15T00:00:00.000Z",
    readTime: 9,
  },
  {
    slug: "quran-memorization-tools",
    title: "بوصلة الحافظ: 5 أدوات وطرق حديثة لتسهيل حفظ القرآن الكريم",
    excerpt: "خمس طرق وأدوات عملية تساعد على تنظيم حفظ القرآن الكريم وتثبيت المراجعة، مع التأكيد على التدرج والتلقي من معلّم متقن.",
    category: "تحفيظ القرآن",
    author: "فريق الأكاديمية",
    image: "/images/hero-children.jpg",
    publishedAt: "2026-07-25T00:00:00.000Z",
    readTime: 5,
  },
  {
    slug: "arabic-foundation-importance",
    title: "أهمية التأسيس الصحيح في اللغة العربية للأطفال",
    excerpt: "تعرف على أهمية تأسيس اللغة العربية للأطفال، وأفضل طرق تعليم الحروف والقراءة والكتابة وبناء مهارات لغوية قوية منذ الصغر.",
    category: "تأسيس العربية",
    author: "فريق الأكاديمية",
    image: "/images/arabic-foundation-importance.webp",
    publishedAt: "2024-06-10T00:00:00.000Z",
    readTime: 7,
  },
  {
    slug: "online-learning-benefits",
    title: "فوائد التعليم الإلكتروني في تحسين مستوى الطلاب",
    excerpt: "اكتشف فوائد التعليم الإلكتروني للأطفال ودور الحصص الفردية والتعلم عن بعد في تحسين التركيز والتحصيل والمهارات التعليمية.",
    category: "التعليم الإلكتروني",
    author: "فريق الأكاديمية",
    image: "/images/online-learning-benefits.webp",
    publishedAt: "2024-06-05T00:00:00.000Z",
    readTime: 8,
  },
  {
    slug: "easy-arabic-learning-for-children",
    title: "أساليب وأسس عملية لتسهيل تعلم اللغة العربية للأطفال",
    excerpt: "دليل عملي للآباء والمعلمين يوضح أسس وأساليب تجعل تعلم اللغة العربية أسهل وأكثر متعة وثباتاً لدى الأطفال.",
    category: "تأسيس العربية",
    author: "فريق الأكاديمية",
    image: "/images/arabic-learning-children-1.webp",
    publishedAt: "2026-09-11T00:00:00.000Z",
    readTime: 9,
  },
  {
    slug: "ahkam-noon-sakinah-tanween",
    title: "أحكام النون الساكنة والتنوين: شرح مبسط مع أمثلة قرآنية",
    excerpt: "شرح تعليمي موجز لأحكام النون الساكنة والتنوين الأربعة: الإظهار والإدغام والإقلاب والإخفاء، مع الحروف وأمثلة قرآنية ومصدر للمراجعة.",
    category: "تعليم التجويد",
    author: "فريق الأكاديمية",
    image: "/images/og-default.webp",
    publishedAt: "2026-09-27T00:00:00.000Z",
    readTime: 8,
  },
]

type CmsBlogPost = {
  slug: string
  title_ar: string | null
  excerpt_ar: string | null
  category_ar: string | null
  author_ar: string | null
  cover_image: string | null
  published_at: string | null
  read_time: number | null
}

async function readPublishedBlogPosts(): Promise<PublicBlogPost[]> {
  if (!supabaseAdmin) return fallbackPosts

  try {
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("slug,title_ar,excerpt_ar,category_ar,author_ar,cover_image,published_at,read_time")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("published_at", { ascending: false })
      .limit(100)

    if (error || !data) return fallbackPosts

    const posts = (data as CmsBlogPost[]).map((post) => ({
      slug: getCanonicalBlogSlug(post.slug),
      title: post.title_ar?.trim() || "مقالة تعليمية",
      excerpt: post.excerpt_ar?.trim() || "مقالة تعليمية من أكاديمية الحافظ المتميز.",
      category: post.category_ar?.trim() || "مقالات تعليمية",
      author: post.author_ar?.trim() || "فريق الأكاديمية",
      image: post.cover_image?.trim() || "/images/og-default.webp",
      publishedAt: post.published_at,
      readTime: post.read_time || 5,
    }))

    const bySlug = new Map(fallbackPosts.map((post) => [post.slug, post]))
    for (const post of posts) bySlug.set(post.slug, post)
    return [...bySlug.values()]
  } catch (error) {
    console.warn("[Public Blog] read failed:", error instanceof Error ? error.message : error)
    return fallbackPosts
  }
}

export const getPublishedBlogPosts = unstable_cache(
  readPublishedBlogPosts,
  ["public-blog-index"],
  { revalidate: 3600, tags: ["blog-posts"] },
)
