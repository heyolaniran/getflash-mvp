import { createClient } from "@/lib/supabase/client";

export default async function recordStableSatsTransactions({ payload }: { payload: any }) {

    const supabase = createClient();


    const { data, error } = await supabase.from("stablesats_transactions").insert(payload);
    if (error) {
        console.log("Error", error);
        return null;
    }

    return data;

}

export async function getStableSatsRelated(paymentHash: string) {

    const supabase = createClient();

    const { data, error } = await supabase.from("stablesats_transactions").select("*").eq("payment_hash", paymentHash);
    if (error) {
        console.log("Error", error);
        return null;
    }

    return data;

}


export async function SavingBalance() {

    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return 0
    }

    const { data, error } = await supabase
        .from('stablesats_transactions')
        .select("amount, type")
        .eq("user_id", user.id)
        .eq("status", "success")
        .in("type", ["saved", "withdrawal"]);

    if (error || !data) {
        console.error("Error fetching balance:", error);
        return 0;
    }

    const totalCents = data.reduce((acc, curr) => {
        const amount = Number(curr.amount) || 0;
        if (curr.type === 'saved') return acc + amount;
        if (curr.type === 'withdrawal') return acc - amount;
        return acc;
    }, 0);

    return totalCents / 100;
}