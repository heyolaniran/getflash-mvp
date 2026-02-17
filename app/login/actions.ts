
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string


    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    if (data.user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('completed_profile')
            .eq('id', data.user.id)
            .single()

        revalidatePath('/', 'layout')

        if (profile?.completed_profile) {
            redirect('/dashboard')
        }
    }

    revalidatePath('/', 'layout')
    redirect('/profile')
}


export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string


    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        },
    })

    if (error) {
        return { error: error.message }
    }

    // If email confirmation is disabled, session will be present immediately
    if (data.session) {
        revalidatePath('/', 'layout')
        redirect('/profile')
    }

    return { success: 'Check your email to continue sign in process' }
}

