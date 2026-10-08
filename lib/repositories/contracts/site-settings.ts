export type SiteSetting = {
  setting_key: string
  setting_value: string
  value_type: "color" | "text" | "url" | "number" | "json"
  label: string | null
  description: string | null
  category: string
  updated_at?: string
}

export type SiteSettingWrite = Omit<SiteSetting, "updated_at"> 

export interface SiteSettingsRepository {
  list(filters?: { key?: string | null; category?: string | null }): Promise<SiteSetting[]>
  upsertMany(rows: SiteSettingWrite[]): Promise<SiteSetting[]>
  delete(key: string): Promise<void>
}
