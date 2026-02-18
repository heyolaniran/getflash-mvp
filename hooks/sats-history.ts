import { createClient } from "@/lib/supabase/client";

export default async function getSatsHistory() {

    const supabase = createClient();

    const authUser = await supabase.auth.getUser();

    if (!authUser.data.user) {
        return null;
    }

    const { data, error } = await supabase.from("sats_transactions").select("*").eq("user_id", authUser.data.user.id).eq("status", "success").order("created_at", { ascending: false });

    if (error) {
        console.log("Error", error);
        return null;
    }

    return data;


}