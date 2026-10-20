// Browser reads go through the public server route. This keeps the database
// boundary in one place and prevents client components from depending on the
// Supabase schema or access policy details.

export interface ClassroomVideo {
  id: string
  title_ar?: string
  title_en?: string
  title_fr?: string
  description_ar?: string
  description_en?: string
  description_fr?: string
  youtube_url: string
  youtube_embed_id: string
  thumbnail_url?: string
  category?: string
  is_published?: boolean
  is_featured?: boolean
  display_order?: number
  created_at?: string
  updated_at?: string
}

/**
 * Fetch published classroom videos from the server API
 * Implements defensive programming with proper error handling and null checks
 */
export async function fetchClassroomVideos(): Promise<ClassroomVideo[]> {
  try {
    const response = await fetch('/api/classroom-videos', { cache: 'no-store' })
    if (!response.ok) return []
    const data = await response.json()

    // Defensive null checks
    if (!Array.isArray(data)) {
      console.warn('[v0] Invalid data format from classroom videos API')
      return []
    }

    return data?.filter((video): video is ClassroomVideo => {
      // Ensure video has required fields
      return !!(video?.id && video?.youtube_embed_id)
    }) || []
  } catch (err) {
    console.error('[v0] Classroom videos fetch exception:', err)
    return []
  }
}

/**
 * Fetch a single video by ID
 */
export async function fetchClassroomVideoById(id: string): Promise<ClassroomVideo | null> {
  try {
    if (!id?.trim()) return null

    const videos = await fetchClassroomVideos()
    const data = videos.find((video) => video.id === id)

    if (!data?.id || !data?.youtube_embed_id) {
      console.warn('[v0] Invalid video data')
      return null
    }

    return data as ClassroomVideo
  } catch (err) {
    console.error('[v0] Fetch video by ID exception:', err)
    return null
  }
}

/**
 * Get videos by category
 */
export async function fetchVideosByCategory(category: string): Promise<ClassroomVideo[]> {
  try {
    if (!category?.trim()) return []

    const data = await fetchClassroomVideos()
    return data.filter((video) => video.category === category.trim())
  } catch (err) {
    console.error('[v0] Fetch by category exception:', err)
    return []
  }
}

/**
 * Get featured videos only
 */
export async function fetchFeaturedClassroomVideos(limit = 6): Promise<ClassroomVideo[]> {
  try {
    const data = await fetchClassroomVideos()
    return data.filter((video) => video.is_featured).slice(0, Math.max(0, limit))
  } catch (err) {
    console.error('[v0] Fetch featured exception:', err)
    return []
  }
}
