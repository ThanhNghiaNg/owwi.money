"use client"

import { mutation } from "@/api/mutate";
import { query } from "@/api/query";
import { ACTIVE_PROFILE_ID, SESSION_ID } from "@/utils/constants/keys";
import { CircleUser, House } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react"
import toast from "react-hot-toast";

interface HeaderProps {
  title: string
  breadcrumbs?: { name: string; href?: string }[]
}

export function Header({ title, breadcrumbs = [] }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { data: whoami } = useQuery(query.user.whoami())
  const { mutateAsync: logout } = mutation.user.logout(
    () => {
      setIsUserMenuOpen(false)
      localStorage.removeItem(SESSION_ID)
      localStorage.removeItem(ACTIVE_PROFILE_ID)
      window.location.href = "/login"
    },
    () => {
      setIsUserMenuOpen(false)
      localStorage.removeItem(SESSION_ID)
      localStorage.removeItem(ACTIVE_PROFILE_ID)
      window.location.href = "/login"
      console.error("Logout failed")
    })
  const { mutateAsync: selectProfile, isPending: isSwitchingProfile } = mutation.user.selectProfile()

  const handleChangeProfile = async (profileId: string) => {
    try {
      const res = await selectProfile(profileId)
      localStorage.setItem(ACTIVE_PROFILE_ID, res.activeProfile._id)
      toast.success(`Đã chuyển sang profile ${res.activeProfile.name}`)
    } catch (error) {
      toast.error("Không thể đổi profile")
      console.error(error)
    }
  }

  return (
    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 ml-0 lg:ml-0 gap-4 flex-wrap">
      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 min-w-0">
        <span className="text-lg"><House /></span>
        <span className="hidden sm:inline">Home</span>
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

      <div className="flex items-center gap-3 ml-auto">
        {whoami?.profiles?.length ? (
          <select
            value={whoami.activeProfile?._id || ""}
            onChange={(e) => handleChangeProfile(e.target.value)}
            disabled={isSwitchingProfile}
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            {whoami.profiles.map((profile) => (
              <option key={profile._id} value={profile._id}>
                {profile.name}
              </option>
            ))}
          </select>
        ) : null}

        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
            <span className="text-sm"><CircleUser /></span>
          </div>
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-xs text-gray-500 dark:text-gray-400">{title}</span>
            <span className="text-xs sm:text-sm truncate text-gray-900 dark:text-white">
              {whoami?.activeProfile?.name || whoami?.user?.fullName || "Account"}
            </span>
          </div>
        </button>

        {isUserMenuOpen && (
          <div className="absolute right-6 top-16 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
            <div className="py-1">
              <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100 dark:border-gray-700">
                {whoami?.user?.fullName || whoami?.user?.username}
              </div>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => logout()}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
