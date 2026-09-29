import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  const safeAmount = typeof amount === "number" && !isNaN(amount) ? amount : 0
  const safeCurrency =
    currency_code && !isEmpty(currency_code)
      ? currency_code.toUpperCase()
      : "EUR"

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: safeCurrency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(safeAmount)
  } catch {
    return `${safeCurrency} ${safeAmount.toFixed(2)}`
  }
}
