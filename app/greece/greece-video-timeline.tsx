'use client'

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { VideoPlayer } from "@/components/VideoPlayer"
import type { LandingVideo } from "@/lib/classroom-videos"

export function GreeceVideoTimeline({ videos }: { videos: LandingVideo[] }) {
  const items = videos.filter((video) => video.showOnLandingPages).slice(0, 4)
  const [active, setActive] = useState<LandingVideo | null>(null)
  return (
    <section className="bg-[#F2F0EA] px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-black tracking-[0.2em] text-[#0F5C73]">مخطوطة مرئية</p>
        <h2 className="mt-3 text-4xl font-black text-[#183642] sm:text-6xl">شاهد مراحل التعلم على خط واحد</h2>
        {items.length ? (
          <div className="relative mt-12 border-r-4 border-[#B7894C] pr-8 sm:pr-14">
            {items.map((video, index) => {
              const reversed = index % 2 === 1
              return (
                <button key={video.id} type="button" onClick={() => setActive(video)} className="group relative mb-8 block w-full text-right last:mb-0">
                  <span className="absolute -right-[3.15rem] top-5 grid size-10 place-items-center rounded-full border-4 border-[#F2F0EA] bg-[#0F5C73] text-white sm:-right-[4.15rem]"><Play size={15} fill="currentColor" /></span>
                  <span className={`grid gap-5 rounded-[2rem] border-2 border-[#B7894C]/50 bg-white p-4 text-right shadow-sm transition group-hover:-translate-x-1 ${reversed ? "sm:grid-cols-[0.8fr_1.2fr]" : "sm:grid-cols-[1.2fr_0.8fr]"}`}>
                    <span className={`relative min-h-40 overflow-hidden rounded-2xl bg-[#0F5C73] ${reversed ? "sm:order-2" : ""}`}>
                      {video.thumbnail_url || video.poster ? <Image loader={({ src }) => src} src={video.thumbnail_url || video.poster || ""} alt={video.title_ar} fill sizes="(max-width: 640px) 100vw, 360px" className="object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none" /> : null}
                      <span className="absolute inset-0 grid place-items-center bg-[#0F5C73]/25"><span className="grid size-12 place-items-center rounded-full bg-[#B7894C] text-white"><Play size={20} fill="currentColor" /></span></span>
                    </span>
                    <span className="flex items-center gap-3 px-2 py-3"><strong className="grid size-9 shrink-0 place-items-center rounded-full bg-[#0F5C73] text-white">{index + 1}</strong><span><small className="block font-bold text-[#B7894C]">المرحلة {index + 1}</small><b className="mt-1 block text-lg text-[#183642]">{video.title_ar}</b></span></span>
                  </span>
                </button>
              )
            })}
          </div>
        ) : <p className="mt-8 rounded-2xl bg-white p-6 font-bold text-[#183642]">محتوى التعريف المرئي سيظهر من المواد المنشورة.</p>}
        {active ? <VideoPlayer isOpen videoId={active.youtube_embed_id} title={active.title_ar} onClose={() => setActive(null)} /> : null}
      </div>
    </section>
  )
}
