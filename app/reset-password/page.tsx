"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AxiosError } from "axios"
import toast from "react-hot-toast"
import { KeyRound } from "lucide-react"
import { mutation } from "@/api/mutate"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"

export default function ResetPasswordPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const { mutateAsync, isPending } = mutation.user.resetPassword()
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")

    const form = new FormData(event.currentTarget)
    const password = String(form.get("password") || "")
    const confirmPassword = String(form.get("confirmPassword") || "")

    if (password !== confirmPassword) {
      setErrorMessage(t('auth.passwordsDoNotMatch'))
      return
    }

    try {
      const response = await mutateAsync({ token, password })
      toast.success(response.message)
      router.push("/login")
    } catch (error) {
      const message = error instanceof AxiosError ? error.response?.data?.message : t('auth.unableResetPassword')
      setErrorMessage(message || t('auth.unableResetPassword'))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('auth.resetPasswordTitle')}</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('auth.resetPasswordDescription')}</p>

        {!token ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-red-600 dark:text-red-400">{t('auth.resetTokenMissing')}</p>
            <Link href="/forgot-password" className="font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400">{t('auth.requestNewLink')}</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.newPassword')}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><KeyRound /></span>
                <Input name="password" type="password" required minLength={6} autoComplete="new-password" className="h-12 pl-12" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.confirmPassword')}</label>
              <Input name="confirmPassword" type="password" required minLength={6} autoComplete="new-password" className="h-12" />
            </div>

            {errorMessage && <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>}

            <Button type="submit" disabled={isPending} className="h-12 w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white">
              {isPending ? t('auth.resettingPassword') : t('auth.resetPasswordButton')}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
