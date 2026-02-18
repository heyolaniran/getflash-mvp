import { NextResponse } from "next/server";


export async function GET(request: Request, context: { params: Promise<{ tag: string }> }) {
    const { tag } = await context.params


    console.log(tag);

    const lnUrlResponse = {
        tag: "payRequest",
        callback: `https://ardelia-serpentiform-arboreally.ngrok-free.dev/api/lnurlp/callback?tag=${tag}`,
        maxSendable: 100000000,
        minSendable: 1000,
        metadata: JSON.stringify([
            ["text/plain", `Pay to @${tag} via Flash`],
            ["text/identifier", `${tag}@getflashy.xyz`]
        ]),
        commentAllowed: 500,

    }

    return NextResponse.json(lnUrlResponse, {
        headers: {
            'Access-Control-Allow-Origin': '*', // Required by LNURL spec
            'Content-Type': 'application/json',
        },
    });
}