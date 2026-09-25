'use client'

import { useState } from "react"
import Image from "next/image"
import { Play, Video } from "lucide-react"
import { VideoPlayer } from "@/components/VideoPlayer"
import type { LandingVideo } from "@/lib/classroom-videos"

export function MexicoStoryVideoRail({ videos }: { videos: LandingVideo[] }) {
  const selected = videos.filter((video) => video.showOnLandingPages).slice(0, 5)
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = selected.find((video) => video.id === activeId)
  const thumb = (video: LandingVideo) => video.thumbnail_url || video.poster || `https://img.youtube.com/vi/${video.youtube_embed_id}/mqdefault.jpg`
  return <section className="bg-[#243B80] px-5 py-16 text-white sm:px-8" aria-labelledby="mexico-video-title"><div className="mx-auto max-w-5xl"><p className="flex items-center gap-2 text-sm font-black tracking-[0.2em] text-[#F08A24]"><Video size={16} /> فصل مرئي</p><h2 id="mexico-video-title" className="mt-3 text-4xl font-black sm:text-6xl">شاهد القصة التعليمية خطوة خطوة</h2><div className="mt-10 border-r-4 border-[#F08A24] pr-5 sm:pr-10">{selected.length ? selected.map((video, index) => <button key={video.id} type="button" onClick={() => setActiveId(video.id)} className="group relative mb-6 flex w-full items-center gap-4 text-right last:mb-0"><span className="relative size-24 shrink-0 overflow-hidden rounded-2xl border-4 border-[#F08A24] bg-white/10 sm:size-32"><Image loader={({ src }) => src} src={thumb(video)} alt={video.title_ar} fill sizes="128px" className="object-cover transition group-hover:scale-105 motion-reduce:transition-none" /><span className="absolute inset-0 grid place-items-center bg-black/20"><span className="grid size-10 place-items-center rounded-full bg-[#F08A24] text-[#241A2A]"><Play size={17} fill="currentColor" /></span></span></span><span className="flex-1"><span className="block text-sm font-black text-[#F08A24]">الفصل 0{index + 1}</span><strong className="mt-1 block text-lg leading-8 sm:text-xl">{video.title_ar}</strong><span className="mt-1 block text-sm text-white/70">مقطع منشور من محتوى الأكاديمية.</span></span></button>) : <p className="rounded-2xl bg-white/10 p-6 font-bold">محتوى التعريف المرئي سيظهر هنا من المواد المنشورة.</p>}</div></div>{active ? <VideoPlayer isOpen videoId={active.youtube_embed_id} title={active.title_ar} onClose={() => setActiveId(null)} /> : null}</section>
}
