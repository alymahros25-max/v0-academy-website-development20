'use client'

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { VideoPlayer } from "@/components/VideoPlayer"
import type { LandingVideo } from "@/lib/classroom-videos"

export function NewZealandVideoFolders({ videos }: { videos: LandingVideo[] }) {
  const items = videos.filter((video) => video.showOnLandingPages).slice(0, 4)
  const [active, setActive] = useState<LandingVideo | null>(null)
  return <section className="bg-[#E9D8B4] px-5 py-16 sm:px-8"><div className="mx-auto max-w-5xl"><p className="text-sm font-black tracking-[0.2em] text-[#1F5D50]">دفتر المشاهدة</p><h2 className="mt-3 text-4xl font-black text-[#163C3A] sm:text-6xl">افتح البطاقة عندما تريد معرفة المزيد</h2><div className="mt-10 grid gap-4 sm:grid-cols-2">{items.length ? items.map((video, index) => <button key={video.id} type="button" onClick={() => setActive(video)} className="group overflow-hidden rounded-[1.75rem] border-2 border-[#1F5D50]/30 bg-[#FBFAF5] text-right shadow-sm transition hover:-translate-y-1 motion-reduce:transition-none"><div className="p-5"><span className="flex items-center justify-between"><b className="text-[#1F5D50]">الباب {index + 1}</b><Play size={18} className="text-[#185A7A]" /></span><p className="mt-3 font-bold text-[#163C3A]">{video.title_ar}</p></div><div className="relative h-40 bg-[#185A7A]">{video.thumbnail_url || video.poster ? <Image loader={({ src }) => src} src={video.thumbnail_url || video.poster || ""} alt={video.title_ar} fill sizes="(max-width: 640px) 100vw, 420px" className="object-cover" /> : null}<span className="absolute inset-0 grid place-items-center bg-[#185A7A]/30"><span className="grid size-12 place-items-center rounded-full bg-[#E9D8B4] text-[#163C3A]"><Play size={20} fill="currentColor" /></span></span></div></button>) : <p className="rounded-2xl bg-[#FBFAF5] p-6 font-bold text-[#163C3A]">محتوى التعريف المرئي سيظهر من المواد المنشورة.</p>}</div>{active ? <VideoPlayer isOpen videoId={active.youtube_embed_id} title={active.title_ar} onClose={() => setActive(null)} /> : null}</div></section>
}
