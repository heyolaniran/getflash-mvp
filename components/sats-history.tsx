"use client"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import getSatsHistory from "@/hooks/sats-history";
import { useEffect, useState } from "react"
import { Check, Loader2, X } from "lucide-react"

export default function SatsHistory() {

    const [history, setHistory] = useState<any[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true)
            const history = await getSatsHistory();
            setHistory(history);
            setIsLoading(false)
        }
        fetchHistory();
    }, []);
    return (

        <Card>
            <CardHeader>
                <CardTitle>Sats History</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history?.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell> <span className={item.type == "received" ? "bg-green-500/10 text-green-500 px-2 py-1 rounded-full" : "bg-red-500/10 text-red-500 px-2 py-1 rounded-full"}>{item.type == "received" ? "+" : "-"} {item.amount} sats</span> </TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        {item.status}
                                        {item.status == "pending" && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {item.status == "success" && <Check className="w-4 h-4 text-green-500" />}
                                        {item.status == "failed" && <X className="w-4 h-4 text-red-500" />}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}