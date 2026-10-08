import type { SupabaseClient } from "@supabase/supabase-js"
import type { SiteSetting, SiteSettingWrite, SiteSettingsRepository } from "@/lib/repositories/contracts/site-settings"

const columns = "setting_key, setting_value, value_type, label, description, category, updated_at"

export function createSupabaseSiteSettingsRepository(client: SupabaseClient): SiteSettingsRepository {
  return {
    async list(filters = {}) {
      let query = client.from("site_settings").select(columns).order("category").order("setting_key")
      if (filters.key) query = query.eq("setting_key", filters.key)
      if (filters.category) query = query.eq("category", filters.category)
      const { data, error } = await query
      if (error) throw new Error(`[SiteSettingsRepository] list: ${error.message}`)
      return (data ?? []) as SiteSetting[]
    },

    async upsertMany(rows: SiteSettingWrite[]) {
      if (!rows.length) return []
      const stamped = rows.map((row) => ({ ...row, updated_at: new Date().toISOString() }))
      const { data, error } = await client.from("site_settings").upsert(stamped, { onConflict: "setting_key" }).select(columns)
      if (error) throw new Error(`[SiteSettingsRepository] upsert: ${error.message}`)
      return (data ?? []) as SiteSetting[]
    },

    async delete(key) {
      const { error } = await client.from("site_settings").delete().eq("setting_key", key)
      if (error) throw new Error(`[SiteSettingsRepository] delete: ${error.message}`)
    },
  }
}
