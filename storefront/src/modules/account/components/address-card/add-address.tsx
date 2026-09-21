"use client"

import { Plus } from "@medusajs/icons"
import { useEffect, useState, useActionState } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import CountrySelect from "@modules/checkout/components/country-select"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { HttpTypes } from "@medusajs/types"
import { addCustomerAddress } from "@lib/data/customer"

const AddAddress = ({
  region,
  addresses,
}: {
  region: HttpTypes.StoreRegion
  addresses: HttpTypes.StoreCustomerAddress[]
}) => {
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(addCustomerAddress, {
    isDefaultShipping: addresses.length === 0,
    success: false,
    error: null,
  })

  const close = () => {
    setSuccessState(false)
    closeModal()
  }

  useEffect(() => {
    if (successState) {
      close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState])

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true)
    }
  }, [formState])

  return (
    <>
      <button
        className="border-2 border-dashed border-white/20 hover:border-[#E5C378] hover:bg-white/[0.02] rounded-2xl p-6 min-h-[220px] h-full w-full flex flex-col items-center justify-center gap-3 transition-all group cursor-pointer font-sans text-center"
        onClick={open}
        data-testid="add-address-button"
      >
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 group-hover:border-[#E5C378]/50 group-hover:bg-[#E5C378]/10 flex items-center justify-center text-neutral-400 group-hover:text-[#E5C378] transition-all">
          <Plus className="w-6 h-6" />
        </div>
        <div>
          <span className="font-display font-bold text-sm sm:text-base text-neutral-200 group-hover:text-white uppercase tracking-wider block transition-colors">
            Add New Address
          </span>
          <span className="text-xs text-neutral-400 mt-1 block">
            Save shipping destination for expedited checkout
          </span>
        </div>
      </button>

      <Modal isOpen={state} close={close} data-testid="add-address-modal">
        <Modal.Title>Add New Address</Modal.Title>
        <form action={formAction} className="font-sans">
          <Modal.Body>
            <div className="flex flex-col gap-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="First name"
                  name="first_name"
                  required
                  autoComplete="given-name"
                  data-testid="first-name-input"
                />
                <Input
                  label="Last name"
                  name="last_name"
                  required
                  autoComplete="family-name"
                  data-testid="last-name-input"
                />
              </div>

              <Input
                label="Company (Optional)"
                name="company"
                autoComplete="organization"
                data-testid="company-input"
              />

              <Input
                label="Street Address"
                name="address_1"
                required
                autoComplete="address-line1"
                data-testid="address-1-input"
              />

              <Input
                label="Apartment, suite, unit (Optional)"
                name="address_2"
                autoComplete="address-line2"
                data-testid="address-2-input"
              />

              <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3">
                <Input
                  label="Postal code"
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  data-testid="postal-code-input"
                />
                <Input
                  label="City"
                  name="city"
                  required
                  autoComplete="locality"
                  data-testid="city-input"
                />
              </div>

              <Input
                label="Province / State (Optional)"
                name="province"
                autoComplete="address-level1"
                data-testid="state-input"
              />

              <CountrySelect
                region={region}
                name="country_code"
                required
                autoComplete="country"
                data-testid="country-select"
              />

              <Input
                label="Phone (For delivery updates)"
                name="phone"
                autoComplete="phone"
                data-testid="phone-input"
              />
            </div>

            {formState.error && (
              <div
                className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono"
                data-testid="address-error"
              >
                {formState.error}
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            <button
              type="reset"
              onClick={close}
              className="px-6 py-2.5 rounded-full border border-white/20 hover:border-white/40 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              data-testid="cancel-button"
            >
              Cancel
            </button>
            <SubmitButton data-testid="save-button" className="!w-auto !py-2.5">
              Save Address
            </SubmitButton>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default AddAddress
