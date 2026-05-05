"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { dictionaries, languages, Language } from "@/i18n"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
  languages: { code: Language; label: string }[]
}

const STORAGE_KEY = "owwimoney.language"

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("vi")

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null
    if (stored && dictionaries[stored]) {
      setLanguageState(stored)
      document.documentElement.lang = stored
      return
    }
    document.documentElement.lang = "vi"
  }, [])

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage)
    window.localStorage.setItem(STORAGE_KEY, nextLanguage)
    document.documentElement.lang = nextLanguage
  }

  const value = useMemo<LanguageContextType>(() => ({
    language,
    setLanguage,
    t: (key: string, params?: Record<string, string | number>) => {
      const template = dictionaries[language]?.[key] || dictionaries.en[key] || key
      if (!params) return template
      return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
        return acc.replaceAll(`{${paramKey}}`, String(paramValue))
      }, template)
    },
    languages: [...languages],
  }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }

  return context
}
