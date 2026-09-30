'use client'

import Image from 'next/image'
import type { Teacher } from '@/lib/data-store'

type Props = { teachers: Teacher[] }

function normalizeTeacherImage(image: string) {
  return image
    .replace("/images/teacher-male-avatar.png", "/images/teacher-male-avatar.webp")
    .replace("/images/teacher-female-avatar.png", "/images/teacher-female-avatar.webp")
    .replace("/images/teacher-quran.png", "/images/teacher-quran.webp")
}

export function CountryTeacherMarquee({ teachers }: Props) {
  const activeTeachers = teachers.filter((teacher) => teacher.active)
  if (!activeTeachers.length) return null
  const items = [...activeTeachers, ...activeTeachers]
  return <div className="country-teacher-marquee" aria-label="معلمونا ومعلماتنا">
    <div className="country-teacher-marquee-track">
      {items.map((teacher, index) => <article className="country-teacher-profile" key={`${teacher.id}-${index}`}>
        <div className="country-teacher-avatar">{teacher.image ? <Image src={normalizeTeacherImage(teacher.image)} alt="" width={52} height={52} /> : null}</div>
        <div><strong>{teacher.name.ar}</strong><span>{teacher.specialty.ar}</span><small>{teacher.experience} سنوات خبرة</small></div>
      </article>)}
    </div>
  </div>
}
