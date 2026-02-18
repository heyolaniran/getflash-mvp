import { createClient } from "@/lib/supabase/client";

export default async function recordSatsTransactions({ payload }: { payload: any }) {


    const supabase = createClient();

    const { data, error } = await supabase.from("sats_transactions").insert(payload);

    if (error) {
        console.log("Error", error);
        return null;
    }

    return data;

}