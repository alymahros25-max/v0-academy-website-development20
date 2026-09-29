'use client'

import { useMemo, useState } from "react"
import Image from "next/image"
import { Play, Video } from "lucide-react"
import { VideoPlayer } from "@/components/VideoPlayer"
import type { LandingVideo } from "@/lib/classroom-videos"

const weekPoints = [
  { key: "plan", label: "خطة الأسبوع", description: "ابدأ بتحديد الوقت الذي تستطيع المحافظة عليه." },
  { key: "learn", label: "وقت الحصة", description: "شاهد مقطعًا قصيرًا من أجواء التعلم والمتابعة." },
  { key: "review", label: "المراجعة", description: "تعرف إلى فكرة المتابعة قبل اختيار الباقة." },
  { key: "next", label: "الخطوة التالية", description: "بعد المشاهدة، أرسل سؤالك عن الحصة التجريبية." },
] as const

export function SouthAfricaVideoMap({ videos }: { videos: LandingVideo[] }) {
  const [selectedPoint, setSelectedPoint] = useState(0)
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeVideo = videos.find((video) => video.id === activeId)
  const displayVideos = useMemo(() => videos.slice(0, 4), [videos])
  const selectedVideo = useMemo(() => displayVideos[selectedPoint % Math.max(displayVideos.length, 1)], [selectedPoint, displayVideos])

  if (!displayVideos.length) return null

  return (
    <section className="border-y border-[#d8c9ae] bg-[#f7f1e5] px-5 py-16 sm:px-8" aria-labelledby="south-africa-video-map-title">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2 text-sm font-bold tracking-wide text-[#a75d28]"><Video size={16} /> من داخل حصصنا</p>
          <h2 id="south-africa-video-map-title" className="mt-3 text-3xl font-black text-[#17251e] sm:text-4xl">شاهد كيف يمكن أن تبدو الحصة داخل أسبوعك</h2>
          <p className="mt-4 max-w-2xl leading-8 text-[#526057]">اختر نقطة من الخريطة، ثم افتح المقطع عندما تكون مستعدًا. الفيديوهات المنشورة تُدار من لوحة التحكم ولا توقف قراءة الصفحة أو تحميلها الأولي.</p>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div className="relative rounded-[2rem] border border-[#d8c9ae] bg-[#eadcc5] p-5 sm:p-8">
            <div className="absolute inset-x-12 top-1/2 hidden border-t-2 border-dashed border-[#c69462] lg:block" aria-hidden="true" />
            <div className="relative grid gap-4 sm:grid-cols-4">
              {weekPoints.map((point, index) => (
                <button key={point.key} type="button" onClick={() => setSelectedPoint(index)} className={`relative rounded-2xl border p-4 text-right transition ${selectedPoint === index ? "border-[#12372a] bg-[#12372a] text-white shadow-lg" : "border-[#cdbb9d] bg-[#f9f4ea] text-[#17251e] hover:border-[#a75d28]"}`} aria-pressed={selectedPoint === index}>
                  <span className="mb-4 flex size-9 items-center justify-center rounded-full bg-[#d8873d] text-sm font-black text-[#17251e]">{index + 1}</span>
                  <strong className="block">{point.label}</strong>
                  <span className={`mt-2 block text-sm leading-6 ${selectedPoint === index ? "text-white/80" : "text-[#657269]"}`}>{point.description}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-[#d8c9ae] bg-white p-4 shadow-sm sm:p-5">
            <button type="button" onClick={() => setActiveId(selectedVideo.id)} className="group block w-full text-right" aria-label={`تشغيل ${selectedVideo.title_ar}`}>
              <span className="relative block aspect-video overflow-hidden rounded-2xl bg-[#12372a]">
                <Image src={selectedVideo.thumbnail_url || selectedVideo.poster || ""} alt={selectedVideo.title_ar} width={900} height={506} sizes="(max-width: 1024px) 100vw, 45vw" className="size-full object-cover transition duration-300 group-hover:scale-105" />
                <span className="absolute inset-0 grid place-items-center bg-black/20"><span className="grid size-14 place-items-center rounded-full bg-[#d8873d] text-[#17251e] shadow-xl"><Play size={23} fill="currentColor" /></span></span>
              </span>
              <span className="mt-4 block text-sm font-bold text-[#a75d28]">{weekPoints[selectedPoint].label}</span>
              <strong className="mt-1 block text-xl text-[#17251e]">{selectedVideo.title_ar}</strong>
              {selectedVideo.description_ar ? <span className="mt-2 block leading-7 text-[#657269]">{selectedVideo.description_ar}</span> : null}
            </button>
          </div>
        </div>
        {activeVideo ? <VideoPlayer isOpen={Boolean(activeVideo)} videoId={activeVideo.youtube_embed_id} title={activeVideo.title_ar} onClose={() => setActiveId(null)} /> : null}
      </div>
    </section>
  )
}
