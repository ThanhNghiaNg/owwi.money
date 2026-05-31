"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo, useState } from "react"
import { useTheme } from "@/contexts/theme-context"
import { useProfile } from "@/contexts/profile-context"
import { useLanguage } from "@/contexts/language-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookUser, ChartNoAxesCombined, Languages, LogOut, Menu, Moon, NotebookPen, Scale, Settings, Sun, Tag, UserCircle2, Wand2 } from "lucide-react"
import { mutation } from "@/api/mutate"
import { SESSION_ID } from "@/utils/constants/keys"
import { useQuery } from "@tanstack/react-query"
import { query } from "@/api/query"
import { ROUTES } from "@/utils/constants/routes"
import InstallPWAButton from "./ui/install-pwa-button"

const PROFILE_COLORS = [
  "#0EA5E9",
  "#8B5CF6",
  "#F97316",
  "#10B981",
  "#EC4899",
  "#EAB308",
  "#6366F1",
  "#14B8A6",
]

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "P"
}

function getStableColor(name: string) {
  const normalized = name.trim().toLowerCase()
  const hash = normalized.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return PROFILE_COLORS[hash % PROFILE_COLORS.length]
}

export function Sidebar() {
  const pathname = usePathname()
  const isMarketingPage = pathname === "/"
  const { theme, toggleTheme } = useTheme()
  const { activeProfile, activeProfileId } = useProfile()
  const { t, language, setLanguage, languages } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isAuth = !!activeProfileId
  const { mutateAsync: logout } = mutation.user.logout(
    () => {
      window.location.href = '/login'
      localStorage.removeItem(SESSION_ID)
    },
    () => {
      window.location.href = '/login'
      console.error("Logout failed")
    })

  const navigation = [
    { name: t("nav.dashboard"), href: "/dashboard", icon: <ChartNoAxesCombined /> },
    { name: t("nav.transactions"), href: "/transactions", icon: <NotebookPen /> },
    { name: t("nav.quickSetup"), href: "/quick-setup", icon: <Wand2 /> },
    { name: t("nav.partners"), href: "/partners", icon: <BookUser /> },
    { name: t("nav.categories"), href: "/categories", icon: <Tag /> },
    { name: t("nav.sixJars"), href: "/six-jars", icon: <Scale /> },
    { name: t("nav.settings"), href: ROUTES.SETTINGS, icon: <Settings /> },
  ]

  const mobileNavigation = [
    { name: t("nav.dashboard"), href: "/dashboard", icon: <ChartNoAxesCombined /> },
    { name: t("nav.transactions"), href: "/transactions", icon: <NotebookPen /> },
    { name: t("nav.more"), href: "#", icon: <Menu /> },
  ]

  const profileFallbackColor = useMemo(() => {
    if (!activeProfile?.name) return PROFILE_COLORS[0]
    return activeProfile.color || getStableColor(activeProfile.name)
  }, [activeProfile])

  if (isMarketingPage) {
    return null
  }

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <nav className="flex-1 px-6 py-1">
          <ul className="flex justify-between">
            {mobileNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name} >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(item.name === t("nav.more"))}
                    className={`flex flex-col items-center justify-stretch gap-1 rounded-lg w-[100px] p-2 text-sm font-medium transition-colors ${isActive
                      ? "bg-sky-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="truncate text-sm">{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 
        transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        flex h-screen flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-hidden
      `}
      >
        <div className="flex items-center gap-3 px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200 dark:border-gray-700">
          <span className="text-lg sm:text-xl font-bold text-sky-600 dark:text-sky-400">Owwi Money</span>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 sm:px-4 py-4">
          <ul className="space-y-1 sm:space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                      ? "bg-sky-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>

          {isAuth && (
            <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {t("nav.activeProfile")}
              </p>
              <Link
                href={ROUTES.PROFILES_SELECT}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl border px-3 py-3 transition-colors ${pathname === ROUTES.PROFILES_SELECT
                  ? "border-sky-500 bg-sky-50 dark:border-sky-400 dark:bg-sky-950/40"
                  : "border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                  }`}
              >
                {activeProfile ? (
                  <Avatar className="h-10 w-10 border border-white/60 shadow-sm">
                    {activeProfile.avatarUrl ? <AvatarImage src={activeProfile.avatarUrl} alt={activeProfile.name} /> : null}
                    <AvatarFallback
                      className="text-sm font-semibold text-white"
                      style={{ backgroundColor: profileFallbackColor }}
                    >
                      {getInitials(activeProfile.name)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                    <UserCircle2 className="h-5 w-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {activeProfile?.name || t("nav.chooseProfile")}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("nav.switchProfile")}
                  </p>
                </div>
              </Link>
            </div>
          )}
        </nav>

        <div className="shrink-0 px-3 sm:px-4 py-2 space-y-2">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Languages className="h-4 w-4" />
              <span>{t("common.language")}</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as typeof language)}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code}>{item.label}</option>
              ))}
            </select>
          </div>

          <InstallPWAButton />
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-start gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <span className="text-lg">{theme === "light" ? <Moon /> : <Sun />}</span>
            <span className="truncate">{theme === "light" ? t("nav.darkMode") : t("nav.lightMode")}</span>
          </button>
        </div>

        {isAuth && <div className="shrink-0 px-3 sm:px-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            className="w-full flex items-center justify-start gap-3 px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
            onClick={() => logout()}
          >
            <span className="text-lg"><LogOut /></span>
            <span className="truncate">{t("nav.logout")}</span>
          </button>
        </div>}
      </div>
    </>
  )
}
