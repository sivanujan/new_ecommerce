import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Cinzel, Montserrat } from "next/font/google"
import "styles/globals.css"

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "TamZen | More Than Jewellery",
    template: "%s | TamZen",
  },
  description:
    "TamZen — More Than Jewellery. Wear your roots with bespoke cultural pendants and jewelry inspired by Tamil-Eelam identity.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo-icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/logo-icon.svg",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${montserrat.variable} dark`}
      data-mode="dark"
    >
      <body className="bg-bg-base text-neutral-100 antialiased selection:bg-white/20 selection:text-white">
        <main className="relative min-h-screen">{props.children}</main>
      </body>
    </html>
  )
}
