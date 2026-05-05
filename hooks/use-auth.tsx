'use client'
import { query } from '@/api/query'
import { SESSION_ID } from '@/utils/constants/keys'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false)
  const pathname = usePathname()
  const { data: res } = useQuery(query.user.whoami())

  useEffect(() => {
    const sessionToken = localStorage.getItem(SESSION_ID)
    setIsAuth(res?.isLoggedIn ?? !!sessionToken)
  }, [res, pathname])

  return {
    isAuth,
    needsProfileSelection: !!res?.isLoggedIn && !!res?.needsProfileSelection,
    activeProfileId: res?.activeProfileId || null,
  }
}
