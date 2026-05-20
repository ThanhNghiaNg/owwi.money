"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: { client_id: string; callback: (response: { credential: string }) => void }) => void
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void
          prompt: () => void
        }
      }
    }
  }
}

type GoogleSignInButtonProps = {
  onCredential: (credential: string) => void
  disabled?: boolean
  label?: string
}

export default function GoogleSignInButton({ onCredential, disabled, label }: GoogleSignInButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!clientId || !ref.current) return

    const render = () => {
      if (!window.google || !ref.current) return
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => onCredential(response.credential),
      })
      window.google.accounts.id.renderButton(ref.current, {
        theme: "outline",
        size: "large",
        width: ref.current.offsetWidth || 320,
        text: "continue_with",
      })
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]')
    if (existingScript) {
      render()
      return
    }

    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = render
    document.head.appendChild(script)
  }, [clientId, onCredential])

  if (!clientId) {
    return (
      <Button type="button" disabled className="h-12 w-full border border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-800">
        {t("auth.googleNotConfigured")}
      </Button>
    )
  }

  return (
    <div className={disabled ? "pointer-events-none opacity-60" : ""} aria-label={label || t("auth.continueWithGoogle")}>
      <div ref={ref} className="flex w-full justify-center" />
    </div>
  )
}
