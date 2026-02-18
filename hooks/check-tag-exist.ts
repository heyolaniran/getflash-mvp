import { createClient } from "@/lib/supabase/client";

export default async function checkTagExist(tag: string) {

    const supabase = createClient();

    const { data, error } = await supabase.from("profiles").select("*").eq("custom_tag", tag).single();

    if (error) {
        return null;
    }

    return data;
}