export type SiteContentRow = {
  key: string
  content_ar: string | null
  content_en: string | null
  content_fr: string | null
  section: string | null
  type: string | null
  is_active: boolean
  updated_at?: string
}

export type SiteContentQuery = {
  key?: string | null
  section?: string | null
}

export type SiteContentWrite = {
  key: string
  content_ar: string | null
  content_en: string | null
  content_fr: string | null
  section: string | null
  type: string | null
  is_active: boolean
}

export interface SiteContentRepository {
  getActiveByKeys(keys: string[]): Promise<Record<string, SiteContentRow>>
  list(query?: SiteContentQuery): Promise<SiteContentRow[]>
  upsert(input: SiteContentWrite): Promise<SiteContentRow>
  delete(key: string): Promise<void>
}
