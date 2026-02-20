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

export async function getSatsBalance() {
    const supabase = createClient();

    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError) {
        console.log("Error", userError);
        return 0;
    }

    const { data, error } = await supabase.from("sats_transactions")
        .select("amount,type")
        .eq("user_id", user?.user?.id)
        .eq("status", "success")
        .in("type", ["received", "sent"]);
    if (error) {
        console.log("Error", error);
        return 0;
    }

    return data.reduce((acc, curr) => {
        if (curr.type === "received") return acc + curr.amount;
        if (curr.type === "sent") return acc - curr.amount;
        return acc;
    }, 0);
}