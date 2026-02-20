"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, User, BarChart, Settings, Loader2, Bitcoin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import signOut from "@/hooks/signout"
import { useEffect, useState } from "react"
import QrSection from "./qr-section"
import SatsHistory from "./sats-history"
import { SavingBalance } from "@/hooks/record-stable-sats-transactions"
import { getSatsBalance } from "@/hooks/record-sats-transactions"
import ProfileSettingsForm from "./profile-settings-form"
export default function Dashboard({ profile, user }: { profile: any, user: any }) {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [balance, setBalance] = useState<number>(0)
    const [balanceSats, setBalanceSats] = useState<number>(0)
    const [balanceLoading, setBalanceLoading] = useState<boolean>(false)
    const [balanceSatsLoading, setBalanceSatsLoading] = useState<boolean>(false)

    const handleLogout = async () => {
        setIsLoading(true)
        await signOut()
        setIsLoading(false)
    }

    useEffect(() => {
        async function fetchBalance() {
            setBalanceLoading(true)
            setBalance(await SavingBalance())
            setBalanceSatsLoading(true)
            setBalanceSats(await getSatsBalance())
            setBalanceLoading(false)
            setBalanceSatsLoading(false)
        }

        fetchBalance()
    }, [])

    return (
        <div className="min-h-screen bg-background text-foreground p-8 font-sans">
            <header className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg ring-4 ring-background">
                        {profile.custom_tag[0].toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            @{profile.custom_tag}
                        </h1>
                        <p className="text-sm text-muted-foreground font-medium">{user?.email}</p>
                    </div>
                </div>

                <form action={handleLogout}>
                    <Button variant="outline" className="gap-2">
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </form>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            You saved
                        </CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {balanceLoading ?
                                <>
                                    <div className="w-24 h-8 bg-muted animate-pulse rounded">

                                    </div>

                                </> : `${balance} USD`}
                        </div>
                        <p className="text-xs text-muted-foreground">

                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Sats Balance
                        </CardTitle>
                        <Bitcoin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{balanceSatsLoading ? <div className="w-24 h-8 bg-muted animate-pulse rounded">

                        </div> : `${balanceSats} sats`}</div>

                    </CardContent>
                </Card>
            </main>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2 items-end justify-end">
                <QrSection customTag={profile.custom_tag} />
                <ProfileSettingsForm
                    initialTag={profile.custom_tag}
                    initialSavingPercentage={profile.saving_percentage || 0}
                />
            </section>

            <SatsHistory />
        </div>
    )
}