'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function loginAction(
  email: string,
  password: string,
  redirectTo: string = '/dashboard'
): Promise<{ error: string } | never> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    const msg =
      error.message === 'Invalid login credentials'
        ? 'Email o contraseña incorrectos.'
        : error.message === 'Email not confirmed'
        ? 'Debes confirmar tu email antes de entrar. Revisa tu bandeja de entrada.'
        : error.message
    return { error: msg }
  }

  redirect(redirectTo)
}
