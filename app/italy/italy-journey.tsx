'use client'

import { useState } from "react"
import { Play } from "lucide-react"
import { VideoPlayer } from "@/components/VideoPlayer"
import type { LandingVideo } from "@/lib/classroom-videos"

const stations = [
  { title: "التعارف", text: "اكتب البرنامج الذي تفكر فيه، ومستوى الطالب، وما تريد تحسينه." },
  { title: "الهدف", text: "حدد الحفظ أو المراجعة أو القراءة أو تأسيس العربية كهدفك الأول." },
  { title: "الوقت", text: "اذكر الأوقات التي تناسب الأسرة، وتُنسق المواعيد وفق توقيت روما." },
  { title: "الروتين", text: "اختر الإيقاع الشهري الذي تستطيع المحافظة عليه ضمن الباقة المناسبة." },
] as const

export function ItalyJourney({ videos }: { videos: LandingVideo[] }) {
  const [active, setActive] = useState(0)
  const [videoId, setVideoId] = useState<string | null>(null)
  const activeVideo = videos.slice(0, 4)[active]
  return (
    <section id="italy-journey" className="bg-[#20364A] px-5 py-16 text-[#F7F0E6] sm:px-8" aria-labelledby="italy-journey-title">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl"><p className="text-sm font-black tracking-[0.18em] text-[#D3A13B]">خطوات البداية · إيطاليا</p><h2 id="italy-journey-title" className="mt-3 text-3xl font-black sm:text-5xl">خطوات تكوين روتينك الشهري</h2><p className="mt-4 leading-8 text-[#F7F0E6]/75">انتقل بين المحطات الأربع، واجعل كل خطوة واضحة قبل اختيار الباقة.</p></div>
        <div className="mt-10 grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div className="space-y-3" role="tablist" aria-label="محطات إيطاليا">
            {stations.map((station, index) => <button key={station.title} type="button" role="tab" aria-selected={active === index} onClick={() => setActive(index)} className={`w-full rounded-2xl border p-5 text-right transition ${active === index ? "border-[#D3A13B] bg-[#7A3E35]" : "border-white/15 bg-white/5 hover:border-[#D3A13B]/70"}`}><span className="text-sm font-black text-[#D3A13B]">0{index + 1}</span><strong className="ms-3 text-xl font-black">{station.title}</strong><span className="mt-2 block leading-7 text-[#F7F0E6]/75">{station.text}</span></button>)}
          </div>
          <div className="rounded-[2rem] border border-[#D3A13B]/50 bg-[#F7F0E6] p-6 text-[#20364A] sm:p-8"><p className="text-sm font-black text-[#7A3E35]">المحطة {active + 1}</p><h3 className="mt-3 text-3xl font-black">{stations[active].title}</h3><p className="mt-4 text-lg leading-8">{stations[active].text}</p>{activeVideo ? <button type="button" onClick={() => setVideoId(activeVideo.youtube_embed_id)} className="mt-8 flex w-full items-center justify-between gap-4 rounded-2xl bg-[#66704A] p-5 text-right text-white transition hover:bg-[#7A3E35] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D3A13B]/60"><span><span className="block text-sm font-bold text-[#F7F0E6]/75">من حصصنا المنشورة</span><strong className="mt-1 block">{activeVideo.title_ar}</strong></span><span className="rounded-full bg-[#D3A13B] p-3 text-[#20364A]"><Play size={20} fill="currentColor" /></span></button> : <p className="mt-8 rounded-2xl bg-[#E8D9BF] p-5 font-bold text-[#20364A]">تعرّف إلى هذه الخطوة ثم تواصل معنا باللغة العربية.</p>}</div>
        </div>
      </div>
      {videoId && <VideoPlayer isOpen={Boolean(videoId)} videoId={videoId} title="فيديو من حصص أكاديمية الحافظ" onClose={() => setVideoId(null)} />}
    </section>
  )
}
