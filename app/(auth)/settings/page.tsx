"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import toast from "react-hot-toast"
import { Link2 } from "lucide-react"
import { mutation } from "@/api/mutate"
import { query } from "@/api/query"
import GoogleSignInButton from "@/components/auth/google-sign-in-button"
import { useLanguage } from "@/contexts/language-context"

export default function SettingsPage() {
  const { t } = useLanguage()
  const { data } = useQuery(query.user.whoami())
  const { mutateAsync: linkGoogle, isPending } = mutation.user.linkGoogle()
  const [errorMessage, setErrorMessage] = useState("")

  const handleCredential = async (credential: string) => {
    try {
      setErrorMessage("")
      const res = await linkGoogle({ credential })
      toast.success(res.message)
    } catch (error) {
      const message = error instanceof AxiosError ? error.response?.data?.message : t("settings.googleLinkFailed")
      setErrorMessage(message || t("settings.googleLinkFailed"))
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("settings.title")}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("settings.description")}</p>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
            <Link2 className="h-5 w-5" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("settings.googleTitle")}</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("settings.googleDescription")}</p>
            </div>

            {data?.user?.googleLinked ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300">
                {t("settings.googleLinked")} {data.user.googleEmail ? `(${data.user.googleEmail})` : ""}
              </div>
            ) : (
              <div className="max-w-sm">
                <GoogleSignInButton onCredential={handleCredential} disabled={isPending} label={t("settings.linkGoogle")} />
              </div>
            )}

            {errorMessage && <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>}
          </div>
        </div>
      </section>
    </div>
  )
}
