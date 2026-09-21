import { HttpTypes } from "@medusajs/types"
import LineItemOptions from "@modules/common/components/line-item-options"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
}

const Item = ({ item, currencyCode }: ItemProps) => {
  const unitPrice = convertToLocale({
    amount: (item.total ?? 0) / (item.quantity || 1),
    currency_code: currencyCode,
  })
  const totalPrice = convertToLocale({
    amount: item.total ?? 0,
    currency_code: currencyCode,
  })

  return (
    <div
      className="flex items-center justify-between gap-4 py-4 text-white"
      data-testid="product-row"
    >
      <div className="flex items-center gap-4 min-w-0">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shrink-0 hover:border-[#E5C378]/50 transition-colors"
        >
          <Thumbnail thumbnail={item.thumbnail} size="square" />
        </LocalizedClientLink>

        <div className="flex flex-col min-w-0">
          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-tight truncate hover:text-[#E5C378] transition-colors"
            data-testid="product-name"
          >
            {item.product_title}
          </LocalizedClientLink>
          <LineItemOptions variant={item.variant} data-testid="product-variant" />
        </div>
      </div>

      <div className="flex flex-col items-end justify-center shrink-0">
        <div className="text-xs text-neutral-400 font-mono flex items-center gap-1">
          <span
            data-testid="product-quantity"
            className="text-neutral-300 font-semibold"
          >
            {item.quantity}
          </span>
          <span>×</span>
          <span data-testid="product-unit-price" className="text-neutral-300">
            {unitPrice}
          </span>
        </div>

        <span
          className="font-display font-bold text-base sm:text-lg text-[#E5C378] mt-0.5"
          data-testid="product-price"
        >
          {totalPrice}
        </span>
      </div>
    </div>
  )
}

export default Item
