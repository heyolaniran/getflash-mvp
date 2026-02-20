"use server"
import checkTagExist from "@/hooks/check-tag-exist";
import recordSatsTransactions from "@/hooks/record-sats-transactions";
import recordStableSatsTransactions from "@/hooks/record-stable-sats-transactions";
import { getLnInvoice } from "@/hooks/blink/get-ln-invoice";
import { NextResponse } from "next/server";
export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag")
    const amount = parseInt(searchParams.get("amount")!) / 1000 // convert from millisats to sats 

    if (!amount || !tag)
        return NextResponse.json({ error: "Amount and tag are required" }, { status: 400 });

    const tagExist = await checkTagExist(tag);

    if (!tagExist)
        return NextResponse.json({ error: "Tag does not exist" }, { status: 404 });


    console.log("Tag exist", tagExist);
    // now create the invoice with the specific amount.

    try {


        const payload = await getLnInvoice({ amount, tag });

        if (payload.errors) {
            console.log("Error", payload.errors[0].message)
            return NextResponse.json({ error: payload.errors[0].message }, { status: 500 });
        }

        // record the transaction in the database.

        const recordPayload = {
            user_id: tagExist.id,
            amount: amount,
            type: 'received',
            payment_hash: payload.data.lnInvoiceCreate.invoice.paymentHash,
            payment_secret: payload.data.lnInvoiceCreate.invoice.paymentSecret,
            external_transaction_id: payload.data.lnInvoiceCreate.invoice.paymentHash,
            status: 'pending',
            revealed_preimage: null
        }

        console.log("Record Payload", recordPayload);

        // check if the amount is above the minimum limit

        if (amount > parseInt(process.env.MINIMUM_AMOUNT_FOR_SAVING!)) {

            // 5 SATS are deducted for the cost of the transaction
            const amountSats = Math.floor((amount) * (tagExist.saving_percentage / 100));
            recordPayload.amount = amount - amountSats - 2;

            // create a stableSats Transaction for the remaining amount 

            const stableSatsPayload = {
                user_id: tagExist.id,
                amount: amountSats,
                type: 'saved',
                payment_hash: payload.data.lnInvoiceCreate.invoice.paymentHash,
                payment_secret: payload.data.lnInvoiceCreate.invoice.paymentSecret,
                external_transaction_id: payload.data.lnInvoiceCreate.invoice.paymentHash,
                status: 'pending',
                revealed_preimage: null
            }

            const recordStableSatsTransaction = await recordStableSatsTransactions({ payload: stableSatsPayload });

            console.log("Record StableSats Transaction", recordStableSatsTransaction);
        }

        const recordTransaction = await recordSatsTransactions({ payload: recordPayload });

        console.log("Record Transaction", recordTransaction);


        console.log("Transaction recorded successfully", recordTransaction);
        const responsePayload = {
            status: "OK",
            pr: payload.data.lnInvoiceCreate.invoice.paymentRequest,
            routes: []
        }
        console.log("Response Payload", responsePayload);
        return NextResponse.json(responsePayload);
    } catch (error) {
        console.log("Error", error)
        return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
    }



}