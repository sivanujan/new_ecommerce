"use client"

import { useState } from "react"
import Image from "next/image"
import { Table, Text, clx } from "@medusajs/ui"
import { Trash } from "@medusajs/icons"
import { updateLineItem, deleteLineItem } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    if (quantity < 1) return
    setError(null)
    setUpdating(true)

    try {
      await updateLineItem({
        lineId: item.id,
        quantity,
      })
    } catch (err: any) {
      setError(err?.message || "Failed to update quantity")
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async (id: string) => {
    setUpdating(true)
    try {
      await deleteLineItem(id)
    } catch (err: any) {
      setError(err?.message || "Failed to remove item")
    } finally {
      setUpdating(false)
    }
  }

  // Preview Mode (e.g. In Checkout Summary)
  if (type === "preview") {
    return (
      <div className="flex items-center justify-between gap-3 py-3 text-white bg-transparent" data-testid="product-row">
        <div className="flex items-center gap-3 min-w-0">
          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            className="flex w-14 h-14 rounded-lg overflow-hidden bg-neutral-900 border border-white/10 shrink-0 hover:border-[#E5C378]/50 transition-colors"
          >
            <Thumbnail
              thumbnail={item.thumbnail}
              images={item.variant?.product?.images}
              size="square"
            />
          </LocalizedClientLink>

          <div className="flex flex-col min-w-0">
            <span className="text-white font-medium text-xs sm:text-sm truncate uppercase tracking-tight" data-testid="product-title">
              {item.product_title}
            </span>
            <LineItemOptions variant={item.variant} data-testid="product-variant" />
          </div>
        </div>

        <div className="flex flex-col items-end justify-center shrink-0">
          <span className="text-[11px] text-neutral-400 font-mono">
            {item.quantity} × <LineItemUnitPrice item={item} style="tight" currencyCode={currencyCode} />
          </span>
          <span className="font-mono font-bold text-sm text-[#E5C378]">
            <LineItemPrice item={item} style="tight" currencyCode={currencyCode} />
          </span>
        </div>
      </div>
    )
  }

  // Full Cart View Mode (Luxury Responsive Row)
  const unitPriceAmount =
    (item.unit_price as any) || (item.raw_unit_price as any)?.value || 0
  const totalAmount =
    (item.total as any) || (item.raw_total as any)?.value || 0

  const variantTitle =
    item.variant?.title &&
    item.variant.title !== "Default Variant" &&
    item.variant.title !== "Unique"
      ? item.variant.title
      : null

  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-5 border-b border-white/10 last:border-b-0 group transition-all"
      data-testid="product-row"
    >
      {/* Left: Thumbnail + Title + Variant Label */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Rounded Dark Tile for Product Thumbnail */}
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shrink-0 group-hover:border-[#E5C378]/50 transition-all shadow-md"
        >
          {item.thumbnail ? (
            <Image
              src={item.thumbnail}
              alt={item.product_title || "Creation"}
              fill
              unoptimized
              sizes="96px"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs font-sans">
              No image
            </div>
          )}
        </LocalizedClientLink>

        {/* Product Details */}
        <div className="flex flex-col gap-1 min-w-0">
          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-tight hover:text-[#E5C378] transition-colors line-clamp-1"
            data-testid="product-title"
          >
            {item.product_title}
          </LocalizedClientLink>

          {/* Variant Label */}
          {variantTitle && (
            <div className="flex items-center gap-1 text-xs font-mono text-neutral-400">
              <span>Variant:</span>
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/15 text-[#F3D798] text-[11px] font-semibold">
                {variantTitle}
              </span>
            </div>
          )}

          {/* Unit Price */}
          <span className="text-xs font-sans text-neutral-400">
            {convertToLocale({
              amount: unitPriceAmount,
              currency_code: currencyCode,
            })}{" "}
            each
          </span>

          {error && <span className="text-xs text-rose-400 mt-1">{error}</span>}
        </div>
      </div>

      {/* Right: Quantity Stepper + Line Total + Remove Icon */}
      <div className="flex items-center justify-between sm:justify-end gap-5 sm:gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
        {/* Quantity Stepper */}
        <div className="inline-flex items-center border border-white/20 bg-white/[0.04] rounded-full px-3 py-1.5 shrink-0">
          <button
            type="button"
            onClick={() => changeQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1 || updating}
            aria-label="Decrease quantity"
            className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95"
          >
            -
          </button>
          <span className="px-3 font-mono font-bold text-xs sm:text-sm text-white min-w-[2rem] text-center">
            {updating ? (
              <span className="animate-spin inline-block w-3 h-3 border-2 border-white/20 border-t-white rounded-full" />
            ) : (
              item.quantity
            )}
          </span>
          <button
            type="button"
            onClick={() => changeQuantity(item.quantity + 1)}
            disabled={
              updating ||
              (item.variant?.manage_inventory &&
                (item.variant?.inventory_quantity || 10) <= item.quantity)
            }
            aria-label="Increase quantity"
            className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          >
            +
          </button>
        </div>

        {/* Line Total in Radiant Gold */}
        <div className="text-right min-w-[85px]">
          <span
            className="font-display font-black text-base sm:text-lg text-[#E5C378] tracking-tight"
            data-testid="product-row-total"
          >
            {convertToLocale({
              amount: totalAmount,
              currency_code: currencyCode,
            })}
          </span>
        </div>

        {/* Subtle Remove (Trash) Icon */}
        <button
          type="button"
          onClick={() => handleDelete(item.id)}
          disabled={updating}
          aria-label="Remove item from bag"
          data-testid="product-delete-button"
          className="p-2 rounded-full text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Trash size={16} />
        </button>
      </div>
    </div>
  )
}

export default Item
