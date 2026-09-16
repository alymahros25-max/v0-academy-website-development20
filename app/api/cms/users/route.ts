import { requireAdmin } from '@/lib/api-auth'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidateUsers } from '@/lib/api-revalidate'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

type RoleType = 'admin' | 'supervisor' | 'teacher' | 'student'

interface CMSUser {
  id?: number
  auth_user_id?: string
  email: string
  full_name?: string
  role_type: RoleType
  avatar_url?: string
  phone?: string
  bio?: string
  is_active?: boolean
  last_login?: string
}

// GET: Fetch all users or a specific user
export async function GET(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured', data: [] }, { status: 200 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')
    const roleFilter = searchParams.get('role')
    const isActive = searchParams.get('active')

    let query = supabase
      .from('cms_users')
      .select('*')

    if (userId) query = query.eq('id', parseInt(userId))
    if (roleFilter) query = query.eq('role_type', roleFilter)
    if (isActive !== null) query = query.eq('is_active', isActive === 'true')

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] User fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('[v0] GET /api/cms/users error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Create a new user
export async function POST(request: NextRequest) {
    const authError = await requireAdmin()
    if (authError) return authError

  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const body: CMSUser = await request.json()

    if (!body.email || !body.role_type || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
      return NextResponse.json({ error: 'Email and role_type are required' }, { status: 400 })
    }
    if (!['admin', 'supervisor', 'teacher', 'student'].includes(body.role_type)) {
      return NextResponse.json({ error: 'Invalid role_type' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('cms_users')
      .insert({
        email: body.email.trim().toLowerCase(),
        full_name: body.full_name,
        role_type: body.role_type,
        avatar_url: body.avatar_url,
        phone: body.phone,
        bio: body.bio,
        is_active: body.is_active !== false,
      })
      .select()

    if (error) {
      console.error('[v0] User creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Revalidate users on successful creation
    try {
      await revalidateUsers()
    } catch (revalidateError) {
      console.warn('[v0] Revalidation warning:', revalidateError)
    }

    return NextResponse.json({
      success: true,
      data: data?.[0],
      message: 'User created successfully',
      revalidated: true,
    }, { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/cms/users error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH: Update a user
export async function PATCH(request: NextRequest) {
    const authError = await requireAdmin()
    if (authError) return authError

  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const body: Partial<CMSUser> = await request.json()
    if (body.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    if (body.role_type !== undefined && !['admin', 'supervisor', 'teacher', 'student'].includes(body.role_type)) return NextResponse.json({ error: 'Invalid role_type' }, { status: 400 })

    const { data, error } = await supabase
      .from('cms_users')
      .update({
        ...(body.email !== undefined && { email: body.email.trim().toLowerCase() }),
        ...(body.full_name !== undefined && { full_name: body.full_name }),
        ...(body.role_type !== undefined && { role_type: body.role_type }),
        avatar_url: body.avatar_url,
        phone: body.phone,
        bio: body.bio,
        ...(body.is_active !== undefined && { is_active: body.is_active }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', parseInt(userId))
      .select()

    if (error) {
      console.error('[v0] User update error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Revalidate users on successful update
    try {
      await revalidateUsers()
    } catch (revalidateError) {
      console.warn('[v0] Revalidation warning:', revalidateError)
    }

    return NextResponse.json({
      success: true,
      data: data?.[0],
      message: 'User updated successfully',
      revalidated: true,
    }, { status: 200 })
  } catch (error) {
    console.error('[v0] PATCH /api/cms/users error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Delete a user
export async function DELETE(request: NextRequest) {
    const authError = await requireAdmin()
    if (authError) return authError

  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const { data: targetUser } = await supabase.from('cms_users').select('role_type').eq('id', parseInt(userId)).single()
    if (targetUser?.role_type === 'admin') {
      const { count } = await supabase.from('cms_users').select('id', { count: 'exact', head: true }).eq('role_type', 'admin').eq('is_active', true)
      if ((count ?? 0) <= 1) return NextResponse.json({ error: 'لا يمكن حذف آخر مسؤول مفعّل' }, { status: 409 })
    }

    const { error } = await supabase
      .from('cms_users')
      .delete()
      .eq('id', parseInt(userId))

    if (error) {
      console.error('[v0] User deletion error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('[v0] DELETE /api/cms/users error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
