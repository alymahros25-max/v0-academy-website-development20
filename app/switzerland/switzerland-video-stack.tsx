'use client'

import { useState } from "react"
import Image from "next/image"
import { Layers, Play } from "lucide-react"
import { VideoPlayer } from "@/components/VideoPlayer"
import type { LandingVideo } from "@/lib/classroom-videos"

export function SwitzerlandVideoStack({ videos }: { videos: LandingVideo[] }) {
  const selected = videos.filter((video) => video.showOnLandingPages).slice(0, 5)
  const [active, setActive] = useState(0)
  const [activeId, setActiveId] = useState<string | null>(null)
  const current = selected[active]
  const image = (video: LandingVideo) => video.thumbnail_url || video.poster || `https://img.youtube.com/vi/${video.youtube_embed_id}/mqdefault.jpg`
  return <section className="bg-[#E6F0EA] px-5 py-16 text-[#17211F] sm:px-8" aria-labelledby="switzerland-video-title"><div className="mx-auto max-w-6xl"><p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[#164A41]"><Layers size={16} /> مقاطع من الأكاديمية</p><h2 id="switzerland-video-title" className="mt-3 text-3xl font-black sm:text-5xl">استكشف المقاطع واحدًا تلو الآخر</h2><div className="mt-9 grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:items-center"><button type="button" onClick={() => current && setActiveId(current.id)} className="group relative overflow-hidden rounded-[2.5rem] bg-[#164A41] p-3 text-right shadow-[10px_10px_0_#D52B1E] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D52B1E]/40">{current ? <><span className="relative block aspect-video overflow-hidden rounded-[2rem]"><Image loader={({ src }) => src} src={image(current)} alt={current.title_ar} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none" /><span className="absolute inset-0 grid place-items-center bg-[#164A41]/25"><span className="grid size-16 place-items-center rounded-full bg-[#D52B1E] text-white"><Play size={26} fill="currentColor" /></span></span></span><strong className="block px-3 py-4 text-lg text-white">{current.title_ar}</strong></> : <span className="block p-12 text-white">محتوى التعريف المرئي سيظهر هنا من المواد المنشورة.</span>}</button><div className="space-y-3">{selected.map((video, index) => <button key={video.id} type="button" onClick={() => setActive(index)} className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-right transition motion-reduce:transition-none ${active === index ? "border-[#D52B1E] bg-white" : "border-[#164A41]/15 bg-[#FFF8EA] hover:border-[#164A41]"}`}><span className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[#164A41]"><Image loader={({ src }) => src} src={image(video)} alt="" fill sizes="80px" className="object-cover" /></span><span className="flex-1 font-black leading-7">{video.title_ar}</span><span className="text-sm font-black text-[#D52B1E]">{index + 1}</span></button>)}</div></div></div>{current ? <VideoPlayer isOpen={Boolean(activeId)} videoId={current.youtube_embed_id} title={current.title_ar} onClose={() => setActiveId(null)} /> : null}</section>
}
