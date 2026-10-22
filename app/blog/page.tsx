import { PublicBlogIndex } from "@/components/public-blog-index"
import { getPublishedBlogPosts } from "@/lib/public-blog-server"
import { getPublicContent } from "@/lib/public-content-server"
import { localizedContent } from "@/lib/public-content"

export const revalidate = 3600

export default async function BlogPage() {
  const [posts, content] = await Promise.all([
    getPublishedBlogPosts(),
    getPublicContent(["blog_title", "blog_description"]),
  ])

  const title = localizedContent(content.blog_title, "ar", "مدونة القرآن واللغة العربية")
  const description = localizedContent(
    content.blog_description,
    "ar",
    "مقالات وإرشادات حول تحفيظ القرآن وتعليم اللغة العربية.",
  )

  return (
    <main dir="rtl" className="min-h-screen bg-background">
      <section className="bg-primary/5 pb-16 pt-28">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground lg:text-5xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{description}</p>
        </div>
      </section>

      <section className="py-16" aria-labelledby="blog-posts-heading">
        <div className="mx-auto max-w-6xl px-4">
          <h2 id="blog-posts-heading" className="sr-only">مقالات المدونة</h2>
          <PublicBlogIndex posts={posts} />
        </div>
      </section>
    </main>
  )
}
