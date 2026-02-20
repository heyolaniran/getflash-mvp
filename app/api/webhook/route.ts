import { getUsdInvoice } from "@/hooks/blink/get-usd-invoice";
import { payUsdInvoice } from "@/hooks/blink/pay-usd-invoice";
import getBitcoinPrice from "@/hooks/get-bitcoin-price";
import { getStableSatsRelated } from "@/hooks/record-stable-sats-transactions";
import updateSatsTransactions from "@/hooks/update-sats-transactions";
import updateStableSatsTransactions, { tempUpdateStableSatsTransactions } from "@/hooks/update-stable-sats-transactions";
import dynamicCurrency from "@/lib/geoip";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    const body = await request.json();

    console.log("Body", body)

    if (body.eventType == 'receive.lightning' && body.transaction.status == 'success') {

        console.log("Event received", body.eventType)

        console.log("Transaction", body.transaction)

        console.log("Updating the transaction in background")

        if (body.transaction.settlementCurrency == "USD") {
            // update the stablesats_transactions table
            const updateStableSatsTransaction = await updateStableSatsTransactions({
                paymentHash: body.transaction.initiationVia.paymentHash,
                preimage: body.transaction.revealedPreimage,
                transaction_id: body.transaction.id,
                amount: body.transaction.settlementAmount, // in cents 
            });

            console.log("Update StableSats Transaction", updateStableSatsTransaction);
        } else {
            const updateTransaction = await updateSatsTransactions({
                paymentHash: body.transaction.initiationVia.paymentHash,
                preimage: body.transaction.revealedPreimage,
                transaction_id: body.transaction.id,
            });

            console.log("Update Transaction", updateTransaction);

            // create an Stable Sats ID then Pay it 

            // 
            const price = await getBitcoinPrice();

            // retreive the stable sats associeted

            const stableSatRelated = await getStableSatsRelated(body.transaction.initiationVia.paymentHash);

            if (stableSatRelated == null) {
                console.log("No stable sats related found")
                return NextResponse.json({ message: "No stable sats related found" }, { status: 200 });
            }

            const settlementAmount = Math.round(((stableSatRelated[0].amount * price) / 100000000) * 100); // get the sats amount in USD cent


            const payload = await getUsdInvoice({ amount: settlementAmount });

            console.log("USD GET Payload", payload)

            if (!payload || payload.errors) {
                console.log("Error", payload.errors[0].message)
                return NextResponse.json({ error: payload.errors[0].message }, { status: 500 });
            }

            // update the stablesats_transactions with the paymentHash and paymentSecret

            const updateStableSatsTransaction = await tempUpdateStableSatsTransactions({
                paymentHash: body.transaction.initiationVia.paymentHash,
                newHash: payload.data.lnUsdInvoiceCreate.invoice.paymentHash,
                paymentSecret: payload.data.lnUsdInvoiceCreate.invoice.paymentSecret
            });

            console.log("Update StableSats Transaction", updateStableSatsTransaction);

            // then pay that invoice 

            const payPayload = await payUsdInvoice({ paymentRequest: payload.data.lnUsdInvoiceCreate.invoice.paymentRequest });

            console.log("USD Pay Payload", payPayload.data)

            if (!payPayload || payPayload.errors) {
                console.log("Error", payPayload.errors[0].message)
                return NextResponse.json({ error: payPayload.errors[0].message }, { status: 500 });
            }

        }


    }

    return NextResponse.json({ message: "OK" }, { status: 200 });

}