'use client'
import { query } from '@/api/query'
import { useQuery } from '@tanstack/react-query'

export const useAuth = () => {
  const { data: res, error, isPending, isFetching } = useQuery(query.user.whoami())

  return {
    isAuth: res?.isLoggedIn === true,
    authError: error,
    isCheckingAuth: isPending || isFetching,
    needsProfileSelection: !!res?.isLoggedIn && !!res?.needsProfileSelection,
    activeProfileId: res?.activeProfileId || null,
  }
}
