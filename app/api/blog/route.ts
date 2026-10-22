import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { getPublishedBlogPost, getPublishedBlogPosts } from '@/lib/blog-repository'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .trim()
}

function toApiPost(post: Awaited<ReturnType<typeof getPublishedBlogPost>>) {
  if (!post) return null
  return {
    slug: post.slug,
    title_ar: post.title.ar, title_en: post.title.en, title_fr: post.title.fr,
    excerpt_ar: post.description.ar, excerpt_en: post.description.en, excerpt_fr: post.description.fr,
    keywords_ar: post.keywords.ar, keywords_en: post.keywords.en, keywords_fr: post.keywords.fr,
    content_ar: post.content.ar, content_en: post.content.en, content_fr: post.content.fr,
    category_ar: post.category.ar, category_en: post.category.en, category_fr: post.category.fr,
    author_ar: post.author.ar, author_en: post.author.en, author_fr: post.author.fr,
    read_time: post.readTime, cover_image: post.image, published_at: post.date, updated_at: post.updatedAt || null,
  }
}

// GET: fetch published posts (public) or all posts (admin with service key)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const all = searchParams.get('all') === 'true'

    if (all && !(await verifyAdminSession())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (all) {
      if (!supabaseAdmin) return NextResponse.json({ error: 'Blog backend unavailable' }, { status: 503 })
      const { data, error } = await supabaseAdmin
        .from('blog_posts')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('published_at', { ascending: false })
      if (error) return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
      return NextResponse.json(data || [])
    }
    if (slug) {
      const post = await getPublishedBlogPost(slug)
      return post ? NextResponse.json(toApiPost(post)) : NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    return NextResponse.json((await getPublishedBlogPosts()).map(toApiPost))
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[v0] blog GET exception:', msg)
    return NextResponse.json({ error: 'Blog backend unavailable' }, { status: 503 })
  }
}

// POST: create new post (admin only)
export async function POST(request: NextRequest) {
  try {
    if (!(await verifyAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!supabaseAdmin) return NextResponse.json({ error: 'Blog backend unavailable' }, { status: 503 })
    const body = await request.json()
    const {
      title_ar, title_en, title_fr,
      excerpt_ar, excerpt_en, excerpt_fr,
      keywords_ar, keywords_en, keywords_fr,
      content_ar, content_en, content_fr,
      cover_image, category_ar, category_en, category_fr,
      author_ar, author_en, author_fr,
      read_time, sort_order, is_published, slug: customSlug
    } = body

    if (!title_ar?.trim()) {
      return NextResponse.json({ error: 'title_ar is required' }, { status: 400 })
    }

    const slug = customSlug?.trim() || slugify(title_ar) || `post-${Date.now()}`
    const supabase = supabaseAdmin

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        slug,
        title_ar: title_ar.trim(),
        title_en: title_en?.trim() || title_ar.trim(),
        title_fr: title_fr?.trim() || title_ar.trim(),
        excerpt_ar: excerpt_ar?.trim() || '',
        excerpt_en: excerpt_en?.trim() || excerpt_ar?.trim() || '',
        excerpt_fr: excerpt_fr?.trim() || excerpt_ar?.trim() || '',
        keywords_ar: keywords_ar?.trim() || '',
        keywords_en: keywords_en?.trim() || '',
        keywords_fr: keywords_fr?.trim() || '',
        content_ar: content_ar?.trim() || '',
        content_en: content_en?.trim() || content_ar?.trim() || '',
        content_fr: content_fr?.trim() || content_ar?.trim() || '',
        cover_image: cover_image?.trim() || '/images/hero-children.webp',
        category_ar: category_ar?.trim() || 'عام',
        category_en: category_en?.trim() || 'General',
        category_fr: category_fr?.trim() || 'Général',
        author_ar: author_ar?.trim() || 'فريق الأكاديمية',
        author_en: author_en?.trim() || 'Academy Team',
        author_fr: author_fr?.trim() || "Équipe de l'académie",
        read_time: read_time || 5,
        sort_order: Number.isInteger(sort_order) ? sort_order : 0,
        is_published: is_published ?? false,
        published_at: is_published ? new Date().toISOString() : null,
      }])
      .select()
      .single()

    if (error) {
      console.error('[v0] blog POST error:', error)
      if (error.code === '23505') {
        return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Failed to create post', details: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[v0] blog POST exception:', msg)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT: update post (admin only)
export async function PUT(request: NextRequest) {
  try {
    if (!(await verifyAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!supabaseAdmin) return NextResponse.json({ error: 'Blog backend unavailable' }, { status: 503 })
    const body = await request.json()
    const { id, ...fields } = body

    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const supabase = supabaseAdmin

    const updateData: Record<string, unknown> = { ...fields, updated_at: new Date().toISOString() }

    if (fields.is_published && !fields.published_at) {
      updateData.published_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] blog PUT error:', error)
      return NextResponse.json({ error: 'Failed to update post', details: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[v0] blog PUT exception:', msg)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: delete post (admin only)
export async function DELETE(request: NextRequest) {
  try {
    if (!(await verifyAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!supabaseAdmin) return NextResponse.json({ error: 'Blog backend unavailable' }, { status: 503 })
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const supabase = supabaseAdmin

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[v0] blog DELETE error:', error)
      return NextResponse.json({ error: 'Failed to delete post', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[v0] blog DELETE exception:', msg)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
