'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function registerAction(
  email: string,
  password: string,
  fullName: string
): Promise<{ error: string } | never> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  })

  if (error) {
    const msg =
      error.message === 'User already registered'
        ? 'Ya existe una cuenta con este email.'
        : error.message
    return { error: msg }
  }

  redirect('/dashboard')
}
