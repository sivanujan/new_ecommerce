import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  const shippingMethod = (order as any).shipping_methods?.[0]

  return (
    <div className="w-full flex flex-col font-sans text-left">
      <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-white/10">
        <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E5C378]">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-wider">
          Delivery Details
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
        {/* Shipping Address */}
        <div
          className="flex flex-col gap-1.5"
          data-testid="shipping-address-summary"
        >
          <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 font-mono">
            Destination Address
          </span>
          <span className="font-semibold text-white">
            {order.shipping_address?.first_name} {order.shipping_address?.last_name}
          </span>
          <span className="text-neutral-300">
            {order.shipping_address?.address_1}{" "}
            {order.shipping_address?.address_2}
          </span>
          <span className="text-neutral-400">
            {order.shipping_address?.postal_code}, {order.shipping_address?.city}
          </span>
          <span className="text-neutral-400">
            {order.shipping_address?.country_code?.toUpperCase()}
          </span>
        </div>

        {/* Contact Info */}
        <div
          className="flex flex-col gap-1.5"
          data-testid="shipping-contact-summary"
        >
          <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 font-mono">
            Contact
          </span>
          <span className="text-neutral-300">
            {order.shipping_address?.phone || "No phone provided"}
          </span>
          <span className="text-neutral-300 break-all">
            {order.email}
          </span>
        </div>

        {/* Shipping Method */}
        <div
          className="flex flex-col gap-1.5"
          data-testid="shipping-method-summary"
        >
          <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 font-mono">
            Courier Method
          </span>
          <span className="font-medium text-white">
            {shippingMethod?.name || "Standard Shipping"}
          </span>
          <span className="font-mono font-bold text-[#E5C378]">
            {shippingMethod
              ? convertToLocale({
                  amount: shippingMethod.total ?? 0,
                  currency_code: order.currency_code,
                })
              : "Included"}
          </span>
          <span className="text-[11px] text-neutral-400 italic">
            Fully tracked & insured dispatch
          </span>
        </div>
      </div>
    </div>
  )
}

export default ShippingDetails
