import type { SupabaseClient } from "@supabase/supabase-js"
import type { SiteFaq, SiteFaqRepository, SiteFaqWrite } from "@/lib/repositories/contracts/site-faq"

const publicColumns = "id, question_ar, question_en, question_fr, answer_ar, answer_en, answer_fr, category, sort_order"

export function createSupabaseSiteFaqRepository(client: SupabaseClient): SiteFaqRepository {
  return {
    async listAdmin() {
      const { data, error } = await client.from("faq_items").select("*").order("category").order("sort_order")
      if (error) throw new Error(`[SiteFaqRepository] list admin: ${error.message}`)
      return (data ?? []) as SiteFaq[]
    },

    async listPublic() {
      const { data, error } = await client.from("faq_items").select(publicColumns).eq("is_active", true).order("category").order("sort_order")
      if (error) throw new Error(`[SiteFaqRepository] list public: ${error.message}`)
      return data ?? []
    },

    async create(input: SiteFaqWrite) {
      const { data, error } = await client.from("faq_items").insert(input).select("*").single()
      if (error) throw new Error(`[SiteFaqRepository] create: ${error.message}`)
      return data as SiteFaq
    },

    async update(id, changes) {
      const { data, error } = await client.from("faq_items").update({ ...changes, updated_at: new Date().toISOString() }).eq("id", id).select("*").maybeSingle()
      if (error) throw new Error(`[SiteFaqRepository] update: ${error.message}`)
      return (data as SiteFaq | null) ?? null
    },

    async delete(id) {
      const { data, error } = await client.from("faq_items").delete().eq("id", id).select("id").maybeSingle()
      if (error) throw new Error(`[SiteFaqRepository] delete: ${error.message}`)
      return Boolean(data)
    },
  }
}
