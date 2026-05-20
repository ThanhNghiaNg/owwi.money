"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { AxiosError } from "axios"
import toast from "react-hot-toast"
import { Mail } from "lucide-react"
import { mutation } from "@/api/mutate"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"

export default function ForgotPasswordPage() {
  const { t } = useLanguage()
  const { mutateAsync, isPending } = mutation.user.forgotPassword()
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage("")
    setErrorMessage("")

    try {
      const form = new FormData(event.currentTarget)
      const email = String(form.get("email") || "")
      const response = await mutateAsync({ email })
      setMessage(response.message)
      toast.success(response.message)
    } catch (error) {
      const message = error instanceof AxiosError ? error.response?.data?.message : t('auth.unableSendReset')
      setErrorMessage(message || t('auth.unableSendReset'))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('auth.forgotPasswordTitle')}</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('auth.forgotPasswordDescription')}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.emailAddress')}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Mail /></span>
              <Input name="email" type="email" required autoComplete="email" className="h-12 pl-12" placeholder={t('auth.enterEmail')} />
            </div>
          </div>

          {message && <p className="text-sm text-green-600 dark:text-green-400">{message}</p>}
          {errorMessage && <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>}

          <Button type="submit" disabled={isPending} className="h-12 w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white">
            {isPending ? t('auth.sendingResetLink') : t('auth.sendResetLink')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <Link href="/login" className="font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400">{t('auth.backToSignIn')}</Link>
        </p>
      </div>
    </div>
  )
}
