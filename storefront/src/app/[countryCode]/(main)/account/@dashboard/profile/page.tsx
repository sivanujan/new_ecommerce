import { Metadata } from "next"

import ProfilePhone from "@modules/account/components/profile-phone"
import ProfileBillingAddress from "@modules/account/components/profile-billing-address"
import ProfileEmail from "@modules/account/components/profile-email"
import ProfileName from "@modules/account/components/profile-name"

import { notFound } from "next/navigation"
import { listRegions } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Profile | TamZen Atelier",
  description: "View and edit your TamZen profile information.",
}

export default async function Profile() {
  const customer = await retrieveCustomer().catch(() => null)
  const regions = await listRegions().catch(() => null)

  if (!customer || !regions) {
    return null
  }

  return (
    <div className="w-full font-sans" data-testid="profile-page-wrapper">
      <div className="mb-6 pb-6 border-b border-white/10 flex flex-col gap-y-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-px bg-[#E5C378]/60" />
          <span className="text-[10px] uppercase tracking-widest font-mono text-[#E5C378]">
            Client Credentials
          </span>
        </div>
        <h1 className="font-display font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Personal Profile
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
          Manage your personal details, email credentials, phone contact, and default billing address.
        </p>
      </div>

      <div className="flex flex-col gap-y-4 w-full">
        <ProfileName customer={customer} />
        <ProfileEmail customer={customer} />
        <ProfilePhone customer={customer} />
        <ProfileBillingAddress customer={customer} regions={regions} />
      </div>
    </div>
  )
}
