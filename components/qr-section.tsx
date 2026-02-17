"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Settings } from "lucide-react"
import QRCode from "react-qr-code"
import { Button } from "./ui/button"
import { useRef } from "react"

export default function QrSection({ customTag }: { customTag: string }) {
    const qrRef = useRef<HTMLDivElement>(null);
    return (

        <Card className="cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Qr Code
                </CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center">
                    <QRCode value={`${customTag}@${process.env.NEXT_PUBLIC_DOMAIN}`} ref={qrRef} />
                </div>

                <div className="mt-4">
                    <p className="text-sm text-center font-medium">{customTag}@{process.env.NEXT_PUBLIC_DOMAIN}</p>

                    <div className="flex items-center justify-center mt-3">
                        <Button variant="outline" className="gap-2" onClick={() => {
                            const canvas = qrRef.current;
                            const link = document.createElement('a');
                            link.download = `${customTag}.png`;
                            link.href = canvas!.toDataURL();
                            link.click();
                        }}>
                            <Download className="w-4 h-4" />
                            Download
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>

    )
}