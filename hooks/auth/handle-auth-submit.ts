import { login, signup } from "@/app/login/actions"
import { toast } from "sonner"


export const handleSubmit = async (formData: FormData, setSuccess: React.Dispatch<React.SetStateAction<string | null>>, setError: React.Dispatch<React.SetStateAction<string | null>>, isLogin: boolean) => {
    try {

        setError(null)
        setSuccess(null)

        const action = isLogin ? login : signup

        const result = await action(formData) as { error?: string; success?: string } | undefined

        if (result?.error) {
            toast.error(result.error)
            setError(result.error)
        }
        if (result?.success) {
            toast.success(result.success)
            setSuccess(result.success)
        }
    } catch (error: any) {
        // If it's a redirect error, we should let it bubble up
        if (error.message === 'NEXT_REDIRECT') {
            throw error;
        }
        const errorMessage = error instanceof Error ? error.message : String(error)
        toast.error(errorMessage)
        setError(errorMessage)
    }
}