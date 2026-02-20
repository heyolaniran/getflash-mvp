
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfileSettings(formData: FormData) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const customTag = (formData.get('custom_tag') as string)?.trim().toLowerCase() || null
    const savingPercentage = parseInt(formData.get('saving_percentage') as string) || 0

    if (customTag && customTag.length < 3) {
        return { error: 'Custom tag must be at least 3 characters long' }
    }

    if (savingPercentage < 0 || savingPercentage > 100) {
        return { error: 'Invalid saving percentage' }
    }

    const { error } = await supabase
        .from('profiles')
        .update({
            ...(customTag && { custom_tag: customTag }),
            saving_percentage: savingPercentage,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (error) {
        if (error.code === '23505') {
            return { error: 'This tag is already taken. Please choose another one.' }
        }
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    return { success: 'Profile updated successfully' }
}
