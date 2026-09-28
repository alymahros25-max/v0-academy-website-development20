import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { getCanonicalBlogSlug, getStoredBlogSlugs } from '@/lib/blog-slugs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const staticBlogPosts = [
  {
    id: 'static-quran-memorization-techniques', slug: 'quran-memorization-techniques',
    title_ar: 'تقنيات عملية لحفظ القرآن الكريم ومراجعته', title_en: 'Practical Quran Memorization and Revision Techniques', title_fr: 'Méthodes pratiques pour mémoriser et réviser le Coran',
    excerpt_ar: 'خطوات عملية لتنظيم حفظ القرآن ومراجعته، مع أفكار للتكرار والاستماع وفهم المعاني والمتابعة المناسبة لمستوى الطالب.', excerpt_en: 'Practical steps for organizing Quran memorization and revision, with ideas for repetition, listening, understanding, and suitable progress review.', excerpt_fr: 'Des étapes pratiques pour organiser la mémorisation et la révision du Coran, avec des idées de répétition et d’écoute.',
    content_ar: '', content_en: '', content_fr: '', cover_image: '/images/quran-memorization-techniques.webp',
    category_ar: 'تحفيظ القرآن', category_en: 'Quran Memorization', category_fr: 'Mémorisation du Coran', author_ar: 'فريق الأكاديمية', author_en: 'Academy Team', author_fr: "Équipe de l'académie", read_time: 9, sort_order: 1, is_published: true, published_at: '2024-06-15T00:00:00.000Z', created_at: '2024-06-15T00:00:00.000Z',
  },
  {
    id: 'static-arabic-foundation-importance', slug: 'arabic-foundation-importance',
    title_ar: 'أهمية التأسيس الصحيح في اللغة العربية للأطفال', title_en: 'The Importance of Proper Arabic Language Foundation for Children', title_fr: "L'importance d'une bonne base en langue arabe pour les enfants",
    excerpt_ar: 'تعرّف على مهارات القراءة والكتابة والحروف العربية التي يقوم عليها تأسيس اللغة.', excerpt_en: 'Learn about Arabic letters, reading, and writing skills in a child’s language foundation.', excerpt_fr: "Découvrez les lettres arabes et les compétences de lecture et d'écriture.",
    content_ar: '', content_en: '', content_fr: '', cover_image: '/images/arabic-foundation-importance.webp',
    category_ar: 'تأسيس العربية', category_en: 'Arabic Foundation', category_fr: 'Fondation Arabe', author_ar: 'فريق الأكاديمية', author_en: 'Academy Team', author_fr: "Équipe de l'académie", read_time: 7, sort_order: 2, is_published: true, published_at: '2024-06-10T00:00:00.000Z', created_at: '2024-06-10T00:00:00.000Z',
  },
  {
    id: 'static-online-learning-benefits', slug: 'online-learning-benefits',
    title_ar: 'فوائد التعليم الإلكتروني في تحسين مستوى الطلاب', title_en: 'Benefits of Online Learning in Improving Student Levels', title_fr: "Avantages de l'apprentissage en ligne pour améliorer le niveau des étudiants",
    excerpt_ar: 'مقال عن التعليم عن بعد والحصص المباشرة وبعض الجوانب العملية للتعلم عبر الإنترنت.', excerpt_en: 'An article about distance learning, live lessons, and practical aspects of online education.', excerpt_fr: "Un article sur l'apprentissage à distance, les cours en direct et l'enseignement en ligne.",
    content_ar: '', content_en: '', content_fr: '', cover_image: '/images/online-learning-benefits.webp',
    category_ar: 'التعليم الإلكتروني', category_en: 'Online Learning', category_fr: 'Apprentissage en ligne', author_ar: 'فريق الأكاديمية', author_en: 'Academy Team', author_fr: "Équipe de l'académie", read_time: 8, sort_order: 3, is_published: true, published_at: '2024-06-05T00:00:00.000Z', created_at: '2024-06-05T00:00:00.000Z',
  },
  {
    id: 'static-easy-arabic-learning-for-children', slug: 'easy-arabic-learning-for-children',
    title_ar: 'أساليب وأسس عملية لتسهيل تعلم اللغة العربية للأطفال', title_en: 'Practical Principles and Methods for Making Arabic Easier for Children', title_fr: 'Principes et méthodes pratiques pour faciliter l’apprentissage de l’arabe aux enfants',
    excerpt_ar: 'دليل عملي للآباء والمعلمين يوضح أسسًا وأساليب تجعل تعلم اللغة العربية أكثر وضوحًا ومتعة للأطفال.', excerpt_en: 'A practical guide for parents and teachers to make Arabic learning clearer and more engaging for children.', excerpt_fr: "Un guide pratique pour aider les parents et les enseignants à rendre l’apprentissage de l’arabe plus clair et motivant.",
    content_ar: '', content_en: '', content_fr: '', cover_image: '/images/arabic-learning-children-1.webp',
    category_ar: 'تأسيس العربية', category_en: 'Arabic Foundation', category_fr: 'Fondation en arabe', author_ar: 'فريق الأكاديمية', author_en: 'Academy Team', author_fr: "Équipe de l’académie", read_time: 9, sort_order: 4, is_published: true, published_at: '2026-09-11T00:00:00.000Z', created_at: '2026-09-11T00:00:00.000Z',
  },
  {
    id: 'static-ahkam-noon-sakinah-tanween', slug: 'ahkam-noon-sakinah-tanween',
    title_ar: 'أحكام النون الساكنة والتنوين: شرح مبسط مع أمثلة قرآنية', title_en: 'Noon Sakinah and Tanween Rules: A Beginner’s Guide with Quran Examples', title_fr: 'Règles du nûn sākinah et du tanwīn : guide simple et exemples coraniques',
    excerpt_ar: 'شرح تعليمي موجز لأحكام النون الساكنة والتنوين الأربعة: الإظهار والإدغام والإقلاب والإخفاء، مع الحروف وأمثلة قرآنية ومصدر للمراجعة.', excerpt_en: 'A clear introduction to the four noon sakinah and tanween rules, with their letters, Quran examples, and a reference for further study.', excerpt_fr: 'Une introduction claire aux quatre règles du nûn sākinah et du tanwīn, avec leurs lettres et des exemples coraniques.',
    content_ar: '', content_en: '', content_fr: '', cover_image: '/images/og-default.webp',
    category_ar: 'تعليم التجويد', category_en: 'Tajweed Learning', category_fr: 'Apprentissage du tajwid', author_ar: 'فريق الأكاديمية', author_en: 'Academy Team', author_fr: "Équipe de l'académie", read_time: 8, sort_order: 5, is_published: true, published_at: '2026-09-27T00:00:00.000Z', created_at: '2026-09-27T00:00:00.000Z',
  },
]

const staticBlogCoverBySlug: Record<string, string> = {
  'quran-memorization-techniques': '/images/quran-memorization-techniques.webp',
  'arabic-foundation-importance': '/images/arabic-foundation-importance.webp',
  'online-learning-benefits': '/images/online-learning-benefits.webp',
  'easy-arabic-learning-for-children': '/images/arabic-learning-children-1.webp',
  'ahkam-noon-sakinah-tanween': '/images/og-default.webp',
}

function getStaticBlogPost(slug: string) {
  return staticBlogPosts.find((post) => post.slug === slug)
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .trim()
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

    const key = all ? supabaseServiceKey : supabaseAnonKey
    if (!supabaseUrl || !key) {
      if (all) return NextResponse.json({ error: 'Blog backend unavailable' }, { status: 503 })
      if (slug) {
        const post = getStaticBlogPost(slug)
        return post ? NextResponse.json(post) : NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }
      return NextResponse.json(staticBlogPosts)
    }
    const supabase = createClient(supabaseUrl, key)

    if (slug) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .in('slug', getStoredBlogSlugs(slug))
        .eq('is_published', true)
        .single()

      if (error) {
        const post = getStaticBlogPost(slug)
        return post ? NextResponse.json(post) : NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }
      return NextResponse.json(data)
    }

    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('published_at', { ascending: false })

    if (!all) {
      query = query.eq('is_published', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('[v0] blog GET error:', error)
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    const publishedPosts = (data || []).map(post => ({
      ...post,
      slug: getCanonicalBlogSlug(post.slug),
      cover_image: staticBlogCoverBySlug[post.slug] || post.cover_image,
    }))
    if (!all) {
      const postsBySlug = new Map(publishedPosts.map((post) => [post.slug, post]))
      for (const post of staticBlogPosts) {
        if (!postsBySlug.has(post.slug)) postsBySlug.set(post.slug, post)
      }
      return NextResponse.json([...postsBySlug.values()])
    }
    return NextResponse.json(publishedPosts)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[v0] blog GET exception:', msg)
    if (request.nextUrl.searchParams.get('all') !== 'true') {
      const slug = request.nextUrl.searchParams.get('slug')
      if (slug) {
        const post = getStaticBlogPost(slug)
        if (post) return NextResponse.json(post)
      } else {
        return NextResponse.json(staticBlogPosts)
      }
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: create new post (admin only)
export async function POST(request: NextRequest) {
  try {
    if (!(await verifyAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const {
      title_ar, title_en, title_fr,
      excerpt_ar, excerpt_en, excerpt_fr,
      content_ar, content_en, content_fr,
      cover_image, category_ar, category_en, category_fr,
      author_ar, author_en, author_fr,
      read_time, sort_order, is_published, slug: customSlug
    } = body

    if (!title_ar?.trim()) {
      return NextResponse.json({ error: 'title_ar is required' }, { status: 400 })
    }

    const slug = customSlug?.trim() || slugify(title_ar) || `post-${Date.now()}`
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

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
    const body = await request.json()
    const { id, ...fields } = body

    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

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
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

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
