export interface HomepageHighlights {
  featured_product_ids: string[]
  deal_product_ids: string[]
  deal_end_time: string | null
}

export async function getHomepageHighlights(): Promise<HomepageHighlights> {
  const defaultHighlights: HomepageHighlights = {
    featured_product_ids: [],
    deal_product_ids: [],
    deal_end_time: null,
  }

  let backendUrl = (
    process.env.MEDUSA_BACKEND_URL || "http://127.0.0.1:9000"
  ).replace("localhost", "127.0.0.1").trim()

  if (!backendUrl.startsWith("http://") && !backendUrl.startsWith("https://")) {
    backendUrl = `https://${backendUrl}`
  }
  backendUrl = backendUrl.replace(/\/+$/, "")

  const publishableKey =
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

  try {
    const res = await fetch(`${backendUrl}/store/homepage-highlights`, {
      headers: {
        "x-publishable-api-key": publishableKey,
      },
      next: {
        revalidate: 30,
        tags: ["homepage-highlights"],
      },
    })

    if (!res.ok) {
      return defaultHighlights
    }

    const text = await res.text()
    if (!text || !text.trim()) {
      return defaultHighlights
    }

    const data = JSON.parse(text)
    return {
      featured_product_ids: Array.isArray(data?.highlights?.featured_product_ids)
        ? data.highlights.featured_product_ids
        : [],
      deal_product_ids: Array.isArray(data?.highlights?.deal_product_ids)
        ? data.highlights.deal_product_ids
        : [],
      deal_end_time: data?.highlights?.deal_end_time || null,
    }
  } catch (err) {
    return defaultHighlights
  }
}
