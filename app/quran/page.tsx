import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata-utils'
import QuranPageClient from './client'
import { CourseSchema } from '@/components/course-schema'

export const metadata: Metadata = generatePageMetadata('quran')

export default function QuranPage() {
  return (
    <>
      <CourseSchema
        nameAr="تحفيظ القرآن أونلاين بالعربية"
        nameEn="Quran Memorization and Tajweed"
        descriptionAr="دروس فردية مباشرة باللغة العربية لتعلم حفظ القرآن والتلاوة والتجويد والمراجعة عبر Zoom أو Google Meet."
        url="https://quran-elhafez.com/quran"
        image="https://quran-elhafez.com/images/teacher-quran.webp"
        teaches={["Quranic Memorization", "Tajweed", "Islamic Education"]}
      />
      <QuranPageClient />
    </>
  )
}
