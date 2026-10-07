import { cookies } from "next/headers"
import Sidebar from "@/components/Sidebar"
import MobileTabBar from "@/components/MobileTabBar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const email = cookieStore.get("tamzen_admin_email")?.value || "admin@tamzen.shop"

  return (
    <div className="flex min-h-screen bg-[#0A0A0C] text-[#F5F0E8]">
      <Sidebar adminEmail={email} />
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <main className="flex-1">{children}</main>
      </div>
      <MobileTabBar />
    </div>
  )
}
