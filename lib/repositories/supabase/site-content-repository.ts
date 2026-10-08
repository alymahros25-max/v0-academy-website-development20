import type { SupabaseClient } from "@supabase/supabase-js"
import type { SiteContentQuery, SiteContentRepository, SiteContentRow, SiteContentWrite } from "@/lib/repositories/contracts/site-content"

const contentColumns = "key, content_ar, content_en, content_fr, section, type, is_active, updated_at"

function throwDatabaseError(operation: string, error: { message?: string } | null) {
  if (error) throw new Error(`[SiteContentRepository] ${operation}: ${error.message ?? "database error"}`)
}

export function createSupabaseSiteContentRepository(client: SupabaseClient): SiteContentRepository {
  return {
    async getActiveByKeys(keys) {
      if (!keys.length) return {}
      const { data, error } = await client.from("site_content").select(contentColumns).in("key", keys).eq("is_active", true)
      throwDatabaseError("read active content", error)
      return Object.fromEntries((data ?? []).map((item) => [item.key, item as SiteContentRow]))
    },

    async list(query: SiteContentQuery = {}) {
      let request = client.from("site_content").select(contentColumns).eq("is_active", true)
      if (query.key) request = request.eq("key", query.key)
      if (query.section) request = request.eq("section", query.section)
      const { data, error } = await request
      throwDatabaseError("list content", error)
      return (data ?? []) as SiteContentRow[]
    },

    async upsert(input: SiteContentWrite) {
      const { data, error } = await client.from("site_content").upsert({ ...input, updated_at: new Date().toISOString() }, { onConflict: "key" }).select(contentColumns).single()
      throwDatabaseError("upsert content", error)
      return data as SiteContentRow
    },

    async delete(key) {
      const { error } = await client.from("site_content").delete().eq("key", key)
      throwDatabaseError("delete content", error)
    },
  }
}
