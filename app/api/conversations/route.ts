import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Server-side auth — always reliable
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'not_authenticated' }, { status: 401 })
    }

    const { productId, sellerId } = await request.json()

    if (!productId || !sellerId) {
      return NextResponse.json({ error: 'missing_params' }, { status: 400 })
    }

    if (user.id === sellerId) {
      return NextResponse.json({ error: 'is_owner' }, { status: 400 })
    }

    // Check if conversation already exists
    const { data: existing, error: selectError } = await supabase
      .from('conversations')
      .select('id')
      .eq('product_id', productId)
      .eq('buyer_id', user.id)
      .eq('seller_id', sellerId)
      .maybeSingle()

    if (selectError) {
      return NextResponse.json({ error: selectError.message }, { status: 500 })
    }

    if (existing) {
      return NextResponse.json({ id: existing.id })
    }

    // Create new conversation
    const { data: conversation, error: insertError } = await supabase
      .from('conversations')
      .insert({ product_id: productId, buyer_id: user.id, seller_id: sellerId })
      .select('id')
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ id: conversation.id })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}
