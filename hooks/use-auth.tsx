'use client'
import { query } from '@/api/query'
import { ACTIVE_PROFILE_ID, SESSION_ID } from '@/utils/constants/keys'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false)
  const pathname = usePathname()
  const { data: res, isFetching } = useQuery(query.user.whoami())

  useEffect(() => {
    const sessionToken = localStorage.getItem(SESSION_ID)
    const activeProfileId = localStorage.getItem(ACTIVE_PROFILE_ID)

    if (isFetching && !res) {
      setIsAuth(Boolean(sessionToken && activeProfileId))
      return
    }

    if (!res?.isLoggedIn) {
      localStorage.removeItem(ACTIVE_PROFILE_ID)
      setIsAuth(false)
      return
    }

    if (res.activeProfile?._id) {
      localStorage.setItem(ACTIVE_PROFILE_ID, res.activeProfile._id)
      setIsAuth(true)
      return
    }

    localStorage.removeItem(ACTIVE_PROFILE_ID)
    setIsAuth(false)
  }, [res, isFetching, pathname])

  return {
    isAuth,
    authState: res,
    isFetchingAuth: isFetching,
  }
}
