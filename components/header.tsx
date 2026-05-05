"use client"

import { mutation } from "@/api/mutate";
import { useLanguage } from "@/contexts/language-context";
import { useProfile } from "@/contexts/profile-context";
import { SESSION_ID } from "@/utils/constants/keys";
import { Building2, CircleUser, House, Layers3 } from "lucide-react";
import { useState } from "react"

interface HeaderProps {
  title: string
  breadcrumbs?: { name: string; href?: string }[]
}

export function Header({ title, breadcrumbs = [] }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { activeProfile, viewScope, setViewScope } = useProfile()
  const { t } = useLanguage()
  const { mutateAsync: logout } = mutation.user.logout(
    () => {
      setIsUserMenuOpen(false)
      window.location.href = "/login"
      localStorage.removeItem(SESSION_ID)
    },
    () => {
      setIsUserMenuOpen(false)
      window.location.href = "/login"
      console.error("Logout failed")
    })

  return (
    <div className="flex flex-col gap-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 ml-0 lg:ml-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 min-w-0">
          <span className="text-lg"><House /></span>
          <span className="hidden sm:inline">{t("header.home")}</span>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2 min-w-0">
              <span className="hidden sm:inline">{">"}</span>
              <span
                className={`truncate ${index === breadcrumbs.length - 1 ? "text-sky-600 dark:text-sky-400 font-medium" : ""}`}
              >
                {crumb.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Layers3 className="h-3.5 w-3.5" />
            <span>
              {t("header.currentProfile")}: <span className="font-medium text-gray-700 dark:text-gray-200">{activeProfile?.name || t("header.notSelected")}</span>
            </span>
          </div>
        </div>

        <div className="inline-flex w-full rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800 md:w-auto">
          <button
            type="button"
            onClick={() => setViewScope("profile")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors md:flex-none ${viewScope === "profile"
              ? "bg-white text-sky-600 shadow-sm dark:bg-gray-900 dark:text-sky-400"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
          >
            <CircleUser className="h-4 w-4" />
            <span>{t("header.thisProfile")}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewScope("account")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors md:flex-none ${viewScope === "account"
              ? "bg-white text-sky-600 shadow-sm dark:bg-gray-900 dark:text-sky-400"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
          >
            <Building2 className="h-4 w-4" />
            <span>{t("header.allProfiles")}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
