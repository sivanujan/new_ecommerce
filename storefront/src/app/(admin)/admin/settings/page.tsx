import Navbar from "@/components/admin/Navbar"
import SettingsClient from "@/components/admin/SettingsClient"
import { getStore, getCurrentUser } from "@/lib/admin/medusa"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const [store, user] = await Promise.all([
    getStore(),
    getCurrentUser(),
  ])

  return (
    <div>
      <Navbar
        title="Boutique Settings"
        subtitle="Configure store identity, support channels, and admin security credentials"
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        <SettingsClient store={store} user={user} />
      </div>
    </div>
  )
}
