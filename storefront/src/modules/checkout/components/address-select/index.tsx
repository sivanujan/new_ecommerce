import { Listbox, Transition } from "@headlessui/react"
import { ChevronUpDown } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { Fragment, useMemo } from "react"

import Radio from "@modules/common/components/radio"
import compareAddresses from "@lib/util/compare-addresses"
import { HttpTypes } from "@medusajs/types"

type AddressSelectProps = {
  addresses: HttpTypes.StoreCustomerAddress[]
  addressInput: HttpTypes.StoreCartAddress | null
  onSelect: (
    address: HttpTypes.StoreCartAddress | undefined,
    email?: string
  ) => void
}

const AddressSelect = ({
  addresses,
  addressInput,
  onSelect,
}: AddressSelectProps) => {
  const handleSelect = (id: string) => {
    const savedAddress = addresses.find((a) => a.id === id)
    if (savedAddress) {
      onSelect(savedAddress as HttpTypes.StoreCartAddress)
    }
  }

  const selectedAddress = useMemo(() => {
    return addresses.find((a) => compareAddresses(a, addressInput))
  }, [addresses, addressInput])

  return (
    <Listbox onChange={handleSelect} value={selectedAddress?.id}>
      <div className="relative">
        <Listbox.Button
          className="relative w-full flex justify-between items-center px-4 py-3 text-left bg-[#121215] cursor-pointer focus:outline-none border border-white/15 rounded-xl hover:border-white/30 focus-visible:border-[#E5C378] focus-visible:ring-1 focus-visible:ring-[#E5C378]/50 text-sm transition-all duration-150 shadow-sm"
          data-testid="shipping-address-select"
        >
          {({ open }) => (
            <>
              <div className="flex flex-col truncate pr-3">
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                  {selectedAddress ? "Selected Address" : "Saved Addresses"}
                </span>
                <span className="text-sm font-medium text-[#FDFBF7] truncate mt-0.5">
                  {selectedAddress
                    ? `${selectedAddress.first_name} ${selectedAddress.last_name} — ${selectedAddress.address_1}${selectedAddress.city ? `, ${selectedAddress.city}` : ""}`
                    : "Choose a saved address"}
                </span>
              </div>
              <ChevronUpDown
                className={clx("text-neutral-400 shrink-0 transition-transform duration-200", {
                  "transform rotate-180 text-[#E5C378]": open,
                })}
              />
            </>
          )}
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className="absolute z-30 w-full mt-2 overflow-auto bg-[#121215] border border-white/15 rounded-xl max-h-72 focus:outline-none shadow-2xl divide-y divide-white/10"
            data-testid="shipping-address-options"
          >
            {addresses.map((address) => {
              const isSelected = selectedAddress?.id === address.id
              return (
                <Listbox.Option
                  key={address.id}
                  value={address.id}
                  className={clx(
                    "cursor-pointer select-none relative p-4 transition-colors duration-150",
                    {
                      "bg-[#E5C378]/10 border-l-2 border-l-[#E5C378]": isSelected,
                      "hover:bg-white/[0.04]": !isSelected,
                    }
                  )}
                  data-testid="shipping-address-option"
                >
                  <div className="flex gap-x-3.5 items-start">
                    <div className="pt-0.5">
                      <Radio
                        checked={isSelected}
                        data-testid="shipping-address-radio"
                      />
                    </div>
                    <div className="flex flex-col text-left flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-[#FDFBF7] truncate">
                          {address.first_name} {address.last_name}
                        </span>
                        {address.company && (
                          <span className="text-[11px] uppercase tracking-wider text-[#E5C378] font-medium bg-[#E5C378]/10 px-2 py-0.5 rounded border border-[#E5C378]/20 shrink-0">
                            {address.company}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col text-xs text-neutral-300 mt-1.5 space-y-0.5 leading-relaxed font-sans">
                        <span className="text-white/90">
                          {address.address_1}
                          {address.address_2 && <span>, {address.address_2}</span>}
                        </span>
                        <span>
                          {address.postal_code}, {address.city}
                        </span>
                        <span className="text-neutral-400 uppercase tracking-wider text-[11px]">
                          {address.province ? `${address.province}, ` : ""}
                          {address.country_code?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Listbox.Option>
              )
            })}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

export default AddressSelect
