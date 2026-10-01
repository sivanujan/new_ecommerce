/**
 * Normalizes image URLs so that legacy/statically stored local URLs
 * (e.g., http://localhost:9000/static/... or http://127.0.0.1:9000/static/...)
 * are mapped to the actual live backend URL in production environments.
 */
export function normalizeImageUrl(url?: string | null): string {
  if (!url) return "/images/tamzen-hero-pendant.jpg"

  // Check if URL points to localhost/127.0.0.1 on port 9000
  if (url.includes("localhost:9000/static") || url.includes("127.0.0.1:9000/static")) {
    const backendUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
      process.env.MEDUSA_BACKEND_URL ||
      ""

    // If a production backend URL is configured, rewrite to use it
    if (backendUrl && !backendUrl.includes("localhost") && !backendUrl.includes("127.0.0.1")) {
      const cleanBackend = backendUrl.replace(/\/+$/, "")
      return url.replace(/^http:\/\/(localhost|127\.0\.0\.1):9000\/static/, `${cleanBackend}/static`)
    }

    // Client-side fallback if running on production domain (e.g. tamzen.shop)
    if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      // In production, default to backend or api subdomain or current origin if proxied
      const currentHost = window.location.hostname
      const protocol = window.location.protocol
      // Common pattern: api.tamzen.shop or tamzen.shop
      const targetHost = currentHost.includes("tamzen.shop") ? `api.tamzen.shop` : currentHost
      return url.replace(/^http:\/\/(localhost|127\.0\.0\.1):9000\/static/, `${protocol}//${targetHost}/static`)
    }
  }

  return url
}
