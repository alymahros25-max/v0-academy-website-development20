const blogSlugAliases: Record<string, string> = {
  '-5-': 'quran-memorization-tools',
}

export function getCanonicalBlogSlug(slug: string): string {
  return blogSlugAliases[slug] || slug
}

export function getStoredBlogSlugs(slug: string): string[] {
  const canonicalSlug = getCanonicalBlogSlug(slug)
  return canonicalSlug === slug ? [slug] : [canonicalSlug, slug]
}

export function isLegacyBlogSlug(slug: string): boolean {
  return getCanonicalBlogSlug(slug) !== slug
}
