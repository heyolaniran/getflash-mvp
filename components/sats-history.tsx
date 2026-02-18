"use client"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import getSatsHistory from "@/hooks/sats-history";
import { useEffect, useState } from "react"

export default function SatsHistory() {

    const [history, setHistory] = useState<any[] | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            const history = await getSatsHistory();
            setHistory(history);
        }
        fetchHistory();
    }, []);
    return (

        <Card>
            <CardHeader>
                <CardTitle>Sats History</CardTitle>
            </CardHeader>
            <CardContent>
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
                                <TableCell> {item.type == "received" ? "+" : "-"}{item.amount}</TableCell>
                                <TableCell>{item.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}