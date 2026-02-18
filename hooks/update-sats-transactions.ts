import { createClient } from "@/lib/supabase/client";

export default async function updateSatsTransactions({ paymentHash, preimage, transaction_id }: { paymentHash: string, preimage: string, transaction_id: string }) {

    const supabase = createClient();

    const { data, error } = await supabase.from("sats_transactions").update({
        status: "success",
        revealed_preimage: preimage,
        external_transaction_id: transaction_id
    }).eq("payment_hash", paymentHash);

    if (error) {
        console.log("Error", error);
        return null;
    }

    return data;
}