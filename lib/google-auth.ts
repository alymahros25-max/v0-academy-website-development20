import { JWT } from 'google-auth-library'

function normalizePrivateKey(value: string | undefined): string | undefined {
  if (!value) return undefined

  let normalized = value.trim()

  // Support either a pasted PEM value or a JSON service-account object.
  if (normalized.startsWith('{')) {
    try {
      const parsed = JSON.parse(normalized) as { private_key?: unknown }
      if (typeof parsed.private_key === 'string') normalized = parsed.private_key
    } catch {
      // Keep the original value so the Google library returns a useful error.
    }
  }

  // Vercel values are sometimes saved with escaped newlines or wrapping quotes.
  if (normalized.startsWith('"') && normalized.endsWith('"')) {
    try {
      normalized = JSON.parse(normalized) as string
    } catch {
      normalized = normalized.slice(1, -1)
    }
  }

  return normalized.replace(/\\r/g, '').replace(/\\n/g, '\n').replace(/\r/g, '').trim()
}

export function getGoogleServiceAccountAuth(scopes: string[]): JWT {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim()
  const privateKey = normalizePrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)

  if (!email || !privateKey) {
    throw new Error('Google service account credentials are not configured')
  }

  return new JWT({
    email,
    key: privateKey,
    scopes,
  })
}
