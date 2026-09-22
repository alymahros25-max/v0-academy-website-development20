type RateLimitEntry = {
  count: number
  resetAt: number
}

const buckets = new Map<string, RateLimitEntry>()

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

/**
 * Best-effort per-instance limiter for low-volume public endpoints.
 * Production deployments should back this with a shared store when traffic scales.
 */
export function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
): RateLimitResult {
  if (buckets.size > 10_000) {
    for (const [bucketKey, entry] of buckets) {
      if (entry.resetAt <= now) buckets.delete(bucketKey)
    }
  }

  const current = buckets.get(key)
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: Math.max(0, limit - 1), retryAfterSeconds: 0 }
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    }
  }

  current.count += 1
  return {
    allowed: true,
    remaining: Math.max(0, limit - current.count),
    retryAfterSeconds: 0,
  }
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for")
  return forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"
}

export function rateLimitResponse(retryAfterSeconds: number) {
  return new Response(JSON.stringify({ error: "Too many requests" }), {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      "Retry-After": String(retryAfterSeconds),
      "Cache-Control": "no-store",
    },
  })
}
