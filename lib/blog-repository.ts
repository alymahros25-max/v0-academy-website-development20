import { unstable_cache } from 'next/cache'
import { getCanonicalBlogSlug, getStoredBlogSlugs } from '@/lib/blog-slugs'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export type BlogPost = {
  slug: string
  title: { ar: string; en: string; fr: string }
  category: { ar: string; en: string; fr: string }
  author: { ar: string; en: string; fr: string }
  description: { ar: string; en: string; fr: string }
  keywords: { ar: string; en: string; fr: string }
  content: { ar: string; en: string; fr: string }
  date: string
  updatedAt?: string
  readTime: number
  image: string
}

export type BlogPostSummary = Pick<BlogPost, 'slug' | 'title' | 'description' | 'category' | 'author' | 'image' | 'date' | 'updatedAt' | 'readTime'>

const blogSelect = [
  'slug', 'title_ar', 'title_en', 'title_fr',
  'excerpt_ar', 'excerpt_en', 'excerpt_fr',
  'keywords_ar', 'keywords_en', 'keywords_fr',
  'content_ar', 'content_en', 'content_fr',
  'category_ar', 'category_en', 'category_fr',
  'author_ar', 'author_en', 'author_fr',
  'read_time', 'cover_image', 'published_at', 'updated_at',
].join(',')

type BlogPostRow = {
  slug: string
  title_ar: string | null
  title_en: string | null
  title_fr: string | null
  excerpt_ar: string | null
  excerpt_en: string | null
  excerpt_fr: string | null
  keywords_ar: string | null
  keywords_en: string | null
  keywords_fr: string | null
  content_ar: string | null
  content_en: string | null
  content_fr: string | null
  category_ar: string | null
  category_en: string | null
  category_fr: string | null
  author_ar: string | null
  author_en: string | null
  author_fr: string | null
  read_time: number | null
  cover_image: string | null
  published_at: string | null
  updated_at: string | null
}

function localized(value: string | null, fallback: string): string {
  return value?.trim() || fallback
}

function normalize(row: BlogPostRow): BlogPost {
  return {
    slug: getCanonicalBlogSlug(row.slug),
    title: {
      ar: localized(row.title_ar, 'مقالة تعليمية'),
      en: localized(row.title_en, 'Educational article'),
      fr: localized(row.title_fr, 'Article éducatif'),
    },
    category: {
      ar: localized(row.category_ar, 'مقالات تعليمية'),
      en: localized(row.category_en, 'Educational articles'),
      fr: localized(row.category_fr, 'Articles éducatifs'),
    },
    author: {
      ar: localized(row.author_ar, 'فريق الأكاديمية'),
      en: localized(row.author_en, 'Academy Team'),
      fr: localized(row.author_fr, "Équipe de l'académie"),
    },
    description: {
      ar: localized(row.excerpt_ar, 'مقالة تعليمية من أكاديمية الحافظ المتميز.'),
      en: localized(row.excerpt_en, 'An educational article from Al-Hafez Academy.'),
      fr: localized(row.excerpt_fr, "Article éducatif de l'académie Al-Hafez."),
    },
    keywords: {
      ar: localized(row.keywords_ar, ''),
      en: localized(row.keywords_en, ''),
      fr: localized(row.keywords_fr, ''),
    },
    content: {
      ar: localized(row.content_ar, ''),
      en: localized(row.content_en, ''),
      fr: localized(row.content_fr, ''),
    },
    date: row.published_at || row.updated_at || new Date().toISOString(),
    updatedAt: row.updated_at || undefined,
    readTime: row.read_time || 5,
    image: localized(row.cover_image, '/images/og-default.webp'),
  }
}

async function readPublishedBlogPost(slug: string): Promise<BlogPost | null> {
  if (!supabaseAdmin) {
    console.error('[blog] Supabase is unavailable; refusing to serve a code fallback')
    return null
  }
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select(blogSelect)
    .in('slug', getStoredBlogSlugs(slug))
    .eq('is_published', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) {
    console.error('[blog] published post read failed:', error.message)
    return null
  }
  return data ? normalize(data as unknown as BlogPostRow) : null
}

async function readPublishedBlogPosts(): Promise<BlogPost[]> {
  if (!supabaseAdmin) {
    console.error('[blog] Supabase is unavailable; refusing to serve code fallbacks')
    return []
  }
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select(blogSelect)
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false })
    .limit(100)
  if (error) {
    console.error('[blog] published posts read failed:', error.message)
    return []
  }
  return (data || []).map((row) => normalize(row as unknown as BlogPostRow))
}

export const getPublishedBlogPost = (slug: string) => unstable_cache(
  () => readPublishedBlogPost(slug),
  ['published-blog-post', getCanonicalBlogSlug(slug)],
  { revalidate: 3600, tags: ['blog-posts'] },
)()

export const getPublishedBlogPosts = unstable_cache(
  readPublishedBlogPosts,
  ['published-blog-posts'],
  { revalidate: 3600, tags: ['blog-posts'] },
)

export async function getPublishedBlogSummaries(): Promise<BlogPostSummary[]> {
  const posts = await getPublishedBlogPosts()
  return posts.map(({ content: _content, keywords: _keywords, ...summary }) => summary)
}
