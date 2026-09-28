'use client'

import { useState } from "react"
import Image from "next/image"
import { Play, X } from "lucide-react"
import { VideoPlayer } from "@/components/VideoPlayer"
import type { LandingVideo } from "@/lib/classroom-videos"

export function VenezuelaPhotoAlbum({ videos }: { videos: LandingVideo[] }) {
  const items = videos.filter((video) => video.showOnLandingPages).slice(0, 3)
  const [active, setActive] = useState<LandingVideo | null>(null)
  const thumbnail = (video: LandingVideo): string => video.thumbnail_url || video.poster || ""
  return <section className="bg-[#118AB2] px-5 py-16 text-white sm:px-8"><div className="mx-auto max-w-6xl"><p className="text-sm font-black tracking-[0.2em] text-[#FFD166]">ألبوم مرئي</p><h2 className="mt-3 text-4xl font-black sm:text-6xl">لقطات من طريقة التعلم</h2>{items.length ? <div className="mt-10 grid gap-5 md:grid-cols-[1.2fr_0.8fr_0.8fr]">{items.map((video, index) => <button key={video.id} type="button" onClick={() => setActive(video)} className={`group relative overflow-hidden rounded-[2rem] border-4 border-white text-right ${index === 0 ? "min-h-80 md:row-span-2" : "min-h-56"}`}>{thumbnail(video) ? <Image loader={({ src }) => src} src={thumbnail(video)} alt={video.title_ar} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none" /> : <span className="absolute inset-0 bg-[#17324D]" />}<span className="absolute inset-0 bg-gradient-to-t from-[#17324D]/90 via-[#17324D]/20 to-transparent" /><span className="absolute bottom-5 right-5 left-5"><span className="grid size-11 place-items-center rounded-full bg-[#FFD166] text-[#17324D]"><Play size={18} fill="currentColor" /></span><strong className="mt-3 block text-lg">{video.title_ar}</strong></span></button>)}</div> : <p className="mt-8 rounded-2xl bg-white/10 p-6">محتوى التعريف المرئي سيظهر من المواد المنشورة.</p>}{active ? <VideoPlayer isOpen videoId={active.youtube_embed_id} title={active.title_ar} onClose={() => setActive(null)} /> : null}</div></section>
}
