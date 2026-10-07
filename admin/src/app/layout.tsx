import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TamZen Admin | Store Management",
  description: "Simple, easy store management for TamZen Boutique",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-amber-100 selection:text-amber-900">
        {children}
      </body>
    </html>
  )
}
