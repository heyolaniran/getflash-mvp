
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientProfileForm from '../../components/client-profile-form'

export default async function ProfilePage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch current profile if exists
    const { data: profile } = await supabase
        .from('profiles')
        .select('custom_tag')
        .eq('id', user.id)
        .single()

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-purple-500/10 blur-[100px]" />
                <div className="absolute top-40 right-10 w-60 h-60 rounded-full bg-blue-500/10 blur-[80px]" />
            </div>

            <div className="w-full max-w-lg relative z-10 glass dark:glass-dark rounded-2xl p-8 shadow-xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold text-xl mb-4 shadow-lg shadow-purple-500/25">
                        {user.email?.[0].toUpperCase()}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Finish Setting Up
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Welcome! To get started, please choose a unique @tag for your profile.
                    </p>
                </div>

                <ClientProfileForm initialTag={profile?.custom_tag} />
            </div>
        </div>
    )
}
