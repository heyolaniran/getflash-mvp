
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { updateProfileSettings } from './actions'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {pending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
        </Button>
    )
}

interface ProfileSettingsFormProps {
    initialTag: string
    initialSavingPercentage: number
}

export default function ProfileSettingsForm({
    initialTag,
    initialSavingPercentage,
}: ProfileSettingsFormProps) {
    const [savingPercentage, setSavingPercentage] = useState(initialSavingPercentage)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    async function handleSubmit(formData: FormData) {
        setMessage(null)
        const result = await updateProfileSettings(formData)
        if (result?.error) {
            setMessage({ type: 'error', text: result.error })
        } else if (result?.success) {
            setMessage({ type: 'success', text: result.success })
        }
    }

    return (
        <Card className="border-border shadow-sm mt-8">
            <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your public tag and savings preferences.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="custom_tag">Unique Tag</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium select-none z-10">@</span>
                            <Input
                                readOnly
                                id="custom_tag"
                                name="custom_tag"
                                defaultValue={initialTag}
                                type="text"
                                required
                                minLength={3}
                                pattern="[a-zA-Z0-9_-]+"
                                className="pl-8 font-mono"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="saving_percentage">Savings Percentage (Satoshis)</Label>
                            <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                                {savingPercentage}%
                            </span>
                        </div>
                        <Slider
                            defaultValue={[initialSavingPercentage]}
                            max={100}
                            step={1}
                            onValueChange={(vals) => setSavingPercentage(vals[0])}
                            className="py-2"
                        />
                        <input type="hidden" name="saving_percentage" value={savingPercentage} />
                        <p className="text-xs text-muted-foreground">
                            Percentage of payment to automatically convert/save.
                        </p>
                    </div>

                    {message && (
                        <div
                            className={`p-3 rounded-md text-sm ${message.type === 'error'
                                ? 'bg-destructive/10 text-destructive'
                                : 'bg-primary/10 text-primary'
                                }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <SubmitButton />
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

