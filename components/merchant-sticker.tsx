import QRCode from "react-qr-code";

interface MerchantStickerProps {
    tag: string;
    domain: string;
}

export function MerchantSticker({ tag, domain }: MerchantStickerProps) {
    const value = `${tag}@${domain}`;

    return (
        <div
            id="merchant-sticker"
            style={{
                width: "500px",
                height: "750px",
                background: "linear-gradient(135deg, #749D79 0%, #4a664d 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "40px",
                color: "white",
                fontFamily: "system-ui, -apple-system, sans-serif",
                borderRadius: "40px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
        >
            <div style={{ textAlign: "center" }}>
                <h1 style={{ fontSize: "40px", margin: "0", fontWeight: "800", letterSpacing: "-1px" }}>
                    FLASH
                </h1>
                <p style={{ margin: "5px 0 0 0", opacity: "0.8", fontSize: "16px", fontWeight: "500" }}>
                    Instant Bitcoin Payments
                </p>
            </div>

            <div
                style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "30px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                }}
            >
                <QRCode value={value} size={300} level="H" />
            </div>

            <div style={{ textAlign: "center", width: "100%" }}>
                <p style={{ margin: "0", fontSize: "18px", fontWeight: "600", color: "rgba(255,255,255,0.9)" }}>
                    Scan to Pay
                </p>
                <div
                    style={{
                        marginTop: "10px",
                        padding: "12px 20px",
                        backgroundColor: "rgba(0,0,0,0.2)",
                        borderRadius: "15px",
                        display: "inline-block"
                    }}
                >
                    <p style={{ margin: "0", fontSize: "20px", fontWeight: "700", fontFamily: "monospace" }}>
                        {value}
                    </p>
                </div>
            </div>

            <div style={{ fontSize: "12px", opacity: "0.5" }}>
                {domain}
            </div>
        </div>
    );
}
