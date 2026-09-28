import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE_URL = 'https://quran-elhafez.com'

type BlogArticle = { slug: string; lastModified?: string }

async function getDynamicBlogArticles(): Promise<BlogArticle[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    // CI and local builds may intentionally omit Supabase secrets; use the
    // deterministic filesystem fallback without logging a misleading error.
    if (!supabaseUrl || !supabaseKey) return getBlogArticlesFromFilesystem()

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data: articles, error } = await supabase
      .from('blog_posts')
      .select('slug, created_at, updated_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(100)
    if (error) throw error

    const dynamicArticles = (articles || []).map((article) => ({
        slug: article.slug,
        lastModified: article.updated_at || article.created_at,
      }))

    return mergeBlogArticles(dynamicArticles)
  } catch (error) {
    console.warn('[sitemap] Failed to fetch from Supabase:', error)
    return getBlogArticlesFromFilesystem()
  }
}

const supportedBlogSlugs = new Set([
  'quran-memorization-techniques',
  'arabic-foundation-importance',
  'online-learning-benefits',
  'easy-arabic-learning-for-children',
  'ahkam-noon-sakinah-tanween',
])

function getBlogArticlesFromFilesystem(): BlogArticle[] {
  return [...supportedBlogSlugs].map((slug) => ({ slug }))
}

function mergeBlogArticles(dynamicArticles: BlogArticle[]): BlogArticle[] {
  const articlesBySlug = new Map<string, BlogArticle>()
  for (const article of getBlogArticlesFromFilesystem()) articlesBySlug.set(article.slug, article)
  for (const article of dynamicArticles) {
    const fallback = articlesBySlug.get(article.slug)
    articlesBySlug.set(article.slug, { ...fallback, ...article })
  }
  return [...articlesBySlug.values()]
}

const staticRoutes = [
  '/',
  '/quran',
  '/arabic',
  '/about',
  '/saudi-arabia',
  '/united-arab-emirates',
  '/united-states',
  '/canada',
  '/united-kingdom',
  '/australia',
  '/germany',
  '/kuwait',
  '/qatar',
  '/oman',
  '/jordan',
  '/bahrain',
  '/france',
  '/spain',
  '/netherlands',
  '/belgium',
  '/sweden',
  '/south-africa',
  '/china',
  '/italy',
  '/russia',
  '/norway',
  '/austria',
  '/switzerland',
  '/brazil',
  '/mexico',
  '/colombia',
  '/venezuela',
  '/denmark',
  '/greece',
  '/new-zealand',
  '/finland',
  '/turkey',
  '/indonesia',
  '/malaysia',
  '/portugal',
  '/poland',
  '/argentina',
  '/senegal',
  '/nigeria',
  '/teachers',
  '/reviews',
  '/games',
  '/faq',
  '/blog',
  '/contact',
  '/library',
  '/classroom-moments',
  '/refund-policy',
  '/privacy',
  '/terms',
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route === '/' ? '/' : route}`,
  }))

  const blogEntries: MetadataRoute.Sitemap = (await getDynamicBlogArticles())
    .filter(({ slug }) => slug && slug !== '-5-')
    .map(({ slug, lastModified }) => ({
      url: `${BASE_URL}/blog/${slug}`,
      ...(lastModified ? { lastModified } : {}),
    }))

  return [...staticEntries, ...blogEntries]
}
