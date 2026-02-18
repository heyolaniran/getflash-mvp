"use server"
import { headers } from "next/headers";

interface GeoIPData {
    location: {
        country_emoji: string;
        country_code2: string;
    };
    currency: {
        code: string;
        name: string;
    };
}

const dynamicCurrency = async () => {

    const baseUrl = process.env.IPGEO_BASE_URL;
    const apiKey = process.env.IPGEO_API_KEY;

    const headersList = await headers();
    let ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip");

    // Handle multiple IPs in x-forwarded-for (e.g. "client, proxy1, proxy2")
    if (ip && ip.includes(',')) {
        ip = ip.split(',')[0].trim();
    }

    let url = `${baseUrl}?apiKey=${apiKey}`;

    if (ip && ip !== "::1" && ip !== "127.0.0.1" && ip !== "::ffff:127.0.0.1") {
        url += `&ip=${ip}`;
    }

    const response = await fetch(url);

    const data: GeoIPData = await response.json();


    // country flag emoji 
    const flagEmoji = data.location.country_emoji;
    const currency = data.currency.code;
    let name = data.currency.name;

    if (name.includes("CFA")) {
        name = "Franc CFA";
    }


    // get tool object 
    const countryCode = data.location.country_code2;
    return { flagEmoji, currency, name };
}

export default dynamicCurrency;