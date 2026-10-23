import { getPublishedBlogPosts as getPublishedPostsFromRepository } from "@/lib/blog-repository"

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

export const getPublishedBlogPosts = async (): Promise<PublicBlogPost[]> => {
  const posts = await getPublishedPostsFromRepository()
  return posts.map((post) => ({
    slug: post.slug,
    title: post.title.ar,
    excerpt: post.description.ar,
    category: post.category.ar,
    author: post.author.ar,
    image: post.image,
    publishedAt: post.date || null,
    readTime: post.readTime,
  }))
}
