'use client'

import { useState } from "react"
import Image from "next/image"
import { Play, RefreshCw } from "lucide-react"
import { VideoPlayer } from "@/components/VideoPlayer"
import type { LandingVideo } from "@/lib/classroom-videos"

export function FinlandFocusVideo({ videos }: { videos: LandingVideo[] }) {
  const items = videos.filter((video) => video.showOnLandingPages).slice(0, 6)
  const [index, setIndex] = useState(0)
  const [active, setActive] = useState<LandingVideo | null>(null)
  const video = items[index % Math.max(items.length, 1)]
  return <section className="px-5 py-16 sm:px-8"><div className="mx-auto max-w-4xl"><p className="text-sm font-black tracking-[0.22em] text-[#183B56]">لمحة هادئة · فيديو واحد</p><h2 className="mt-3 text-4xl font-black text-[#183B56] sm:text-6xl">شاهد لمحة قصيرة ثم تابع التصفح</h2>{video ? <div className="mt-10 overflow-hidden rounded-[2rem] border border-[#B9D9E8] bg-white shadow-[0_20px_60px_rgba(24,59,86,0.08)]"><button type="button" onClick={() => setActive(video)} className="group block w-full text-right"><div className="relative h-64 bg-[#183B56] sm:h-96">{video.thumbnail_url || video.poster ? <Image loader={({ src }) => src} src={video.thumbnail_url || video.poster || ""} alt={video.title_ar} fill sizes="(max-width: 640px) 100vw, 896px" className="object-cover" /> : null}<span className="absolute inset-0 grid place-items-center bg-[#183B56]/25"><span className="grid size-16 place-items-center rounded-full bg-[#E7D878] text-[#183B56] transition group-hover:scale-105 motion-reduce:transition-none"><Play size={25} fill="currentColor" /></span></span></div><div className="p-6"><p className="font-black text-[#183B56]">{video.title_ar}</p><span className="mt-2 block text-sm text-[#183B56]/70">اضغط لفتح المقطع</span></div></button><div className="flex items-center justify-between border-t border-[#B9D9E8] px-6 py-4"><span className="text-sm">المقطع {index + 1} من {items.length}</span><button type="button" onClick={() => setIndex((value) => (value + 1) % items.length)} className="inline-flex items-center gap-2 rounded-full bg-[#B9D9E8] px-4 py-2 text-sm font-black text-[#183B56]"><RefreshCw size={15} /> مقطع آخر</button></div></div> : <p className="mt-8 rounded-2xl border border-[#B9D9E8] bg-white p-6 font-bold text-[#183B56]">محتوى التعريف المرئي سيظهر من المواد المنشورة.</p>}{active ? <VideoPlayer isOpen videoId={active.youtube_embed_id} title={active.title_ar} onClose={() => setActive(null)} /> : null}</div></section>
}
