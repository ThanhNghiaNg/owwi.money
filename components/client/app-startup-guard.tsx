"use client"

import { DotLoader } from "@/components/ui/skeleton/dot-loader"
import { useAuth } from "@/hooks/use-auth"
import { ROUTES } from "@/utils/constants/routes"
import { usePathname, useRouter } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"
import { isAxiosError } from "axios"

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean
}

function FullPageLoader() {
  return (
    <div className="relative min-h-screen w-full" role="status" aria-busy="true">
      <DotLoader />
      <span className="sr-only">Đang tải...</span>
    </div>
  )
}

export function AppStartupGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isStandalone, setIsStandalone] = useState<boolean | null>(null)
  const { authError, isAuth, isCheckingAuth, needsProfileSelection, activeProfileId } = useAuth()

  useEffect(() => {
    const displayModeStandalone = window.matchMedia("(display-mode: standalone)").matches
    const iosStandalone = (window.navigator as NavigatorWithStandalone).standalone === true

    setIsStandalone(displayModeStandalone || iosStandalone)
  }, [])

  const isLoginRoute = pathname === ROUTES.LOGIN
  const isStandaloneHome = pathname === ROUTES.HOME && isStandalone === true
  const shouldRedirectAuthenticatedUser = isLoginRoute || isStandaloneHome

  useEffect(() => {
    if (!shouldRedirectAuthenticatedUser || isCheckingAuth || !isAuth) return

    const destination = needsProfileSelection || !activeProfileId
      ? ROUTES.PROFILES_SELECT
      : ROUTES.DASHBOARD

    router.replace(destination)
  }, [
    activeProfileId,
    isAuth,
    isCheckingAuth,
    needsProfileSelection,
    router,
    shouldRedirectAuthenticatedUser,
  ])

  const isCheckingDisplayMode = pathname === ROUTES.HOME && isStandalone === null
  const isCheckingSession = shouldRedirectAuthenticatedUser && isCheckingAuth
  const isRedirecting = shouldRedirectAuthenticatedUser && !isCheckingAuth && isAuth
  const isRedirectingAfterUnauthorized = isStandaloneHome
    && isAxiosError(authError)
    && authError.response?.status === 401

  if (isCheckingDisplayMode || isCheckingSession || isRedirecting || isRedirectingAfterUnauthorized) {
    return <FullPageLoader />
  }

  return <>{children}</>
}
