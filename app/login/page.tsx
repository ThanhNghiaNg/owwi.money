"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { useTheme } from "@/contexts/theme-context"
import { mutation } from "@/api/mutate"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { ROUTES } from "@/utils/constants/routes"
import { ACTIVE_PROFILE_ID, SESSION_ID } from "@/utils/constants/keys"
import { Moon, Sun } from "lucide-react"
import AuthForm from "@/components/form/auth"
import toast from "react-hot-toast"
import { ERROR_MESSAGE } from "@/utils/constants/message"
import { AxiosError } from "axios"
import { ProfileResponse } from "@/api/user"

function LoginPage() {
    const router = useRouter()
    const { isAuth, authState, isFetchingAuth } = useAuth()
    const { theme, toggleTheme } = useTheme()

    const { mutateAsync: login, isPending: isLoggingIn } = mutation.user.login()
    const { mutateAsync: selectProfile, isPending: isSelectingProfile } = mutation.user.selectProfile()
    const [errorMessage, setErrorMessage] = useState<string>()
    const [selectedProfileId, setSelectedProfileId] = useState<string>("")
    const [availableProfiles, setAvailableProfiles] = useState<ProfileResponse[]>([])
    const isPending = isLoggingIn || isSelectingProfile

    useEffect(() => {
        if (!isFetchingAuth && isAuth) {
            router.replace(ROUTES.DASHBOARD)
        }
    }, [isAuth, isFetchingAuth, router])

    useEffect(() => {
        if (!isFetchingAuth && authState?.isLoggedIn && !authState?.activeProfile?._id) {
            setAvailableProfiles(authState.profiles || [])
            setSelectedProfileId((current) => current || authState.profiles?.[0]?._id || "")
        }
    }, [authState, isFetchingAuth])

    const canSelectProfile = useMemo(() => availableProfiles.length > 0, [availableProfiles])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            setErrorMessage("")
            e.preventDefault()
            const form = new FormData(e.currentTarget)
            const formData = Object.fromEntries(form.entries()) as Record<string, string>

            if (canSelectProfile) {
                if (!selectedProfileId) {
                    setErrorMessage("Vui lòng chọn profile để tiếp tục.")
                    return
                }

                const selected = await selectProfile(selectedProfileId)
                localStorage.setItem(ACTIVE_PROFILE_ID, selected.activeProfile._id)
                router.replace(ROUTES.DASHBOARD)
                return
            }

            const res = await login({
                username: formData.email,
                password: formData.password,
            })

            if (res.sessionToken) {
                localStorage.setItem(SESSION_ID, res.sessionToken)
            }

            if (res.activeProfile?._id) {
                localStorage.setItem(ACTIVE_PROFILE_ID, res.activeProfile._id)
                router.replace(ROUTES.DASHBOARD)
                return
            }

            if (res.profiles?.length) {
                localStorage.removeItem(ACTIVE_PROFILE_ID)
                setAvailableProfiles(res.profiles)
                setSelectedProfileId(res.profiles[0]?._id || "")
                setErrorMessage("Tài khoản này có nhiều profile. Hãy chọn profile rồi bấm Sign In lần nữa.")
                return
            }

            setErrorMessage("Không tìm thấy profile cho tài khoản này.")
        } catch (error) {
            if (error instanceof AxiosError) {
                setErrorMessage(error.response?.data?.message)
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

            <AuthForm
                handleSubmit={handleSubmit}
                isPending={isPending}
                errorMessage={errorMessage}
                profiles={availableProfiles}
                selectedProfileId={selectedProfileId}
                onSelectProfile={setSelectedProfileId}
            />
        </div>
    )
}

export default LoginPage
