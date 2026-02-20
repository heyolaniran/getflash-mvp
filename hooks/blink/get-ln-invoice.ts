
import { createLnInvoiceQuery } from "../graphql/create-ln-invoice";

export async function getLnInvoice({ amount, tag }: { amount: number, tag: string }) {

    try {
        const response = await fetch(`${process.env.BLINK_ENDPOINT!}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': process.env.BLINK_KEY!
            },
            body: JSON.stringify({
                query: createLnInvoiceQuery,
                variables: {
                    input: {
                        amount: Number(amount),
                        memo: "Payment to " + tag,
                        walletId: process.env.BLINK_BTC_WALLET!
                    }
                }
            })

        })

        const payload = await response.json();

        return payload
    } catch (error) {
        console.log("Error", error)
        return null;
    }



}