"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useTheme } from "@/contexts/theme-context"
import { mutation } from "@/api/mutate"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { ROUTES } from "@/utils/constants/routes"
import { SESSION_ID } from "@/utils/constants/keys"
import { Moon, Sun } from "lucide-react"
import AuthForm from "@/components/form/auth"
import toast from "react-hot-toast"
import { ERROR_MESSAGE } from "@/utils/constants/message"
import { AxiosError } from "axios"

function LoginPage() {
    const router = useRouter()
    const { isAuth, needsProfileSelection, activeProfileId } = useAuth()
    const { theme, toggleTheme } = useTheme()

    const { mutateAsync: login, isPending } = mutation.user.login()
    const [errorMessage, setErrorMessage] = useState<string>();

    useEffect(() => {
        if (!isAuth) return

        if (needsProfileSelection || !activeProfileId) {
            router.push(ROUTES.PROFILES_SELECT)
            return
        }

        router.push(ROUTES.DASHBOARD)
    }, [isAuth, needsProfileSelection, activeProfileId, router])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            setErrorMessage("")
            e.preventDefault()
            const form = new FormData(e.currentTarget)
            const formData = Object.fromEntries(form.entries()) as Record<string, string>
            const res = await login({
                username: formData.email,
                password: formData.password,
            })
            if (res.sessionToken) {
                localStorage.setItem(SESSION_ID, res.sessionToken)
                router.push(ROUTES.PROFILES_SELECT)
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                setErrorMessage(error.response?.data?.message);
            }
            toast.error(ERROR_MESSAGE.SYSTEM_ERROR)
            console.error(error)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <button
                onClick={toggleTheme}
                className="fixed top-4 right-4 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-10"
            >
                <span className="text-xl">{theme === "light" ? <Moon /> : <Sun />}</span>
            </button>

            <AuthForm handleSubmit={handleSubmit} isPending={isPending} errorMessage={errorMessage} />
        </div>
    )
}

export default LoginPage
