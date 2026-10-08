export type SiteFaq = {
  id: number
  question_ar: string
  question_en: string | null
  question_fr: string | null
  answer_ar: string
  answer_en: string | null
  answer_fr: string | null
  category: string
  sort_order: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export type SiteFaqWrite = Pick<SiteFaq, "question_ar" | "answer_ar" | "category" | "sort_order" | "is_active">
  & Partial<Pick<SiteFaq, "question_en" | "question_fr" | "answer_en" | "answer_fr">>

export interface SiteFaqRepository {
  listAdmin(): Promise<SiteFaq[]>
  listPublic(): Promise<Array<Omit<SiteFaq, "is_active" | "created_at" | "updated_at">>>
  create(input: SiteFaqWrite): Promise<SiteFaq>
  update(id: number, changes: Partial<SiteFaqWrite>): Promise<SiteFaq | null>
  delete(id: number): Promise<boolean>
}
