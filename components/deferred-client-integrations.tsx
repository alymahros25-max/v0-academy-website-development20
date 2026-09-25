"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const ClarityTracker = dynamic(() => import("@/components/clarity-tracker").then((module) => module.ClarityTracker), { ssr: false })
const FloatingButtons = dynamic(() => import("@/components/floating-buttons").then((module) => module.FloatingButtons), { ssr: false })

export function DeferredClientIntegrations() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = () => {
      if (!cancelled) setReady(true)
    }

    const idleCallback = (window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
      cancelIdleCallback?: (handle: number) => void
    }).requestIdleCallback

    if (idleCallback) {
      const idleId = idleCallback(load, { timeout: 2000 })
      return () => {
        cancelled = true
        window.cancelIdleCallback?.(idleId)
      }
    }

    const timeoutId = globalThis.setTimeout(load, 1200)
    return () => {
      cancelled = true
      globalThis.clearTimeout(timeoutId)
    }
  }, [])

  return (
    <>
      <ClarityTracker />
      {ready && <FloatingButtons />}
    </>
  )
}
