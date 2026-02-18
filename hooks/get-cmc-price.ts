
export default async function getCMCPrice(currency: string) {

    const baseUrl = process.env.CMC_BASE_URL;
    const apiKey = process.env.CMC_API_KEY;

    if (!apiKey) {
        throw new Error("CMC_API_KEY is not defined");
    }

    // get quoted price

    const url = `${baseUrl}?slug=bitcoin&convert=${currency}`;

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'X-CMC_PRO_API_KEY': apiKey
        }
    })

    const data = await response.json();

    const price = Math.round(data.data["1"].quote[currency].price);

    return price;


}