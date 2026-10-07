import { Metadata } from "next"
import Sidebar from "@/components/admin/Sidebar"
import MobileTabBar from "@/components/admin/MobileTabBar"
import { ToastProvider } from "@/components/admin/ToastProvider"

export const metadata: Metadata = {
  title: "Admin Atelier | TamZen",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[#0A0A0C] text-[#F5F0E8] font-sans antialiased selection:bg-[#D4AF37]/30 selection:text-[#F5F0E8]">
        {/* Left Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
          <main className="flex-1">{children}</main>
        </div>

        {/* Mobile Bottom Tab Bar */}
        <MobileTabBar />
      </div>
    </ToastProvider>
  )
}
