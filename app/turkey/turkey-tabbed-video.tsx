'use client'

import { useMemo, useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { VideoPlayer } from "@/components/VideoPlayer"
import type { LandingVideo } from "@/lib/classroom-videos"
import type { TurkeyProgram } from "./turkey-tabbed-study"

export function TurkeyTabbedVideo({ videos }: { videos: LandingVideo[] }) {
  const [active, setActive] = useState<TurkeyProgram>("quran")
  const [selected, setSelected] = useState<LandingVideo | null>(null)
  const items = useMemo(() => videos.filter((video) => video.showOnLandingPages).slice(0, 4), [videos])
  const visible = items.filter((_, index) => active === "quran" ? index % 2 === 0 : index % 2 === 1)
  const fallback = items[active === "quran" ? 0 : 1] ?? items[0]
  const current = visible[0] ?? fallback
  return <section className="bg-[#0F766E] px-5 py-20 text-white sm:px-8"><div className="mx-auto max-w-6xl"><div className="flex flex-wrap items-end justify-between gap-6"><div><p className="text-xs font-black tracking-[0.28em] text-[#E9C46A]">مقاطع من المصدر التعليمي</p><h2 className="mt-4 text-4xl font-black sm:text-6xl">اختر الموضوع الذي يهمك</h2></div><div role="tablist" aria-label="موضوعات الفيديو" className="flex gap-2 rounded-xl bg-white/10 p-2"><button type="button" role="tab" aria-selected={active === "quran"} onClick={() => setActive("quran")} className={`rounded-lg px-5 py-3 font-black ${active === "quran" ? "bg-[#E9C46A] text-[#262626]" : "text-white"}`}>القرآن</button><button type="button" role="tab" aria-selected={active === "arabic"} onClick={() => setActive("arabic")} className={`rounded-lg px-5 py-3 font-black ${active === "arabic" ? "bg-[#E9C46A] text-[#262626]" : "text-white"}`}>العربية</button></div></div>{current ? <div className="mt-12 grid gap-6 md:grid-cols-[1.25fr_0.75fr]"><button type="button" onClick={() => setSelected(current)} className="group overflow-hidden rounded-2xl bg-[#075E54] text-right"><div className="relative h-72 sm:h-96">{current.thumbnail_url ? <Image loader={({ src }) => src} src={current.thumbnail_url} alt={current.title_ar} fill sizes="(max-width: 768px) 100vw, 750px" className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none" /> : null}<span className="absolute inset-0 grid place-items-center bg-[#075E54]/30"><span className="grid size-16 place-items-center rounded-full bg-[#E9C46A] text-[#262626]"><Play size={25} fill="currentColor" /></span></span></div><div className="p-6"><p className="font-black">{current.title_ar}</p><p className="mt-2 text-sm text-white/70">افتح المقطع من تبويب {active === "quran" ? "القرآن" : "العربية"}</p></div></button><div className="rounded-2xl border border-white/20 bg-white/10 p-7"><p className="text-sm font-bold text-[#E9C46A]">الموضوع المختار</p><h3 className="mt-4 text-3xl font-black">{active === "quran" ? "تحفيظ القرآن الكريم" : "تأسيس اللغة العربية"}</h3><p className="mt-5 leading-8 text-white/80">مقطع تعريفي من المحتوى المنشور في الأكاديمية. اختر التبويب الآخر للانتقال إلى موضوع مختلف.</p>{visible.slice(1).map((video) => <button type="button" key={video.id} onClick={() => setSelected(video)} className="mt-5 block w-full border-t border-white/20 pt-4 text-right font-bold text-[#E9C46A]">{video.title_ar}</button>)}</div></div> : <p className="mt-8 rounded-2xl border border-white/20 p-6">محتوى التعريف المرئي سيظهر من المواد المنشورة.</p>}{selected ? <VideoPlayer isOpen videoId={selected.youtube_embed_id} title={selected.title_ar} onClose={() => setSelected(null)} /> : null}</div></section>
}
