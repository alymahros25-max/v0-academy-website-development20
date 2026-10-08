import type {
  AreaAdminSnapshot,
  AreaLandingSnapshot,
  AreaResource,
  SiteArea,
} from "@/lib/domain/area-content"

export type NewAreaPackage = {
  area_id: number
  program: "quran" | "arabic" | "other"
  name_ar: string
  price: number
  sessions_per_month: number
  duration_minutes: number
  description_ar: string
  features_ar: string[]
  is_popular: boolean
}

export type AreaRecordMutation = {
  record: Record<string, unknown>
  areaSlug: string | null
}

export interface AreaRepository {
  getAreaBySlug(slug: string): Promise<SiteArea | null>
  getSnapshot(slug: string): Promise<AreaLandingSnapshot>
  getAdminSnapshot(slug?: string | null): Promise<AreaAdminSnapshot>
  updateRecord(resource: AreaResource, id: number, changes: Record<string, unknown>): Promise<AreaRecordMutation | null>
  createPackage(input: NewAreaPackage): Promise<AreaRecordMutation | null>
  deletePackage(id: number): Promise<AreaRecordMutation | null>
}
