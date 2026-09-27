'use client'
import { useState, useEffect, useMemo } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { audioSystem } from '@/lib/audio-system'
import { GameResults } from './GameResults'

const verses = [
  { verse: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ (الفاتحة: 2)', surah: 'الفاتحة' },
  { verse: 'قُلْ هُوَ اللَّهُ أَحَدٌ (الإخلاص: 1)', surah: 'الإخلاص' },
  { verse: 'يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُمْ مِنْ ذَكَرٍ وَأُنْثَى (الحجرات: 13)', surah: 'الحجرات' },
  { verse: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ (البقرة: 153)', surah: 'البقرة' },
  { verse: 'وَكُونُوا مَعَ الصَّادِقِينَ (التوبة: 119)', surah: 'التوبة' },
]

export function VerseGuessingGame() {
  const { locale } = useI18n()
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  
  useEffect(() => { const t = setInterval(() => setTimer(t => t + 1), 1000); return () => clearInterval(t) }, [done])

  const shuffled = useMemo(() => {
    return [...verses].sort(() => Math.random() - 0.5)
  // Intentional: reshuffle the options whenever the current question changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx])

  const handleAns = (surah: string) => {
    if (selected !== null || done) return
    setSelected(surah)
    
    if (surah === verses[idx].surah) { 
      audioSystem.playCorrect()
      setScore(s => s + 100)
      setCorrect(c => c + 1)
    } else {
      audioSystem.playError()
    }
    
    setTimeout(() => {
      if (idx < verses.length - 1) {
        setIdx(idx + 1)
        setSelected(null)
      } else {
        setDone(true)
      }
    }, 500)
  }

  if (done) {
    const stars = calculateStars((correct / verses.length) * 100)
    const badges = earnBadges({totalPoints: score, correctAnswers: correct, incorrectAnswers: verses.length - correct, timeSpent: timer, combo: 1, stars})
    return <GameResults score={score} stars={stars} timeSpent={timer} correctAnswers={correct} totalQuestions={verses.length} accuracy={(correct/verses.length)*100} earnedBadges={badges} onRestart={() => {setIdx(0); setScore(0); setCorrect(0); setDone(false); setTimer(0)}} onBack={() => {}} />
  }
  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-violet-50 to-transparent dark:from-violet-950/20 rounded-3xl p-8">
      <div className="flex justify-between mb-8"><div><div className="text-3xl font-bold text-primary">{score}</div></div><div><div className="text-2xl font-bold">{idx+1}/{verses.length}</div></div></div>
      <div className="bg-white dark:bg-background rounded-2xl p-8 mb-8 text-center">
        <p dir="rtl" className="text-lg font-bold mb-6">{verses[idx].verse}</p>
        <div className="space-y-2">
          {shuffled.map((v, i) => (
            <button key={i} onClick={() => handleAns(v.surah)} disabled={selected !== null} className={`w-full p-3 rounded-lg font-bold disabled:opacity-60 ${selected === v.surah ? (v.surah === verses[idx].surah ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white') : 'bg-muted hover:bg-primary/10'}`}>{v.surah}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
