import getCMCPrice from "./get-cmc-price";


export default async function getBitcoinPrice(currency: string = "USD") {

    const response = await fetch(`${process.env.YADIO_CONVERT_RATE_BASE_URL}${currency}`);

    if (response.ok) {
        const data = await response.json();

        if (data.result == null)
            throw new Error(`Failed to fetch Bitcoin price for ${currency}`)

        return data.result;
    }

    // if yadio fails, check with CMC

    const price = await getCMCPrice(currency);
    if (price == null)
        throw new Error(`Failed to fetch Bitcoin price for ${currency}`)

    return price;
}