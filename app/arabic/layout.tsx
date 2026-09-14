import type { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata-utils'
import { CourseSchema } from '@/components/course-schema'

export const metadata: Metadata = generatePageMetadata('arabic')

export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CourseSchema
        nameAr="تأسيس اللغة العربية أونلاين للأطفال والكبار"
        nameEn="Arabic Language Foundation"
        descriptionAr="دروس فردية مباشرة باللغة العربية لتأسيس القراءة والكتابة والإملاء والفهم والتعبير، مع خطة تناسب مستوى الطالب وعمره وهدفه."
        url="https://quran-elhafez.com/arabic"
        image="https://quran-elhafez.com/images/arabic-learning.webp"
        teaches={["Arabic Reading", "Arabic Writing", "Arabic Spelling", "Arabic Comprehension", "Arabic Expression"]}
      />
      {children}
    </>
  )
}
