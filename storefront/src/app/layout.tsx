import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

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
    <html lang="en" className="dark font-sans" data-mode="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg-base text-neutral-100 antialiased selection:bg-white/20 selection:text-white">
        <main className="relative min-h-screen">{props.children}</main>
      </body>
    </html>
  )
}
