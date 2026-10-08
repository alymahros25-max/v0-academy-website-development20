import type { SupabaseClient } from "@supabase/supabase-js"
import type { AdminContentEntry, AdminDataRepository, GlobalPackageRow } from "@/lib/repositories/contracts/admin-data"

export function createSupabaseAdminDataRepository(client: SupabaseClient): AdminDataRepository {
  return {
    async listContent(contentType) {
      const { data, error } = await client.from("admin_content").select("content_id, data").eq("content_type", contentType).order("content_id")
      if (error) throw new Error(`[AdminDataRepository] list ${contentType}: ${error.message}`)
      return (data ?? []) as AdminContentEntry[]
    },

    async replaceContent(contentType, entries) {
      const { error } = await client.rpc("replace_admin_content_atomic", {
        p_content_type: contentType,
        payload: entries,
      })
      if (error) throw new Error(`[AdminDataRepository] replace ${contentType}: ${error.message}`)
    },

    async addContent(contentType, contentId, data) {
      const { error } = await client.from("admin_content").insert({ content_type: contentType, content_id: contentId, data })
      if (error) throw new Error(`[AdminDataRepository] insert ${contentType}: ${error.message}`)
    },

    async listPackages() {
      const { data, error } = await client.from("packages").select("*").order("type").order("sort_order")
      if (error) throw new Error(`[AdminDataRepository] list packages: ${error.message}`)
      return (data ?? []) as GlobalPackageRow[]
    },

    async replacePackages(rows) {
      const { data, error } = await client.rpc("replace_packages_atomic", { payload: rows })
      if (error) throw new Error(`[AdminDataRepository] replace packages: ${error.message}`)
      return (data ?? []) as GlobalPackageRow[]
    },
  }
}
