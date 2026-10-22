import Image from "next/image"
import Link from "next/link"
import type { PublicBlogPost } from "@/lib/public-blog-server"

export function PublicBlogIndex({ posts }: { posts: PublicBlogPost[] }) {
  if (posts.length === 0) {
    return <p className="py-16 text-center text-muted-foreground">لا توجد مقالات منشورة حاليًا.</p>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full">
          <article className="h-full overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg">
            <div className="relative h-48 overflow-hidden bg-muted">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px"
              />
            </div>
            <div className="flex h-[calc(100%-12rem)] flex-col gap-3 p-5">
              <p className="text-xs font-semibold text-primary">{post.category}</p>
              <h2 className="text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                {post.title}
              </h2>
              <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span>{post.author}</span>
                <span>{post.readTime} دقائق قراءة</span>
              </div>
              <span className="mt-1 inline-flex w-full items-center justify-center rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                اقرأ المقال
              </span>
            </div>
          </article>
        </Link>
      ))}
    </div>
  )
}
