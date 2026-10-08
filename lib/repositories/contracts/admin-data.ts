export type AdminContentEntry = { content_id: string; data: unknown }

export type GlobalPackageRow = {
  id: string
  type: "quran" | "arabic"
  name_ar: string
  name_en: string
  name_fr: string
  sessions: number
  price: number
  duration: number
  features_ar: string
  features_en: string
  features_fr: string
  popular: boolean
  active: boolean
  sort_order: number
}

export interface AdminDataRepository {
  listContent(contentType: string): Promise<AdminContentEntry[]>
  replaceContent(contentType: string, entries: AdminContentEntry[]): Promise<void>
  addContent(contentType: string, contentId: string, data: unknown): Promise<void>
  listPackages(): Promise<GlobalPackageRow[]>
  replacePackages(rows: GlobalPackageRow[]): Promise<GlobalPackageRow[]>
}
