import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { createSupabaseAreaRepository } from "@/lib/repositories/supabase/area-repository"
import { createSupabaseSiteContentRepository } from "@/lib/repositories/supabase/site-content-repository"
import { createSupabaseSiteSettingsRepository } from "@/lib/repositories/supabase/site-settings-repository"
import { createSupabaseSiteFaqRepository } from "@/lib/repositories/supabase/site-faq-repository"
import { createSupabaseAdminDataRepository } from "@/lib/repositories/supabase/admin-data-repository"

/**
 * Repository selection is server-only. The domain/API depends on the contract,
 * while the Supabase adapter can be replaced without changing page components.
 */
export const areaRepository = supabaseAdmin ? createSupabaseAreaRepository(supabaseAdmin) : null
export const siteContentRepository = supabaseAdmin ? createSupabaseSiteContentRepository(supabaseAdmin) : null
export const siteSettingsRepository = supabaseAdmin ? createSupabaseSiteSettingsRepository(supabaseAdmin) : null
export const siteFaqRepository = supabaseAdmin ? createSupabaseSiteFaqRepository(supabaseAdmin) : null
export const adminDataRepository = supabaseAdmin ? createSupabaseAdminDataRepository(supabaseAdmin) : null
