import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./animation.css"
import { ThemeProvider } from "@/contexts/theme-context"
import { Toaster } from "react-hot-toast"
import RootShell from "@/components/client/root-shell"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Owwi Money",
  description: "Quản lý tài chính cá nhân rõ ràng, nhẹ nhàng cùng hệ sinh thái Owwi.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/icons/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={inter.className}>
        <Toaster position="top-right" />
        <ThemeProvider>
          <RootShell>{children}</RootShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
