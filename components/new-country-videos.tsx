'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Play, Video } from 'lucide-react'
import { VideoPlayer } from '@/components/VideoPlayer'
import type { LandingVideo } from '@/lib/classroom-videos'

type Props = { videos: LandingVideo[] }

export function NewCountryVideos({ videos }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const categories = useMemo(() => Array.from(new Set(videos.map((video) => video.category).filter((item): item is string => Boolean(item)))), [videos])
  const [category, setCategory] = useState<string | null>(null)
  const filtered = category ? videos.filter((video) => video.category === category) : videos
  if (!videos.length) return null
  const activeVideo = videos.find((video) => video.id === activeId)
  return <section className="new-country-video-showcase" aria-labelledby="country-video-title">
    <div className="new-country-video-header"><div><p className="new-country-kicker"><Video size={16} /> من حصصنا المنشورة</p><h2 id="country-video-title">شاهد طريقة الحصة قبل أن تبدأ</h2><p>فيديوهات منشورة من لوحة التحكم، وتُفتح داخل مشغل الموقع عند الضغط على زر التشغيل.</p></div><div className="new-country-video-count">{videos.length}<small>فيديو منشور</small></div></div>
    {categories.length > 0 && <div className="new-country-video-filters"><button type="button" className={!category ? 'is-active' : ''} onClick={() => setCategory(null)}>الكل</button>{categories.map((item) => <button type="button" key={item} className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>}
    <div className="new-country-video-wall">{filtered.map((video, index) => <button type="button" className={`new-country-video-tile ${index === 0 ? 'is-featured' : ''}`} key={video.id} onClick={() => setActiveId(video.id)}><span className="new-country-video-thumb"><Image loader={({ src }) => src} src={video.thumbnail_url || video.poster || `https://img.youtube.com/vi/${video.youtube_embed_id}/mqdefault.jpg`} alt="" width={640} height={360} sizes="(max-width: 768px) 100vw, 33vw" className="h-full w-full object-cover" /><span className="new-country-video-play"><Play size={20} fill="currentColor" /></span>{video.duration_seconds ? <small>{Math.floor(video.duration_seconds / 60)}:{String(video.duration_seconds % 60).padStart(2, '0')}</small> : null}</span><strong>{video.title_ar}</strong>{video.teacher_name_ar ? <em>{video.teacher_name_ar}</em> : null}</button>)}</div>
    {activeVideo && <VideoPlayer isOpen={Boolean(activeVideo)} videoId={activeVideo.youtube_embed_id} title={activeVideo.title_ar} onClose={() => setActiveId(null)} />}
  </section>
}
