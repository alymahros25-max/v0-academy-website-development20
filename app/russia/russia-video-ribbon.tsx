'use client'

import { useMemo, useState } from "react"
import Image from "next/image"
import { Play, Video } from "lucide-react"
import { VideoPlayer } from "@/components/VideoPlayer"
import type { LandingVideo } from "@/lib/classroom-videos"

export function RussiaVideoRibbon({ videos }: { videos: LandingVideo[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const selected = useMemo(() => videos.filter((video) => video.showOnLandingPages).slice(0, 4), [videos])
  const activeVideo = selected.find((video) => video.id === activeId)

  return (
    <section className="bg-[#EAF4F7] px-5 py-14 text-[#162B45] sm:px-8" aria-labelledby="russia-video-title">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 border-b border-[#31546D]/20 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[#B56B45]"><Video size={16} /> из опубликованных материалов</p>
            <h2 id="russia-video-title" className="mt-3 text-3xl font-black sm:text-5xl">لمحة مرئية عن التعلم من المنزل</h2>
            <p className="mt-3 max-w-2xl leading-8 text-[#162B45]/70">مقاطع منشورة من الأكاديمية، تُفتح عند الضغط على الصورة دون تحميل مشغل الفيديو في بداية الصفحة.</p>
          </div>
          <span className="rounded-full border border-[#31546D]/25 px-4 py-2 text-sm font-black">{selected.length} مقاطع منشورة</span>
        </div>
        {selected.length ? (
          <div className="mt-8 flex snap-x gap-5 overflow-x-auto pb-5" aria-label="فيديوهات روسيا">
            {selected.map((video) => (
              <button key={video.id} type="button" onClick={() => setActiveId(video.id)} className="group min-w-[min(82vw,28rem)] snap-start text-right focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#B56B45]/40" aria-label={`تشغيل ${video.title_ar}`}>
                <span className="relative block aspect-video overflow-hidden rounded-[2rem] border-4 border-[#C9D6DC] bg-[#162B45] shadow-[8px_8px_0_#B56B45]">
                  <Image loader={({ src }) => src} src={video.thumbnail_url || video.poster || `https://img.youtube.com/vi/${video.youtube_embed_id}/mqdefault.jpg`} alt={video.title_ar} fill sizes="(max-width: 768px) 82vw, 448px" className="object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none" />
                  <span className="absolute inset-0 grid place-items-center bg-[#162B45]/20"><span className="grid size-14 place-items-center rounded-full bg-[#B56B45] text-white shadow-xl"><Play size={24} fill="currentColor" /></span></span>
                </span>
                <strong className="mt-5 block text-lg font-black">{video.title_ar}</strong>
                {video.teacher_name_ar ? <span className="mt-1 block text-sm text-[#31546D]">{video.teacher_name_ar}</span> : null}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-2xl border border-[#31546D]/20 bg-white/60 p-6 font-bold">محتوى التعريف المرئي سيظهر هنا من المواد المنشورة.</p>
        )}
      </div>
      {activeVideo ? <VideoPlayer isOpen={Boolean(activeVideo)} videoId={activeVideo.youtube_embed_id} title={activeVideo.title_ar} onClose={() => setActiveId(null)} /> : null}
    </section>
  )
}
