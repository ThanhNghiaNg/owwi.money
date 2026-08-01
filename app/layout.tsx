import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./animation.css"
import { Sidebar } from "@/components/sidebar"
import { ThemeProvider } from "@/contexts/theme-context"
import { Toaster } from "react-hot-toast"
import ClientWrapper from "@/components/client/client-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Owwi — Những công cụ nhỏ cho cuộc sống nhẹ hơn",
  description:
    "Khám phá Owwi Money và hệ sinh thái công cụ Owwi: quản lý tài chính, nén PDF và theo dõi hoạt động hằng ngày.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/icons/favicon.ico",
  },
  openGraph: {
    title: "Owwi — Những công cụ nhỏ cho cuộc sống nhẹ hơn",
    description: "Owwi Money cùng hệ sinh thái công cụ nhỏ gọn cho tiền bạc, tài liệu và nhịp sống mỗi ngày.",
    type: "website",
    locale: "vi_VN",
    url: "https://owwi.io.vn/",
    images: [
      {
        url: "https://owwi.io.vn/og.png",
        width: 1733,
        height: 907,
        alt: "Owwi — Những công cụ nhỏ cho cuộc sống nhẹ hơn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Owwi — Những công cụ nhỏ cho cuộc sống nhẹ hơn",
    description: "Owwi Money cùng hệ sinh thái công cụ nhỏ gọn cho cuộc sống mỗi ngày.",
    images: ["https://owwi.io.vn/og.png"],
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
          <ClientWrapper>
            <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
              <Sidebar />
              <main className="flex-1 overflow-auto lg:ml-0 w-full min-w-0 pb-20 lg:pb-0">{children}</main>
            </div>
          </ClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
