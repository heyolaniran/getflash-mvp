"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Image, Settings } from "lucide-react"
import QRCode from "react-qr-code"
import { Button } from "./ui/button"
import { useRef, useState } from "react"
import { toPng } from "html-to-image"
import { MerchantSticker } from "./merchant-sticker"
import { toast } from "sonner"
import { motion } from "framer-motion"


export default function QrSection({ customTag }: { customTag: string }) {
    const qrRef = useRef<HTMLDivElement>(null);
    const stickerRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadQr = () => {
        if (!qrRef.current) return;

        const svg = qrRef.current.querySelector('svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new window.Image();

        img.onload = () => {
            canvas.width = img.width * 2; // Higher resolution
            canvas.height = img.height * 2;
            ctx?.scale(2, 2);
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `flash-qr-${customTag}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    const downloadSticker = async () => {
        if (!stickerRef.current) return;
        setIsDownloading(true);
        const loadingToast = toast.loading("Generating your sticker...");

        try {
            const dataUrl = await toPng(stickerRef.current, {
                quality: 1,
                pixelRatio: 2,
                skipFonts: true, // This often fixes the "font.trim" error in some browsers
                cacheBust: true,
                style: {
                    fontFamily: 'sans-serif', // Force a simple font if parsing fails
                }
            });

            const link = document.createElement('a');
            link.download = `flash-sticker-${customTag}.png`;
            link.href = dataUrl;
            link.click();
            toast.success("Sticker downloaded!", { id: loadingToast });
        } catch (err) {
            console.error('oops, something went wrong!', err);
            toast.error("Failed to generate sticker", { id: loadingToast });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Card className="overflow-hidden border-border/60 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Payment QR Code
                </CardTitle>
                <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                >
                    <Settings className="h-4 w-4 text-muted-foreground cursor-pointer" />
                </motion.div>
            </CardHeader>
            <CardContent>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center justify-center p-6 bg-white rounded-2xl border border-border/50 shadow-inner"
                    ref={qrRef}
                >
                    <QRCode
                        value={`${customTag}@${process.env.NEXT_PUBLIC_DOMAIN}`}
                        size={180}
                        level="H"
                        style={{ height: "auto" }}
                    />
                </motion.div>

                <div className="mt-6 space-y-4">
                    <div className="text-center">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Lighting Address</p>
                        <p className="text-base font-bold text-primary truncate px-2">
                            {customTag}@{process.env.NEXT_PUBLIC_DOMAIN}
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col gap-2"
                    >
                        <Button variant="outline" className="w-full gap-2 transition-all hover:bg-secondary border-muted-foreground/20" onClick={downloadQr}>
                            <Download className="w-4 h-4" />
                            Download QR
                        </Button>
                        <Button
                            variant="default"
                            className="w-full gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                            onClick={downloadSticker}
                            disabled={isDownloading}
                        >
                            <Image className="w-4 h-4" />
                            {isDownloading ? "Generating..." : "Download Merchant Sticker"}
                        </Button>
                    </motion.div>
                </div>

                {/* Hidden Sticker Template */}
                <div style={{ position: 'absolute', top: '-10000px', left: '-10000px', pointerEvents: 'none' }}>
                    <div ref={stickerRef}>
                        <MerchantSticker tag={customTag} domain={process.env.NEXT_PUBLIC_DOMAIN || ""} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}