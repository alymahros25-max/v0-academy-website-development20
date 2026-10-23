import type { Metadata } from "next"

/**
 * Keep a guaranteed description in the initial document head.
 * Article metadata is still generated per slug in page.tsx, but dynamic
 * metadata can be streamed after the head when the CMS read is asynchronous.
 */
export const metadata: Metadata = {
  description: "مقالات تعليمية عن حفظ القرآن ومراجعته والتجويد، وتأسيس القراءة والكتابة بالعربية.",
}

export default function BlogArticleLayout({ children }: { children: React.ReactNode }) {
  return children
}
