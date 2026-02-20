import { NextResponse } from "next/server";


export async function GET(request: Request, context: { params: Promise<{ tag: string }> }) {
    const { tag } = await context.params


    console.log(tag);

    const lnUrlResponse = {
        tag: "payRequest",
        callback: `https://${process.env.NEXT_PUBLIC_DOMAIN}/api/lnurlp/callback?tag=${tag}`,
        maxSendable: 100000000,
        minSendable: 1000,
        metadata: JSON.stringify([
            ["text/plain", `Pay to @${tag} via Flash`],
            ["text/identifier", `${tag}@${process.env.NEXT_PUBLIC_DOMAIN}`]
        ]),
        commentAllowed: 500,

    }

    return NextResponse.json(lnUrlResponse, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
    });
}