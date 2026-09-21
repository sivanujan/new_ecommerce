import { HttpTypes } from "@medusajs/types"
import Item from "@modules/cart/components/item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items

  return (
    <div className="flex flex-col gap-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
          Your Cart
        </h2>
        <span className="text-xs font-mono text-[#E5C378]">
          {items?.length || 0} {items?.length === 1 ? "Piece" : "Pieces"}
        </span>
      </div>

      {/* Items List */}
      <div className="flex flex-col divide-y divide-white/10">
        {items
          ?.sort((a, b) => {
            return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
          })
          .map((item) => {
            return (
              <Item
                key={item.id}
                item={item}
                type="full"
                currencyCode={cart?.currency_code || "EUR"}
              />
            )
          })}
      </div>
    </div>
  )
}

export default ItemsTemplate
