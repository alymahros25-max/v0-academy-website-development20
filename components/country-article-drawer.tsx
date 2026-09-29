'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Bird, MessageCircle, Sparkles, X } from 'lucide-react'

type Props = {
  title: string
  body: string
  tone?: 'quran' | 'arabic'
  mode?: 'button' | 'answer' | 'side-tab' | 'glow'
  href?: string
}

export function CountryArticleDrawer({ title, body, tone = 'quran', mode = 'button', href }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  const trigger = mode === 'answer'
    ? <button type="button" className={`country-article-trigger country-article-trigger-${tone} country-article-trigger-answer`} onClick={() => setOpen(true)} aria-haspopup="dialog"><MessageCircle size={16} aria-hidden="true" /><span>إجابة: {title}</span></button>
    : mode === 'side-tab'
      ? <button type="button" className={`country-article-trigger country-article-trigger-${tone} country-article-trigger-side`} onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={`افتح إجابة: ${title}`}><Bird size={16} aria-hidden="true" /><span>إجابة سريعة</span></button>
      : mode === 'glow'
        ? <button type="button" className={`country-article-trigger country-article-trigger-${tone} country-article-trigger-glow`} onClick={() => setOpen(true)} aria-haspopup="dialog"><Sparkles size={16} aria-hidden="true" /><span>{title}</span><ArrowLeft size={16} aria-hidden="true" /></button>
        : <button type="button" className={`country-article-trigger country-article-trigger-${tone}`} onClick={() => setOpen(true)} aria-haspopup="dialog"><span>{title}</span><ArrowLeft size={16} aria-hidden="true" /></button>

  if (href) {
    return <Link href={href} className={`country-article-trigger country-article-trigger-${tone}`}>
      <span>{title}</span><ArrowLeft size={16} aria-hidden="true" />
    </Link>
  }

  return <>
    {trigger}
    {open && <div className="country-article-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false) }}>
      <aside className="country-article-drawer" role="dialog" aria-modal="true" aria-labelledby="country-article-title">
        <button type="button" className="country-article-close" onClick={() => setOpen(false)} aria-label="إغلاق المقالة"><X size={20} /></button>
        <p className={`country-article-kicker country-article-kicker-${tone}`}>إجابة قصيرة تساعدك على القرار</p>
        <h3 id="country-article-title">{title}</h3>
        <p>{body}</p>
      </aside>
    </div>}
  </>
}
