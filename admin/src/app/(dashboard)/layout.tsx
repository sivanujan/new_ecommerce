import { cookies } from "next/headers"
import Sidebar from "@/components/Sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const email = cookieStore.get("tamzen_admin_email")?.value || "admin@tamzen.shop"

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar adminEmail={email} />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
