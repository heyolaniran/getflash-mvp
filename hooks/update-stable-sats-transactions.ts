import { createClient } from "@/lib/supabase/client";

export default async function updateStableSatsTransactions({ paymentHash, preimage, transaction_id, amount }: { paymentHash: string, preimage: string, transaction_id: string, amount: number }) {

    const supabase = createClient();

    const { data, error } = await supabase.from("stablesats_transactions").update({
        status: "success",
        revealed_preimage: preimage,
        external_transaction_id: transaction_id,
        amount: amount,
    }).eq("payment_hash", paymentHash);

    if (error) {
        console.log("Error", error);
        return null;
    }

    return data;
}

export async function tempUpdateStableSatsTransactions({ paymentHash, newHash, paymentSecret }: { paymentHash: string, newHash: string, paymentSecret: string }) {

    const supabase = createClient();

    const { data, error } = await supabase.from("stablesats_transactions").update({
        payment_hash: newHash,
        payment_secret: paymentSecret,
    }).eq("payment_hash", paymentHash);

    if (error) {
        console.log("Error", error);
        return null;
    }

    return data;
}