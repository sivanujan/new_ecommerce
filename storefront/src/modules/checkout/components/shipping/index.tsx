"use client"

import { Radio, RadioGroup } from "@headlessui/react"
import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { CheckCircleSolid, Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, clx, Heading, Text } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import Divider from "@modules/common/components/divider"
import MedusaRadio from "@modules/common/components/radio"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const PICKUP_OPTION_ON = "__PICKUP_ON"
const PICKUP_OPTION_OFF = "__PICKUP_OFF"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

function formatAddress(address: HttpTypes.StoreCartAddress) {
  if (!address) {
    return ""
  }

  let ret = ""

  if (address.address_1) {
    ret += ` ${address.address_1}`
  }

  if (address.address_2) {
    ret += `, ${address.address_2}`
  }

  if (address.postal_code) {
    ret += `, ${address.postal_code} ${address.city}`
  }

  if (address.country_code) {
    ret += `, ${address.country_code.toUpperCase()}`
  }

  return ret
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)

  const [showPickupOptions, setShowPickupOptions] =
    useState<string>(PICKUP_OPTION_OFF)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const _shippingMethods = availableShippingMethods?.filter(
    (sm) => sm.service_zone?.fulfillment_set?.type !== "pickup"
  )

  const _pickupMethods = availableShippingMethods?.filter(
    (sm) => sm.service_zone?.fulfillment_set?.type === "pickup"
  )

  const hasPickupOptions = !!_pickupMethods?.length

  useEffect(() => {
    setIsLoadingPrices(true)

    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount!))

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      }
    }

    if (_pickupMethods?.find((m) => m.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON)
    }
  }, [availableShippingMethods, shippingMethodId])

  useEffect(() => {
    if (_shippingMethods && _shippingMethods.length > 0) {
      const isCurrentValid = _shippingMethods.some((m) => m.id === shippingMethodId)
      if (!isCurrentValid) {
        handleSetShippingMethod(_shippingMethods[0].id, "shipping")
      }
    }
  }, [_shippingMethods, shippingMethodId])

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const handleSetShippingMethod = async (
    id: string,
    variant: "shipping" | "pickup"
  ) => {
    setError(null)

    if (variant === "pickup") {
      setShowPickupOptions(PICKUP_OPTION_ON)
    } else {
      setShowPickupOptions(PICKUP_OPTION_OFF)
    }

    let currentId: string | null = null
    setIsLoading(true)
    setShippingMethodId((prev) => {
      currentId = prev
      return id
    })

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => {
        setShippingMethodId(currentId)

        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  const hasSelectedShipping = (cart.shipping_methods?.length ?? 0) > 0

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${
        isOpen
          ? "bg-[#121215] border-[#E5C378]/30 shadow-2xl p-6 sm:p-8"
          : "bg-[#121215]/80 border-white/10 p-5 sm:p-6"
      }`}
    >
      {/* Step Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          {/* Step Number or Completed Check */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
              !isOpen && hasSelectedShipping
                ? "bg-[#E5C378] text-neutral-950 shadow-[0_0_15px_rgba(229,195,120,0.3)]"
                : isOpen
                ? "border-2 border-[#E5C378] text-[#E5C378] bg-[#E5C378]/10 shadow-[0_0_15px_rgba(229,195,120,0.2)]"
                : "border border-white/20 text-neutral-400 bg-white/[0.02]"
            }`}
          >
            {!isOpen && hasSelectedShipping ? (
              <svg className="w-4 h-4 text-neutral-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              "02"
            )}
          </div>

          <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-wider">
            Delivery Method
          </h2>
        </div>

        {/* Edit Button when Collapsed */}
        {!isOpen && hasSelectedShipping && (
          <button
            onClick={handleEdit}
            className="text-xs uppercase tracking-wider font-semibold text-[#E5C378] hover:text-white border border-[#E5C378]/30 hover:border-[#E5C378] hover:bg-[#E5C378]/10 px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5"
            data-testid="edit-delivery-button"
          >
            <span>Edit</span>
          </button>
        )}
      </div>

      {/* Form when Active */}
      {isOpen ? (
        <div className="pt-6 sm:pt-8">
          <div className="flex flex-col mb-4">
            <span className="text-xs uppercase tracking-wider font-mono text-neutral-400">
              Select your preferred shipping option
            </span>
          </div>

          <div data-testid="delivery-options-container" className="space-y-3">
            {/* Regular Shipping Methods */}
            <RadioGroup
              value={shippingMethodId}
              onChange={(v) => {
                if (v) {
                  return handleSetShippingMethod(v, "shipping")
                }
              }}
              className="space-y-3"
            >
              {_shippingMethods?.map((option) => {
                const isDisabled =
                  option.price_type === "calculated" &&
                  !isLoadingPrices &&
                  typeof calculatedPricesMap[option.id] !== "number"

                const isSelected = option.id === shippingMethodId

                return (
                  <Radio
                    key={option.id}
                    value={option.id}
                    data-testid="delivery-option-radio"
                    disabled={isDisabled}
                    className={`flex items-center justify-between p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#E5C378] bg-[#E5C378]/[0.08] shadow-[0_0_20px_rgba(229,195,120,0.1)]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
                    } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Radio Bullet */}
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-[#E5C378] bg-transparent"
                            : "border-white/30 bg-white/5"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#E5C378]" />
                        )}
                      </div>

                      <div className="flex flex-col">
                        <span className="font-medium text-sm sm:text-base text-white">
                          {option.name}
                        </span>
                        <span className="text-xs text-neutral-400 font-sans">
                          Insured & Tracked Courier
                        </span>
                      </div>
                    </div>

                    <span className="font-mono font-bold text-sm sm:text-base text-[#E5C378]">
                      {option.price_type === "flat" ? (
                        convertToLocale({
                          amount: option.amount!,
                          currency_code: cart?.currency_code,
                        })
                      ) : calculatedPricesMap[option.id] ? (
                        convertToLocale({
                          amount: calculatedPricesMap[option.id],
                          currency_code: cart?.currency_code,
                        })
                      ) : isLoadingPrices ? (
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full" />
                      ) : (
                        "-"
                      )}
                    </span>
                  </Radio>
                )
              })}
            </RadioGroup>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !cart.shipping_methods?.[0]}
              className="w-full sm:w-auto min-w-[200px] py-3.5 px-8 rounded-full font-bold uppercase tracking-[0.15em] text-xs sm:text-sm bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 hover:shadow-[0_0_25px_rgba(229,195,120,0.35)] hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              data-testid="submit-delivery-option-button"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
                  <span>Updating...</span>
                </span>
              ) : (
                "Continue to payment"
              )}
            </button>
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-sans">
              <svg className="w-4 h-4 text-[#E5C378]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Fully insured signature courier</span>
            </div>
          </div>
          <ErrorMessage error={error} data-testid="delivery-option-error-message" />
        </div>
      ) : (
        /* Summary when Collapsed */
        <div className="pt-4 text-xs sm:text-sm font-sans">
          {cart && (cart.shipping_methods?.length ?? 0) > 0 ? (
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 font-mono">
                  Method:
                </span>
                <span className="text-white font-medium">
                  {cart.shipping_methods!.at(-1)!.name}
                </span>
              </div>
              <span className="font-mono font-bold text-[#E5C378]">
                {convertToLocale({
                  amount: cart.shipping_methods!.at(-1)!.amount!,
                  currency_code: cart?.currency_code,
                })}
              </span>
            </div>
          ) : (
            <div className="pt-2 text-neutral-500 italic">
              Delivery option will appear after address confirmation.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Shipping
