export const countryEducationFields = Object.freeze({
  name: "learning_name",
  localTitle: "learning_local_title",
  localDescription: "learning_local_description",
  quranTitle: "learning_quran_title",
  quranBody: "learning_quran_body",
  arabicTitle: "learning_arabic_title",
  arabicBody: "learning_arabic_body",
  quranArticleTitle: "learning_quran_article_title",
  quranArticleBody: "learning_quran_article_body",
  arabicArticleTitle: "learning_arabic_article_title",
  arabicArticleBody: "learning_arabic_article_body",
  teacherAngle: "learning_teacher_angle",
})

/**
 * Merge only the allow-listed plain-text learning fields for the requested area.
 * Missing, inactive, empty, or malformed DB values keep their code fallback.
 */
export function resolveCountryEducation(slug, areaSlug, rows, fallback) {
  if (!fallback) return undefined

  const resolved = { ...fallback }
  if (slug !== areaSlug || !Array.isArray(rows)) return resolved

  const values = new Map()
  for (const row of rows) {
    if (!row || row.is_active === false || typeof row.content_key !== "string") continue
    if (!Object.values(countryEducationFields).includes(row.content_key)) continue
    if (typeof row.content_ar !== "string" || !row.content_ar.trim()) continue
    values.set(row.content_key, row.content_ar.trim())
  }

  for (const [field, contentKey] of Object.entries(countryEducationFields)) {
    const value = values.get(contentKey)
    if (value) resolved[field] = value
  }

  return resolved
}
