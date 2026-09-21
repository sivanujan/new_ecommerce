import { HttpTypes } from "@medusajs/types"

type LineItemOptionsProps = {
  variant: HttpTypes.StoreProductVariant | undefined
  "data-testid"?: string
  "data-value"?: HttpTypes.StoreProductVariant
}

const LineItemOptions = ({
  variant,
  "data-testid": dataTestid,
  "data-value": dataValue,
}: LineItemOptionsProps) => {
  if (!variant?.title || variant.title === "Default Variant" || variant.title === "Unique") {
    return null
  }

  return (
    <span
      data-testid={dataTestid}
      data-value={dataValue}
      className="inline-block text-xs font-mono text-neutral-400 truncate mt-0.5"
    >
      Variant: <span className="text-neutral-300 font-semibold">{variant.title}</span>
    </span>
  )
}

export default LineItemOptions
