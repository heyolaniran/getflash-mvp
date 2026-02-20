import { createUsdInvoiceQuery } from "../graphql/create-usd-invoice";

export async function getUsdInvoice({ amount }: { amount: number }) {

    try {
        const response = await fetch(`${process.env.BLINK_ENDPOINT!}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': process.env.BLINK_KEY!
            },
            body: JSON.stringify({
                query: createUsdInvoiceQuery,
                variables: {
                    input: {
                        amount: amount,
                        memo: "Saving",
                        walletId: process.env.BLINK_USD_WALLET!
                    }
                }
            })
        })

        const payload = await response.json();

        return payload;
    } catch (error) {
        console.log(error)
        return null
    }

}