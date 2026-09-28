import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const q = searchParams.get("q") || ""
  const category = searchParams.get("category") || ""
  const limit = Math.min(Number(searchParams.get("limit") || 24), 50)

  const backendUrl =
    process.env.MEDUSA_BACKEND_URL || "http://127.0.0.1:9000"
  const publishableKey =
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

  try {
    const url = new URL(`${backendUrl}/store/products`)
    url.searchParams.set("limit", limit.toString())
    url.searchParams.set(
      "fields",
      "*variants.calculated_price,*variants,*categories,*images,+description,+subtitle,+tags"
    )

    if (q.trim()) {
      url.searchParams.set("q", q.trim())
    }

    const res = await fetch(url.toString(), {
      headers: {
        "x-publishable-api-key": publishableKey,
      },
      next: {
        revalidate: 10,
      },
    })

    if (!res.ok) {
      return NextResponse.json({ products: [] }, { status: 200 })
    }

    const data = await res.json()
    const rawProducts = data.products || []

    const formattedProducts = rawProducts.map((product: any) => {
      let priceStr = "€49.00"
      let priceNum = 4900
      const calculatedPrice = product.variants?.[0]?.calculated_price
      if (calculatedPrice) {
        priceNum = calculatedPrice.calculated_amount ?? calculatedPrice.amount ?? 4900
        const currency = (calculatedPrice.currency_code || "eur").toUpperCase()
        const amount = typeof priceNum === "number" ? priceNum : 49
        priceStr = `${currency} ${amount.toFixed(2)}`
      }

      const thumbnail =
        product.thumbnail ||
        product.images?.[0]?.url ||
        "/images/tamzen-hero-pendant.jpg"

      const categories = (product.categories || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        handle: c.handle,
      }))

      return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        thumbnail,
        description: product.description || product.subtitle || null,
        categories,
        price: priceStr,
        priceNumber: priceNum,
        createdAt: product.created_at,
      }
    })

    let result = formattedProducts
    if (category && category !== "all") {
      result = result.filter((p: any) =>
        p.categories.some(
          (c: any) =>
            c.handle?.toLowerCase() === category.toLowerCase() ||
            c.name?.toLowerCase() === category.toLowerCase()
        )
      )
    }

    return NextResponse.json({ products: result }, { status: 200 })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ products: [] }, { status: 500 })
  }
}
