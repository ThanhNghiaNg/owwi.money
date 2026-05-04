'use client'
import { query } from '@/api/query'
import { ACTIVE_PROFILE_ID, SESSION_ID } from '@/utils/constants/keys'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false)
  const pathname = usePathname()
  const { data: res } = useQuery(query.user.whoami())

  useEffect(() => {
    const sessionToken = localStorage.getItem(SESSION_ID)
    const activeProfileId = localStorage.getItem(ACTIVE_PROFILE_ID)
    const isLoggedIn = res?.isLoggedIn ?? !!sessionToken
    const hasProfile = Boolean(res?.activeProfile?._id || activeProfileId)
    setIsAuth(isLoggedIn && hasProfile)
  }, [res, pathname])

  return {
    isAuth,
    authState: res,
  }
}
