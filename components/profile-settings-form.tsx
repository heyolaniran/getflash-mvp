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
import { Loader2, Sparkles, Brain, ArrowRight } from 'lucide-react'
import { updateProfileSettings } from '@/app/dashboard/actions'
import { getAiSavingsRecommendation } from '@/app/dashboard/ai-actions'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

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
    const [isAiLoading, setIsAiLoading] = useState(false)
    const [aiResult, setAiResult] = useState<{ recommendation: number, explanation: string } | null>(null)

    async function handleSubmit(formData: FormData) {
        try {
            const result = await updateProfileSettings(formData)
            if (result?.error) {
                toast.error(result.error)
            } else if (result?.success) {
                toast.success(result.success)
            }
        } catch (error: any) {
            if (error.message === 'NEXT_REDIRECT') {
                throw error
            }
            toast.error(error instanceof Error ? error.message : String(error))
        }
    }

    async function handleAiOptimize() {
        setIsAiLoading(true)
        try {
            const result = await getAiSavingsRecommendation()
            if ('error' in result) {
                toast.error(result.error as string)
            } else {
                setAiResult({
                    recommendation: result.recommendation!,
                    explanation: result.explanation!
                })
                toast.success("AI Recommendation ready!")
            }
        } catch (err) {
            toast.error("Failed to get AI recommendation")
        } finally {
            setIsAiLoading(false)
        }
    }

    const applyAiRecommendation = async () => {
        if (aiResult) {
            const formData = new FormData();
            formData.append('saving_percentage', aiResult.recommendation.toString());
            const result = await updateProfileSettings(formData)
            if (result?.error) {
                toast.error(result.error)

            } else if (result?.success) {
                toast.success(result.success)
                setSavingPercentage(aiResult.recommendation)
            }

            toast.info(`Saving percentage updated to ${aiResult.recommendation}%`)
        }
    }

    return (
        <Card className="border-border shadow-sm mt-8 overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Profile Settings</CardTitle>
                        <CardDescription>Update your public tag and savings preferences.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <form action={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <Label htmlFor="custom_tag" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Unique Tag</Label>
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
                                className="pl-8 font-mono bg-muted/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="space-y-1">
                                <Label htmlFor="saving_percentage" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Savings Percentage (Satoshis)</Label>
                                <p className="text-xs text-muted-foreground">
                                    Percentage of payment to automatically convert/save.
                                </p>
                            </div>
                            <span className="text-xl font-black text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
                                {savingPercentage}%
                            </span>
                        </div>

                        <div className="px-2">
                            <Slider
                                value={[savingPercentage]}
                                max={100}
                                step={1}
                                onValueChange={(vals) => setSavingPercentage(vals[0])}
                                className="py-2 cursor-pointer"
                            />
                        </div>
                        <input type="hidden" name="saving_percentage" value={savingPercentage} />
                    </div>

                    {/* AI Advisor Section */}
                    <div className="rounded-xl border border-indigo-500/20 bg-indigo-50/10 p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-md bg-indigo-500 text-white">
                                    <Sparkles className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-sm font-bold text-indigo-900 dark:text-indigo-100 italic">Flash AI Optimizer</span>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 gap-2 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                                onClick={handleAiOptimize}
                                disabled={isAiLoading}
                            >
                                {isAiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Brain className="w-3.5 h-3.5" />}
                                Get AI Recommendation
                            </Button>
                        </div>

                        <AnimatePresence mode="wait">
                            {aiResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-3"
                                >
                                    <div className="text-xs text-indigo-700/80 dark:text-indigo-300/80 leading-relaxed font-medium bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-indigo-500/10">
                                        "{aiResult.explanation}"
                                    </div>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        className="w-full h-8 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                                        onClick={applyAiRecommendation}
                                    >
                                        Apply Recommended {aiResult.recommendation}%
                                        <ArrowRight className="w-3 h-3" />
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-border/50">
                        <SubmitButton />
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

