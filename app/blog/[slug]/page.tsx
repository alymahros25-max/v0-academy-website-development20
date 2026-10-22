import { Metadata } from 'next'
import BlogArticleClient from "./client"
import { getSeoAlternates } from '@/lib/seo-metadata'
import { notFound, permanentRedirect } from 'next/navigation'
import { getCanonicalBlogSlug, getStoredBlogSlugs, isLegacyBlogSlug } from '@/lib/blog-slugs'
import { getPublishedBlogPost } from '@/lib/blog-repository'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedBlogPost(slug)
  if (!post) return { title: "Not Found" }

  const baseUrl = 'https://quran-elhafez.com'
  const articleUrl = `${baseUrl}/blog/${getCanonicalBlogSlug(slug)}`

  return {
    title: post.title.ar,
    description: post.description.ar,
    keywords: post.keywords.ar,
    alternates: getSeoAlternates(articleUrl),
    openGraph: {
      title: post.title.ar,
      description: post.description.ar,
      type: 'article',
      url: articleUrl,
      siteName: 'أكاديمية الحافظ المتميز',
      images: [{ url: post.image }],
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      authors: [post.author.ar],
      tags: post.keywords.ar ? post.keywords.ar.split(', ') : [post.category.ar],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title.ar,
      description: post.description.ar,
      images: [post.image],
    },
  }
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (isLegacyBlogSlug(slug)) permanentRedirect(`/blog/${getCanonicalBlogSlug(slug)}`)
  const post = await getPublishedBlogPost(slug)

  if (!post) notFound()

  return (
    <>
      <BlogArticleClient slug={slug} blogPosts={{ [slug]: post }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title.ar,
            description: post.description.ar,
            image: [`https://quran-elhafez.com${post.image.startsWith('/') ? post.image : `/${post.image}`}`],
            datePublished: post.date,
            dateModified: post.updatedAt || post.date,
            author: { "@type": "Person", name: post.author.ar },
            mainEntityOfPage: `https://quran-elhafez.com/blog/${slug}`,
          }),
        }}
      />
    </>
  )
}
