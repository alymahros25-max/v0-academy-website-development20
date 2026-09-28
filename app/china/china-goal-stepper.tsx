'use client'

import { useMemo, useState } from "react"
import Image from "next/image"
import { ArrowLeft, Play, Video } from "lucide-react"
import { VideoPlayer } from "@/components/VideoPlayer"
import type { LandingVideo } from "@/lib/classroom-videos"

const steps = [
  { key: "goal", title: "ماذا تريد أن تتعلم؟", text: "اختر تحفيظ القرآن إذا كان هدفك بناء روتين للحفظ والمراجعة والقراءة، أو اختر تأسيس العربية إذا كنت تريد تقوية القراءة والفهم." },
  { key: "time", title: "ما الوقت الذي يناسبك؟", text: "اكتب الأوقات التي تستطيع المحافظة عليها. تستخدم الصين توقيتًا رسميًا موحدًا، لكن الموعد النهائي يعتمد على التوفر الفعلي عند التواصل." },
  { key: "question", title: "ما سؤالك؟", text: "اذكر المدينة والبرنامج وعدد الحصص الذي تفكر فيه، ثم أرسل سؤالك عن الحصة التجريبية والخطوة التالية." },
] as const

export function ChinaGoalStepper({ videos }: { videos: LandingVideo[] }) {
  const [openStep, setOpenStep] = useState(0)
  const [activeId, setActiveId] = useState<string | null>(null)
  const displayVideos = useMemo(() => videos.slice(0, 3), [videos])
  const activeVideo = displayVideos.find((video) => video.id === activeId)
  const selectedVideo = displayVideos[openStep % Math.max(displayVideos.length, 1)]

  return (
    <section id="china-steps" className="border-y border-[#d6c4a8] bg-[#f7f0e3] px-5 py-16 sm:px-8" aria-labelledby="china-steps-title">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-[#7e1f27]">ثلاث خطوات قبل القرار</p>
          <h2 id="china-steps-title" className="mt-3 text-3xl font-black text-[#211a18] sm:text-5xl">ابدأ من هدفك، ثم اختر وقتك، ثم اسأل</h2>
          <p className="mt-4 leading-8 text-[#5e5147]">لا تحتاج إلى اختيار باقة طويلة من البداية. افتح الخطوة التي تهمك، ثم انتقل تدريجيًا إلى السؤال المناسب.</p>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {steps.map((step, index) => {
            const isOpen = openStep === index
            return (
              <button key={step.key} type="button" onClick={() => setOpenStep(index)} aria-expanded={isOpen} className={`text-right rounded-[1.5rem] border p-6 transition ${isOpen ? "border-[#7e1f27] bg-[#7e1f27] text-white shadow-xl" : "border-[#d6c4a8] bg-[#fffaf1] text-[#211a18] hover:border-[#c9953d]"}`}>
                <span className={`flex size-10 items-center justify-center rounded-full text-sm font-black ${isOpen ? "bg-[#c9953d] text-[#211a18]" : "bg-[#e8d7bc] text-[#7e1f27]"}`}>{String(index + 1).padStart(2, "0")}</span>
                <strong className="mt-6 block text-xl">{step.title}</strong>
                <span className={`mt-3 block leading-7 ${isOpen ? "text-white/80" : "text-[#6c5b4f]"}`}>{step.text}</span>
                <span className={`mt-5 inline-flex items-center gap-2 text-sm font-black ${isOpen ? "text-[#f3d79d]" : "text-[#7e1f27]"}`}>{isOpen ? "الخطوة الحالية" : "افتح الخطوة"} <ArrowLeft size={15} /></span>
              </button>
            )
          })}
        </div>
        {selectedVideo ? (
          <div className="mt-10 grid gap-6 rounded-[2rem] border border-[#d6c4a8] bg-[#211a18] p-5 text-white sm:p-7 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-sm font-black text-[#e4bd6e]"><Video size={16} /> من فيديوهات الأكاديمية</p>
              <h3 className="mt-3 text-2xl font-black sm:text-3xl">تعرّف إلى أسلوب التعلم خطوة بعد خطوة</h3>
              <p className="mt-4 leading-8 text-white/75">يظهر المقطع المرتبط بالخطوة المفتوحة فقط. تُجلب الفيديوهات المنشورة من المصدر المشترك، ولا يبدأ التشغيل إلا عند النقر.</p>
              <button type="button" onClick={() => setActiveId(selectedVideo.id)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#c9953d] px-5 py-3 font-black text-[#211a18]"><Play size={17} fill="currentColor" /> شاهد المقطع</button>
            </div>
            <button type="button" onClick={() => setActiveId(selectedVideo.id)} className="group relative overflow-hidden rounded-2xl text-right" aria-label={`تشغيل ${selectedVideo.title_ar}`}>
              <Image src={selectedVideo.thumbnail_url || selectedVideo.poster || ""} alt={selectedVideo.title_ar} width={900} height={506} sizes="(max-width: 1024px) 100vw, 55vw" className="aspect-video w-full object-cover transition duration-300 group-hover:scale-105" />
              <span className="absolute inset-0 grid place-items-center bg-black/25"><span className="grid size-14 place-items-center rounded-full bg-[#c9953d] text-[#211a18]"><Play size={23} fill="currentColor" /></span></span>
              <span className="absolute bottom-3 right-3 rounded-full bg-[#211a18]/85 px-3 py-1 text-sm font-bold">{selectedVideo.title_ar}</span>
            </button>
          </div>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-dashed border-[#cbb896] bg-[#fffaf1] p-6 text-center text-[#6c5b4f]">ستظهر أمثلة الفيديو هنا بعد نشر فيديوهات مسموح بعرضها في صفحات الهبوط.</div>
        )}
        {activeVideo ? <VideoPlayer isOpen={Boolean(activeVideo)} videoId={activeVideo.youtube_embed_id} title={activeVideo.title_ar} onClose={() => setActiveId(null)} /> : null}
      </div>
    </section>
  )
}
