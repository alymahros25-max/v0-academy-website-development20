import { JWT } from 'google-auth-library'

type ServiceAccountJson = {
  client_email?: unknown
  private_key?: unknown
}

function normalizePrivateKey(value: string | undefined): string | undefined {
  if (!value) return undefined

  let normalized = value.trim()

  // Support either a pasted PEM value or a JSON service-account object.
  if (normalized.startsWith('{')) {
    try {
      const parsed = JSON.parse(normalized) as ServiceAccountJson
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

function readServiceAccountJson(): { email?: string; privateKey?: string } {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim()
  if (!raw) return {}

  try {
    const credentials = JSON.parse(raw) as ServiceAccountJson
    return {
      email: typeof credentials.client_email === 'string' ? credentials.client_email.trim() : undefined,
      privateKey: typeof credentials.private_key === 'string' ? normalizePrivateKey(credentials.private_key) : undefined,
    }
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON')
  }
}

export function getGoogleServiceAccountAuth(scopes: string[]): JWT {
  const jsonCredentials = readServiceAccountJson()
  const email = jsonCredentials.email || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim()
  const privateKey = jsonCredentials.privateKey || normalizePrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)

  if (!email || !privateKey) {
    throw new Error('Google service account credentials are not configured')
  }

  return new JWT({
    email,
    key: privateKey,
    scopes,
  })
}
