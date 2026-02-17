
import { redirect } from 'next/navigation'
import Dashboard from '@/components/dashboard'
import checkCompletedProfile from '@/hooks/check-completed-profile'

export default async function DashboardPage() {

    const { profile, user } = await checkCompletedProfile()

    if (!profile?.completed_profile) {
        redirect('/profile')
    }

    return (
        <Dashboard profile={profile} user={user} />
    )


}


