"use client"

import { Sidebar } from "@/components/sidebar"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import ClientWrapper from "./client-wrapper"

export default function RootShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  if (pathname === "/") {
    return <main className="min-h-screen w-full">{children}</main>
  }

  return (
    <ClientWrapper>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <main className="w-full min-w-0 flex-1 overflow-auto pb-20 lg:ml-0 lg:pb-0">
          {children}
        </main>
      </div>
    </ClientWrapper>
  )
}
