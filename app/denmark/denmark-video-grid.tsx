'use client'

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { VideoPlayer } from "@/components/VideoPlayer"
import type { LandingVideo } from "@/lib/classroom-videos"

export function DenmarkVideoGrid({ videos }: { videos: LandingVideo[] }) {
  const items = videos.filter((video) => video.showOnLandingPages).slice(0, 3)
  const [active, setActive] = useState<LandingVideo | null>(null)
  const thumbnail = (video: LandingVideo): string => video.thumbnail_url || video.poster || ""
  return <section className="bg-[#F1F3F5] px-5 py-16 sm:px-8"><div className="mx-auto max-w-6xl"><p className="text-sm font-black tracking-[0.2em] text-[#8B1E3F]">ملاحظة مرئية</p><h2 className="mt-3 text-4xl font-black text-[#263238] sm:text-6xl">مقاطع قصيرة تناسب أوقاتًا مختلفة</h2>{items.length ? <div className="mt-10 grid gap-5 md:grid-cols-12">{items.map((video, index) => <button key={video.id} type="button" onClick={() => setActive(video)} className={`group relative min-h-56 overflow-hidden rounded-2xl border-4 border-white text-right shadow-sm ${index === 0 ? "md:col-span-7 md:min-h-80" : index === 1 ? "md:col-span-5" : "md:col-span-4 md:col-start-5"}`}>{thumbnail(video) ? <Image loader={({ src }) => src} src={thumbnail(video)} alt={video.title_ar} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none" /> : <span className="absolute inset-0 bg-[#263238]" />}<span className="absolute inset-0 bg-gradient-to-t from-[#263238]/90 via-[#263238]/10 to-transparent" /><span className="absolute bottom-5 right-5 left-5"><span className="grid size-10 place-items-center rounded-full bg-[#8B1E3F] text-white"><Play size={16} fill="currentColor" /></span><strong className="mt-3 block text-white">{video.title_ar}</strong></span></button>)}</div> : <p className="mt-8 rounded-2xl bg-white p-6 font-bold text-[#263238]">محتوى التعريف المرئي سيظهر من المواد المنشورة.</p>}{active ? <VideoPlayer isOpen videoId={active.youtube_embed_id} title={active.title_ar} onClose={() => setActive(null)} /> : null}</div></section>
}
