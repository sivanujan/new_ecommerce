/**
 * Formats an order into an unguessable, professional luxury tracking code (e.g. "TZ-SB3HYM" or "TZ-X7J792").
 * Mixes letters and numbers to prevent sequential guessing while remaining trackable in Medusa Admin.
 */
export const formatOrderNumber = (
  orderOrId?: any,
  fallbackDisplayId?: number | string | null
): string => {
  if (!orderOrId && !fallbackDisplayId) {
    return "TZ-TAMZEN"
  }

  let id =
    typeof orderOrId === "object"
      ? orderOrId?.id
      : typeof orderOrId === "string"
      ? orderOrId
      : null

  let displayId =
    typeof orderOrId === "object" ? orderOrId?.display_id : fallbackDisplayId

  if (typeof orderOrId === "number") {
    displayId = orderOrId
  }

  // 1. If we have a Medusa order ID (e.g. "order_01M3Q3CR7XHWN9YVXNXDSB3HYM")
  // The suffix is cryptographically random Crockford Base32 entropy.
  if (id && typeof id === "string") {
    const cleanId = id.replace(/^order_/, "")
    if (cleanId.length >= 6) {
      const suffix = cleanId.slice(-6).toUpperCase()
      const hasDigit = /\d/.test(suffix)
      const hasLetter = /[A-Z]/.test(suffix)
      if (hasDigit && hasLetter) {
        return `TZ-${suffix}`
      }
      if (cleanId.length >= 7) {
        const suffix7 = cleanId.slice(-7).toUpperCase()
        if (/\d/.test(suffix7) && /[A-Z]/.test(suffix7)) {
          return `TZ-${suffix7}`
        }
      }
      const d = displayId ? String(displayId).slice(-2) : "8"
      return `TZ-${d}${suffix.slice(-4)}`
    }
  }

  // 2. Deterministic scramble fallback if only a numeric display ID is available (e.g. 7, 8)
  const num =
    parseInt(String(displayId || id || "1").replace(/\D/g, ""), 10) || 1
  let hash = ((num * 2654435761) ^ 0x5bf03635) >>> 0
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += chars[hash % chars.length]
    hash = ((hash / chars.length) ^ (num * 31 + i * 17)) >>> 0
  }
  return `TZ-${result}`
}
