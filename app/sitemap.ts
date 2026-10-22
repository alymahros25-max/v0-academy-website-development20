import type { MetadataRoute } from 'next'
import { countryEducationalContent } from '@/lib/country-educational-content'
import { countrySeoPages } from '@/lib/country-seo'
import { getPublishedBlogSummaries } from '@/lib/blog-repository'

const BASE_URL = 'https://quran-elhafez.com'

type BlogArticle = { slug: string; lastModified?: string }

async function getDynamicBlogArticles(): Promise<BlogArticle[]> {
  const posts = await getPublishedBlogSummaries()
  return posts.map((post) => ({
    slug: post.slug,
    lastModified: post.updatedAt || post.date,
  }))
}

const staticRoutes = [
  '/', '/quran', '/arabic', '/about', '/teachers', '/reviews', '/games', '/faq',
  '/blog', '/contact', '/library', '/classroom-moments', '/refund-policy', '/privacy', '/terms',
  ...countrySeoPages.map(({ slug }) => `/${slug}`),
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route === '/' ? '/' : route}`,
  }))

  const blogEntries: MetadataRoute.Sitemap = (await getDynamicBlogArticles())
    .filter(({ slug }) => Boolean(slug))
    .map(({ slug, lastModified }) => ({
      url: `${BASE_URL}/blog/${slug}`,
      ...(lastModified ? { lastModified } : {}),
    }))

  const countryArticleEntries: MetadataRoute.Sitemap = Object.keys(countryEducationalContent).flatMap((slug) =>
    (['quran', 'arabic', 'teachers'] as const).map((topic) => ({
      url: `${BASE_URL}/blog/country/${slug}/${topic}`,
    })),
  )

  return [...staticEntries, ...blogEntries, ...countryArticleEntries]
}
