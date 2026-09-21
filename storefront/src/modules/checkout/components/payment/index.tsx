"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripeLike, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (isStripeLike(method)) {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputCard =
        isStripeLike(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputCard) {
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          {
            scroll: false,
          }
        )
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

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
              !isOpen && paymentReady
                ? "bg-[#E5C378] text-neutral-950 shadow-[0_0_15px_rgba(229,195,120,0.3)]"
                : isOpen
                ? "border-2 border-[#E5C378] text-[#E5C378] bg-[#E5C378]/10 shadow-[0_0_15px_rgba(229,195,120,0.2)]"
                : "border border-white/20 text-neutral-400 bg-white/[0.02]"
            }`}
          >
            {!isOpen && paymentReady ? (
              <svg className="w-4 h-4 text-neutral-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              "03"
            )}
          </div>

          <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-wider">
            Payment Method
          </h2>
        </div>

        {/* Edit Button when Collapsed */}
        {!isOpen && paymentReady && (
          <button
            onClick={handleEdit}
            className="text-xs uppercase tracking-wider font-semibold text-[#E5C378] hover:text-white border border-[#E5C378]/30 hover:border-[#E5C378] hover:bg-[#E5C378]/10 px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5"
            data-testid="edit-payment-button"
          >
            <span>Edit</span>
          </button>
        )}
      </div>

      {/* Form when Active */}
      <div className="mt-4">
        <div className={isOpen ? "block pt-2" : "hidden"}>
          {!paidByGiftcard && availablePaymentMethods?.length && (
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wider font-mono text-neutral-400 block mb-2">
                Select your secure payment method
              </span>
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(value: string) => setPaymentMethod(value)}
              >
                {availablePaymentMethods.map((paymentMethod) => (
                  <div key={paymentMethod.id}>
                    {isStripeLike(paymentMethod.id) ? (
                      <StripeCardContainer
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                        paymentInfoMap={paymentInfoMap}
                        setCardBrand={setCardBrand}
                        setError={setError}
                        setCardComplete={setCardComplete}
                      />
                    ) : (
                      <PaymentContainer
                        paymentInfoMap={paymentInfoMap}
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                      />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col gap-1 p-4 rounded-xl bg-white/[0.03] border border-white/10 mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 font-mono">
                Payment method
              </span>
              <span className="text-white font-medium" data-testid="payment-method-summary">
                Gift card (Order fully covered)
              </span>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handleSubmit}
              disabled={
                isLoading ||
                (isStripeLike(selectedPaymentMethod) && !cardComplete) ||
                (!selectedPaymentMethod && !paidByGiftcard)
              }
              className="w-full sm:w-auto min-w-[200px] py-3.5 px-8 rounded-full font-bold uppercase tracking-[0.15em] text-xs sm:text-sm bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 hover:shadow-[0_0_25px_rgba(229,195,120,0.35)] hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              data-testid="submit-payment-button"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
                  <span>Processing...</span>
                </span>
              ) : !activeSession && isStripeLike(selectedPaymentMethod) ? (
                "Enter card details"
              ) : (
                "Continue to review"
              )}
            </button>
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-sans">
              <svg className="w-4 h-4 text-[#E5C378]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Encrypted & tokenized checkout</span>
            </div>
          </div>
        </div>

        {/* Summary when Collapsed */}
        <div className={isOpen ? "hidden" : "block pt-2"}>
          {cart && paymentReady && activeSession ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/5 text-xs sm:text-sm font-sans">
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 font-mono">
                  Method
                </span>
                <span className="text-white font-medium" data-testid="payment-method-summary">
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 font-mono">
                  Details
                </span>
                <div
                  className="flex items-center gap-2 text-neutral-300"
                  data-testid="payment-details-summary"
                >
                  <div className="flex items-center h-6 px-2 rounded bg-white/10 border border-white/10 text-[#E5C378]">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard size={14} />
                    )}
                  </div>
                  <span>
                    {isStripeLike(selectedPaymentMethod) && cardBrand
                      ? cardBrand
                      : "Verified & ready to authorize"}
                  </span>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="pt-3 border-t border-white/5 flex flex-col gap-1 text-xs sm:text-sm">
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 font-mono">
                Method
              </span>
              <span className="text-white font-medium" data-testid="payment-method-summary">
                Gift card
              </span>
            </div>
          ) : (
            <div className="pt-2 text-neutral-500 italic text-xs sm:text-sm">
              Payment options will appear after delivery method confirmation.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Payment
