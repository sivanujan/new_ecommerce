"use client"

import React, { useEffect, useState, useActionState } from "react"
import { PencilSquare as Edit, Trash } from "@medusajs/icons"

import useToggleState from "@lib/hooks/use-toggle-state"
import CountrySelect from "@modules/checkout/components/country-select"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import Spinner from "@modules/common/icons/spinner"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { HttpTypes } from "@medusajs/types"
import {
  deleteCustomerAddress,
  updateCustomerAddress,
} from "@lib/data/customer"

type EditAddressProps = {
  region: HttpTypes.StoreRegion
  address: HttpTypes.StoreCustomerAddress
  isActive?: boolean
}

const EditAddress: React.FC<EditAddressProps> = ({
  region,
  address,
  isActive = false,
}) => {
  const [removing, setRemoving] = useState(false)
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(updateCustomerAddress, {
    success: false,
    error: null,
    addressId: address.id,
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

  const removeAddress = async () => {
    setRemoving(true)
    await deleteCustomerAddress(address.id)
    setRemoving(false)
  }

  return (
    <>
      <div
        className={`rounded-2xl bg-[#121215] border ${
          isActive ? "border-[#E5C378]" : "border-white/10"
        } hover:border-[#E5C378]/40 p-6 min-h-[220px] h-full w-full flex flex-col justify-between font-sans text-white transition-all shadow-lg`}
        data-testid="address-container"
      >
        <div className="flex flex-col text-left">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3
              className="font-display font-bold text-base sm:text-lg text-white"
              data-testid="address-name"
            >
              {address.first_name} {address.last_name}
            </h3>
            {isActive && (
              <span className="px-2 py-0.5 rounded-full bg-[#E5C378]/10 border border-[#E5C378]/30 text-[#E5C378] font-mono text-[10px] font-semibold uppercase tracking-wider">
                Default
              </span>
            )}
          </div>

          {address.company && (
            <span
              className="text-xs font-mono text-neutral-400 mb-1"
              data-testid="address-company"
            >
              {address.company}
            </span>
          )}

          <div className="flex flex-col text-xs sm:text-sm text-neutral-300 gap-0.5 mt-2 leading-relaxed">
            <span data-testid="address-address">
              {address.address_1}
              {address.address_2 && <span>, {address.address_2}</span>}
            </span>
            <span data-testid="address-postal-city">
              {address.postal_code}, {address.city}
            </span>
            <span data-testid="address-province-country">
              {address.province && `${address.province}, `}
              {address.country_code?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-white/10 mt-4">
          <button
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-200 hover:text-[#E5C378] flex items-center gap-1.5 transition-all cursor-pointer"
            onClick={open}
            data-testid="address-edit-button"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-xs font-semibold text-neutral-400 hover:text-rose-400 flex items-center gap-1.5 transition-all cursor-pointer"
            onClick={removeAddress}
            disabled={removing}
            data-testid="address-delete-button"
          >
            {removing ? <Spinner className="w-3.5 h-3.5" /> : <Trash className="w-3.5 h-3.5" />}
            <span>{removing ? "Removing..." : "Remove"}</span>
          </button>
        </div>
      </div>

      <Modal isOpen={state} close={close} data-testid="edit-address-modal">
        <Modal.Title>Edit Address</Modal.Title>
        <form action={formAction} className="font-sans">
          <input type="hidden" name="addressId" value={address.id} />
          <Modal.Body>
            <div className="flex flex-col gap-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="First name"
                  name="first_name"
                  required
                  autoComplete="given-name"
                  defaultValue={address.first_name || undefined}
                  data-testid="first-name-input"
                />
                <Input
                  label="Last name"
                  name="last_name"
                  required
                  autoComplete="family-name"
                  defaultValue={address.last_name || undefined}
                  data-testid="last-name-input"
                />
              </div>

              <Input
                label="Company (Optional)"
                name="company"
                autoComplete="organization"
                defaultValue={address.company || undefined}
                data-testid="company-input"
              />

              <Input
                label="Street Address"
                name="address_1"
                required
                autoComplete="address-line1"
                defaultValue={address.address_1 || undefined}
                data-testid="address-1-input"
              />

              <Input
                label="Apartment, suite, unit (Optional)"
                name="address_2"
                autoComplete="address-line2"
                defaultValue={address.address_2 || undefined}
                data-testid="address-2-input"
              />

              <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3">
                <Input
                  label="Postal code"
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  defaultValue={address.postal_code || undefined}
                  data-testid="postal-code-input"
                />
                <Input
                  label="City"
                  name="city"
                  required
                  autoComplete="locality"
                  defaultValue={address.city || undefined}
                  data-testid="city-input"
                />
              </div>

              <Input
                label="Province / State (Optional)"
                name="province"
                autoComplete="address-level1"
                defaultValue={address.province || undefined}
                data-testid="state-input"
              />

              <CountrySelect
                name="country_code"
                region={region}
                required
                autoComplete="country"
                defaultValue={address.country_code || undefined}
                data-testid="country-select"
              />

              <Input
                label="Phone (For delivery updates)"
                name="phone"
                autoComplete="phone"
                defaultValue={address.phone || undefined}
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
              Save Changes
            </SubmitButton>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default EditAddress
