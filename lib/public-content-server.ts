import { unstable_cache } from "next/cache"
import { siteContentRepository } from "@/lib/repositories"
import type { PublicContent } from "@/lib/public-content"

const getCachedPublicContent = unstable_cache(
  async (keys: string[]): Promise<Record<string, PublicContent>> => {
    if (!siteContentRepository || keys.length === 0) return {}
    try {
      return await siteContentRepository.getActiveByKeys(keys) as Record<string, PublicContent>
    } catch (error) {
      console.warn("[Public Content] read failed:", error instanceof Error ? error.message : error)
      return {}
    }
  },
  ["public-site-content"],
  { revalidate: 3600, tags: ["site-content"] },
)

export async function getPublicContent(keys: string[]): Promise<Record<string, PublicContent>> {
  return getCachedPublicContent([...new Set(keys)].sort())
}
