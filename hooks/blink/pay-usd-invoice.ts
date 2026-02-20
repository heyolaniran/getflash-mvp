import { payUsdInvoiceQuery } from "../graphql/pay-usd-invoice";

export async function payUsdInvoice({ paymentRequest }: { paymentRequest: string }) {

    try {

        const response = await fetch(`${process.env.BLINK_ENDPOINT!}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': process.env.BLINK_KEY!
            },
            body: JSON.stringify({
                query: payUsdInvoiceQuery,
                variables: {
                    input: {
                        paymentRequest: paymentRequest,
                        walletId: process.env.BLINK_BTC_WALLET!
                    }
                }
            })
        })

        const payload = await response.json();

        return payload;

    } catch (error) {
        console.log(error);
        return null
    }
}