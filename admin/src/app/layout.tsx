import "./globals.css"
import type { Metadata } from "next"
import { ToastProvider } from "@/components/ToastProvider"

export const metadata: Metadata = {
  title: "TamZen Boutique | Custom Admin",
  description: "Boutique store management for TamZen jewelry",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0A0A0C] text-[#F5F0E8] antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
