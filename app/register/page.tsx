"use client"

import type React from "react"

import { useEffect } from "react"
import { useTheme } from "@/contexts/theme-context"
import { mutation } from "@/api/mutate"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { ROUTES } from "@/utils/constants/routes"
import { Languages, Moon, Sun } from "lucide-react"
import AuthForm from "@/components/form/auth"
import toast from "react-hot-toast"
import { SUCCESS_MESSAGE } from "@/utils/constants/message"
import { useLanguage } from "@/contexts/language-context"

function RegisterPage() {
    const router = useRouter()
    const { isAuth } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const { language, setLanguage, languages, t } = useLanguage()

    const { mutateAsync: register, isPending, error } = mutation.user.register()

    useEffect(() => {
        if (isAuth) {
            router.push(ROUTES.HOME)
        }
    }, [isAuth, router])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            const form = new FormData(e.currentTarget)
            const formData = Object.fromEntries(form.entries()) as Record<string, string>
            await register({
                username: formData.email,
                password: formData.password,
            })

            if (error) {
                console.error(error)
                return
            }
            toast.success(SUCCESS_MESSAGE.REGISTER)
            router.push(ROUTES.LOGIN)
        } catch (error) {
            console.error(error)
        }
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

            <AuthForm handleSubmit={handleSubmit} isPending={isPending} />
        </div>
    )
}

export default RegisterPage
