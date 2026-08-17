"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useTheme } from "@/contexts/theme-context"
import { mutation } from "@/api/mutate"
import { keys as queryKeys } from "@/api/query"
import queryClient from "@/api/queryClient"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { ROUTES } from "@/utils/constants/routes"
import { SESSION_ID } from "@/utils/constants/keys"
import { Languages, Moon, Sun } from "lucide-react"
import AuthForm from "@/components/form/auth"
import GoogleSignInButton from "@/components/auth/google-sign-in-button"
import toast from "react-hot-toast"
import { ERROR_MESSAGE } from "@/utils/constants/message"
import { AxiosError } from "axios"
import { useLanguage } from "@/contexts/language-context"
import { DotLoader } from "@/components/ui/skeleton/dot-loader"

function LoginPage() {
    const router = useRouter()
    const { isAuth, isCheckingAuth, needsProfileSelection, activeProfileId } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const { language, setLanguage, languages, t } = useLanguage()

    const { mutateAsync: login, isPending } = mutation.user.login()
    const { mutateAsync: loginGoogle, isPending: isGooglePending } = mutation.user.googleLogin()
    const [errorMessage, setErrorMessage] = useState<string>();

    useEffect(() => {
        if (isCheckingAuth || !isAuth) return

        if (needsProfileSelection || !activeProfileId) {
            router.replace(ROUTES.PROFILES_SELECT)
            return
        }

        router.replace(ROUTES.DASHBOARD)
    }, [isAuth, isCheckingAuth, needsProfileSelection, activeProfileId, router])

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
                await queryClient.invalidateQueries({ queryKey: queryKeys.userWhoami() })
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                setErrorMessage(error.response?.data?.message);
            }
            toast.error(t(ERROR_MESSAGE.SYSTEM_ERROR))
            console.error(error)
        }
    }

    const handleGoogleCredential = async (credential: string) => {
        try {
            setErrorMessage("")
            const res = await loginGoogle({ credential })
            if (res.sessionToken) {
                localStorage.setItem(SESSION_ID, res.sessionToken)
                await queryClient.invalidateQueries({ queryKey: queryKeys.userWhoami() })
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                setErrorMessage(error.response?.data?.message)
            }
            toast.error(t(ERROR_MESSAGE.SYSTEM_ERROR))
            console.error(error)
        }
    }

    if (isCheckingAuth || isAuth) {
        return (
            <div className="relative min-h-screen w-full" role="status" aria-busy="true">
                <DotLoader />
                <span className="sr-only">Đang tải...</span>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="fixed top-4 left-4 z-10 rounded-xl border border-gray-200 bg-white/90 px-3 py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800/90">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Languages className="h-4 w-4" />
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as typeof language)}
                        className="bg-transparent text-sm outline-none"
                        aria-label={t("common.language")}
                    >
                        {languages.map((item) => (
                            <option key={item.code} value={item.code}>{item.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <button
                onClick={toggleTheme}
                className="fixed top-4 right-4 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-10"
            >
                <span className="text-xl">{theme === "light" ? <Moon /> : <Sun />}</span>
            </button>

            <AuthForm handleSubmit={handleSubmit} isPending={isPending} errorMessage={errorMessage} googleButton={<GoogleSignInButton onCredential={handleGoogleCredential} disabled={isGooglePending} />} />
        </div>
    )
}

export default LoginPage
