"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFormStatus } from 'react-dom'
import { login, signup } from '@/app/login/actions'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { handleSubmit } from '@/hooks/auth/handle-auth-submit'

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus()
    return (
        <Button
            type="submit"
            disabled={pending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
        >
            {pending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {label}
        </Button>
    )
}

export default function Login() {

    const [isLogin, setIsLogin] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const loginHandle = async (formData: FormData) => {
        await handleSubmit(formData, setSuccess, setError, isLogin);
    }


    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/20 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md z-10"
            >
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-white/20 shadow-2xl">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </CardTitle>
                        <CardDescription>
                            {isLogin
                                ? 'Enter your credentials to access your account'
                                : 'Sign up to get started with your new journey'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={loginHandle} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    className="bg-white dark:bg-gray-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    placeholder="••••••••"
                                    className="bg-white dark:bg-gray-900"
                                />
                            </div>

                            <SubmitButton label={isLogin ? 'Sign In' : 'Sign Up'} />
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <Button
                            variant="link"
                            onClick={() => {
                                setIsLogin(!isLogin)
                                setError(null)
                            }}
                            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            {isLogin
                                ? "Don't have an account? Sign up"
                                : "Already have an account? Sign in"}
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}