'use client'

import { useMemo, useState } from "react"
import Image from "next/image"
import { Play, Video } from "lucide-react"
import { VideoPlayer } from "@/components/VideoPlayer"
import type { LandingVideo } from "@/lib/classroom-videos"

export function NorwayVideoPanel({ videos }: { videos: LandingVideo[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const selected = useMemo(() => videos.filter((video) => video.showOnLandingPages).slice(0, 4), [videos])
  const activeVideo = selected.find((video) => video.id === activeId)
  const featured = selected[0]
  const secondary = selected.slice(1)
  const image = (video: LandingVideo) => video.thumbnail_url || video.poster || `https://img.youtube.com/vi/${video.youtube_embed_id}/mqdefault.jpg`

  return (
    <section className="bg-[#F4F8F7] px-5 py-16 text-[#234B5A] sm:px-8" aria-labelledby="norway-video-title">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[#58756B]"><Video size={16} /> مادة مرئية من الأكاديمية</p>
          <h2 id="norway-video-title" className="mt-3 text-3xl font-black sm:text-5xl">شاهد المقطع الرئيسي ثم اختر ما تريد مشاهدته</h2>
          <p className="mt-4 leading-8 text-[#234B5A]/70">مقاطع منشورة من المصدر المشترك، تُعرض بصور مصغرة وتفتح عند الضغط دون تحميل مشغل الفيديو في بداية الصفحة.</p>
        </div>
        {featured ? <div className="mt-9 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
          <button type="button" onClick={() => setActiveId(featured.id)} className="group text-right focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C5965A]/40" aria-label={`تشغيل ${featured.title_ar}`}>
            <span className="relative block aspect-video overflow-hidden rounded-[2.25rem] border border-[#C7D5D8] bg-[#234B5A] shadow-[0_12px_0_#C7D5D8]"><Image loader={({ src }) => src} src={image(featured)} alt={featured.title_ar} fill sizes="(max-width: 1024px) 100vw, 760px" className="object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none" /><span className="absolute inset-0 grid place-items-center bg-[#234B5A]/20"><span className="grid size-16 place-items-center rounded-full bg-[#C5965A] text-white"><Play size={26} fill="currentColor" /></span></span></span>
            <strong className="mt-6 block text-2xl font-black">{featured.title_ar}</strong>
            {featured.teacher_name_ar ? <span className="mt-1 block text-sm text-[#58756B]">{featured.teacher_name_ar}</span> : null}
          </button>
          <div className="flex gap-4 overflow-x-auto pb-4 lg:flex-col lg:overflow-visible" aria-label="مقاطع النرويج الإضافية">
            {secondary.map((video) => <button key={video.id} type="button" onClick={() => setActiveId(video.id)} className="group min-w-[15rem] text-right focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C5965A]/40 lg:min-w-0 lg:flex lg:items-center lg:gap-4"><span className="relative block aspect-video overflow-hidden rounded-2xl border border-[#C7D5D8] bg-[#234B5A] lg:w-40 lg:shrink-0"><Image loader={({ src }) => src} src={image(video)} alt={video.title_ar} fill sizes="160px" className="object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none" /><span className="absolute inset-0 grid place-items-center bg-[#234B5A]/20"><span className="grid size-10 place-items-center rounded-full bg-[#C5965A] text-white"><Play size={17} fill="currentColor" /></span></span></span><strong className="mt-3 block text-sm leading-6 lg:mt-0">{video.title_ar}</strong></button>)}
          </div>
        </div> : <p className="mt-8 rounded-2xl border border-[#C7D5D8] bg-white p-6 font-bold">محتوى التعريف المرئي سيظهر هنا من المواد المنشورة.</p>}
      </div>
      {activeVideo ? <VideoPlayer isOpen={Boolean(activeVideo)} videoId={activeVideo.youtube_embed_id} title={activeVideo.title_ar} onClose={() => setActiveId(null)} /> : null}
    </section>
  )
}
