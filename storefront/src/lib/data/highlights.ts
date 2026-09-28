export interface HomepageHighlights {
  featured_product_ids: string[]
  deal_product_ids: string[]
  deal_end_time: string | null
}

export async function getHomepageHighlights(): Promise<HomepageHighlights> {
  const backendUrl =
    process.env.MEDUSA_BACKEND_URL || "http://127.0.0.1:9000"
  const publishableKey =
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

  try {
    const res = await fetch(`${backendUrl}/store/homepage-highlights`, {
      headers: {
        "x-publishable-api-key": publishableKey,
      },
      next: {
        revalidate: 60,
        tags: ["homepage-highlights"],
      },
    })

    if (!res.ok) {
      return {
        featured_product_ids: [],
        deal_product_ids: [],
        deal_end_time: null,
      }
    }

    const data = await res.json()
    return (
      data.highlights || {
        featured_product_ids: [],
        deal_product_ids: [],
        deal_end_time: null,
      }
    )
  } catch (err) {
    return {
      featured_product_ids: [],
      deal_product_ids: [],
      deal_end_time: null,
    }
  }
}
