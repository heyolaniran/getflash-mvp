
'use client'


import { useFormStatus } from 'react-dom'
import { updateProfile } from './actions'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button
            type="submit"
            disabled={pending}
            className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30"
        >
            {pending ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                </>
            ) : (
                'Complete Profile'
            )}
        </Button>
    )
}


export default function ClientProfileForm({ initialTag }: { initialTag?: string }) {
    const [error, setError] = useState<string | null>(null)
    const [savingPercentage, setSavingPercentage] = useState(0)

    async function handleSubmit(formData: FormData) {
        setError(null)
        const result = await updateProfile(formData)
        if (result?.error) {
            setError(result.error)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="custom_tag" className="text-base">
                    Your unique tag
                </Label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium select-none z-10">@</span>
                    <Input
                        id="custom_tag"
                        name="custom_tag"
                        defaultValue={initialTag || ''}
                        type="text"
                        required
                        minLength={3}
                        pattern="[a-zA-Z0-9_-]+"
                        className="pl-8 font-mono bg-white/50 dark:bg-gray-800/50"
                        placeholder="username"
                    />
                </div>
                <p className="text-xs text-muted-foreground">
                    Only letters, numbers, underscores and hyphens.
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label htmlFor="saving_percentage" className="text-base">
                        Savings Percentage (Satoshis)
                    </Label>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
                        {savingPercentage}%
                    </span>
                </div>

                <Slider
                    id="saving_percentage_slider"
                    defaultValue={[0]}
                    max={100}
                    step={1}
                    className="py-4"
                    onValueChange={(vals) => setSavingPercentage(vals[0])}
                />
                <input
                    type="hidden"
                    name="saving_percentage"
                    value={savingPercentage}
                />

                <p className="text-xs text-muted-foreground">
                    Choose what percentage of every payment you want to automatically save in Satoshis.
                </p>
            </div>

            {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-900/20">
                    {error}
                </div>
            )}

            <SubmitButton />
        </form>
    )
}


