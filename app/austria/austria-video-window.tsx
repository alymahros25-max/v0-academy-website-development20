'use client'

import { useMemo, useState } from "react"
import Image from "next/image"
import { BookOpen, Languages, Play, Video } from "lucide-react"
import { VideoPlayer } from "@/components/VideoPlayer"
import type { LandingVideo } from "@/lib/classroom-videos"

const topics = [
  { key: "quran", label: "القرآن", icon: BookOpen },
  { key: "arabic", label: "العربية", icon: Languages },
  { key: "academy", label: "من الأكاديمية", icon: Video },
] as const

export function AustriaVideoWindow({ videos }: { videos: LandingVideo[] }) {
  const [topic, setTopic] = useState<(typeof topics)[number]["key"]>("quran")
  const [activeId, setActiveId] = useState<string | null>(null)
  const selected = useMemo(() => videos.filter((video) => video.showOnLandingPages).slice(0, 6), [videos])
  const activeVideo = selected.find((video) => video.id === activeId)
  const filtered = selected.filter((_, index) => topic === "quran" ? index % 3 === 0 : topic === "arabic" ? index % 3 === 1 : index % 3 === 2)
  const visible = filtered.length ? filtered : selected.slice(0, 2)
  const image = (video: LandingVideo) => video.thumbnail_url || video.poster || `https://img.youtube.com/vi/${video.youtube_embed_id}/mqdefault.jpg`

  return <section className="bg-[#F4DDE5] px-5 py-16 text-[#2C2438] sm:px-8" aria-labelledby="austria-video-title"><div className="mx-auto max-w-6xl"><p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[#4B3B67]"><Video size={16} /> نافذة المشاهدة</p><h2 id="austria-video-title" className="mt-3 text-3xl font-black sm:text-5xl">اختر الموضوع الأقرب إلى سؤالك</h2><div className="mt-7 flex flex-wrap gap-3" role="tablist" aria-label="موضوعات الفيديو">{topics.map(({ key, label, icon: Icon }) => <button key={key} type="button" role="tab" aria-selected={topic === key} onClick={() => setTopic(key)} className={`inline-flex items-center gap-2 rounded-full border-2 px-5 py-3 font-black transition motion-reduce:transition-none ${topic === key ? "border-[#4B3B67] bg-[#4B3B67] text-white" : "border-[#4B3B67]/40 bg-[#FFF9F2] hover:bg-[#4B3B67] hover:text-white"}`}><Icon size={17} />{label}</button>)}</div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visible.map((video) => <button key={video.id} type="button" onClick={() => setActiveId(video.id)} className="group rounded-3xl bg-[#FFF9F2] p-3 text-right shadow-[6px_6px_0_#C49A45] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4B3B67]/30"><span className="relative block aspect-video overflow-hidden rounded-2xl bg-[#4B3B67]"><Image loader={({ src }) => src} src={image(video)} alt={video.title_ar} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none" /><span className="absolute inset-0 grid place-items-center bg-[#4B3B67]/20"><span className="grid size-12 place-items-center rounded-full bg-[#C49A45] text-white"><Play size={20} fill="currentColor" /></span></span></span><strong className="mt-4 block px-2 pb-2 leading-7">{video.title_ar}</strong></button>)}</div>{visible.length === 0 ? <p className="mt-8 rounded-2xl bg-[#FFF9F2] p-6 font-bold">محتوى التعريف المرئي سيظهر هنا من المواد المنشورة.</p> : null}</div>{activeVideo ? <VideoPlayer isOpen={Boolean(activeVideo)} videoId={activeVideo.youtube_embed_id} title={activeVideo.title_ar} onClose={() => setActiveId(null)} /> : null}</section>
}
