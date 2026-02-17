"use server"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function checkCompletedProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

    return { profile, user }


}