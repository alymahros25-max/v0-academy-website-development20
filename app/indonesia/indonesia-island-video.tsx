'use client'

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { VideoPlayer } from "@/components/VideoPlayer"
import type { LandingVideo } from "@/lib/classroom-videos"

export function IndonesiaIslandVideo({ videos }: { videos: LandingVideo[] }) {
  const [selected, setSelected] = useState<LandingVideo | null>(null)
  const items = videos.filter((video) => video.showOnLandingPages).slice(0, 6)
  return <section className="bg-[#FFF8ED] px-5 py-20 sm:px-8"><div className="mx-auto max-w-6xl"><p className="text-xs font-black tracking-[0.28em] text-[#F28C28]">أمواج قصيرة · فيديوهات قابلة للسحب</p><h2 className="mt-4 text-4xl font-black text-[#20312D] sm:text-6xl">مرر بين المقاطع بالوتيرة التي تناسبك</h2>{items.length ? <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6">{items.map((video) => <button key={video.id} type="button" onClick={() => setSelected(video)} className="group w-[82vw] max-w-[520px] shrink-0 snap-start overflow-hidden rounded-[2rem] border-2 border-[#BBD8CC] bg-white text-right shadow-[8px_8px_0_#BBD8CC]"><div className="relative h-64 bg-[#176B5B]">{video.thumbnail_url ? <Image loader={({ src }) => src} src={video.thumbnail_url} alt={video.title_ar} fill sizes="520px" className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none" /> : null}<span className="absolute inset-0 grid place-items-center bg-[#176B5B]/30"><span className="grid size-14 place-items-center rounded-full bg-[#F28C28] text-[#20312D]"><Play size={22} fill="currentColor" /></span></span></div><div className="p-6"><p className="font-black text-[#20312D]">{video.title_ar}</p><p className="mt-2 text-sm text-[#20312D]/60">اضغط لفتح المقطع</p></div></button>)}</div> : <p className="mt-8 rounded-2xl border border-[#BBD8CC] bg-white p-6 font-bold text-[#20312D]">محتوى التعريف المرئي سيظهر من المواد المنشورة.</p>}{selected ? <VideoPlayer isOpen videoId={selected.youtube_embed_id} title={selected.title_ar} onClose={() => setSelected(null)} /> : null}</div></section>
}
