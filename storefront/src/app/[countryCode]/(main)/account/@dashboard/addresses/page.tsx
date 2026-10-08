import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"
import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Addresses | TamZen Atelier",
  description: "View and manage your shipping destinations.",
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer().catch(() => null)
  const region = await getRegion(countryCode).catch(() => null)

  if (!customer || !region) {
    return null
  }

  return (
    <div className="w-full font-sans" data-testid="addresses-page-wrapper">
      <div className="mb-6 pb-6 border-b border-white/10 flex flex-col gap-y-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-px bg-[#E5C378]/60" />
          <span className="text-[10px] uppercase tracking-widest font-mono text-[#E5C378]">
            Delivery Destinations
          </span>
        </div>
        <h1 className="font-display font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Saved Addresses
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
          Manage your saved shipping addresses for expedited checkout and worldwide insured delivery.
        </p>
      </div>

      <AddressBook customer={customer} region={region} />
    </div>
  )
}
