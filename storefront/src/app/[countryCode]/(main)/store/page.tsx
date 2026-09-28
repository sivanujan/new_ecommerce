import { Metadata } from "next"
import { listProducts } from "@lib/data/products"
import { listCategories } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import StoreTemplate from "@modules/store/templates"
import {
  CategoryOption,
  FormattedCollectionProduct,
} from "@modules/store/components/collection-interactive-view"

export const metadata: Metadata = {
  title: "The Collection | TamZen — Wear Your Roots",
  description:
    "Explore the complete TamZen collection. Cultural jewelry, pendants, and signature pieces forged in solid 316L stainless steel inspired by Tamil-Eelam heritage.",
  openGraph: {
    title: "The Collection | TamZen — Wear Your Roots",
    description:
      "Symbols that define you. Explore our complete collection of cultural pendants and signature jewelry.",
    images: ["/images/tamzen-hero-pendant.jpg"],
  },
}

type Params = {
  searchParams: Promise<{
    sortBy?: string
    category?: string
    page?: string
    q?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, category, q } = searchParams
  const { countryCode } = params

  const region = await getRegion(countryCode)

  // Fetch categories and all products live from Medusa
  const [categoriesRaw, productsRaw] = await Promise.all([
    listCategories().catch(() => []),
    listProducts({
      countryCode,
      regionId: region?.id,
      queryParams: {
        limit: 100,
        fields: "*variants.calculated_price,*categories",
      },
    }).catch(() => ({ response: { products: [] } })),
  ])

  // Extract clean category options
  const categories: CategoryOption[] = (categoriesRaw || []).map((cat) => ({
    id: cat.id,
    name: cat.name,
    handle: cat.handle,
  }))

  // Format products with live calculated EUR prices & categories
  const products: FormattedCollectionProduct[] = (
    productsRaw?.response?.products || []
  ).map((product, index) => {
    const { cheapestPrice } = getProductPrice({ product })

    const thumbnail =
      product.thumbnail ||
      product.images?.[0]?.url ||
      "/images/tamzen-hero-pendant.jpg"

    const productCategories = (product.categories || []).map((c) => ({
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
      categories: productCategories,
      price: cheapestPrice?.calculated_price ?? "€49.00",
      priceNumber: cheapestPrice?.calculated_price_number ?? 0,
      createdAt: product.created_at || undefined,
      isNew: index === 0 || index === 2,
    }
  })

  return (
    <StoreTemplate
      products={products}
      categories={categories}
      initialCategory={category}
      initialSort={sortBy}
      initialSearch={q}
    />
  )
}
