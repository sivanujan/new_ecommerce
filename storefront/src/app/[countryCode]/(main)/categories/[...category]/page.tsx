import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import {
  CategoryInfo,
  CategoryOption,
} from "@modules/store/components/collection-interactive-view"
import { formatMedusaProduct } from "@lib/util/format-collection-product"
import { normalizeImageUrl } from "@lib/util/normalize-image-url"

export const revalidate = 60

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: string
    page?: string
    q?: string
  }>
}

export async function generateStaticParams() {
  try {
    const product_categories = await listCategories()

    if (!product_categories) {
      return []
    }

    const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    const categoryHandles = product_categories.map(
      (category: any) => category.handle
    )

    const staticParams = countryCodes
      ?.map((countryCode: string | undefined) =>
        categoryHandles.map((handle: any) => ({
          countryCode,
          category: [handle],
        }))
      )
      .flat()

    return staticParams || []
  } catch (error) {
    console.warn(
      `[generateStaticParams] Could not pre-render categories: ${
        error instanceof Error ? error.message : "Unknown error"
      }. Falling back to dynamic rendering.`
    )
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    const productCategory = await getCategoryByHandle(params.category)
    if (!productCategory) notFound()

    const title = `${productCategory.name} — TamZen`
    const fallbackDesc = `Explore handcrafted ${productCategory.name.toLowerCase()} by TamZen. Symbolic Tamil cultural jewelry forged in solid 316L surgical stainless steel.`
    const description = productCategory.description?.trim() || fallbackDesc

    const imageUrl = normalizeImageUrl(
      (productCategory.metadata as any)?.image_url ||
      `/images/category-${productCategory.handle}.jpg`
    )

    return {
      title,
      description,
      alternates: {
        canonical: `/${params.countryCode}/categories/${params.category.join("/")}`,
      },
      openGraph: {
        title,
        description,
        images: [imageUrl],
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, q } = searchParams
  const { countryCode } = params

  const productCategory = await getCategoryByHandle(params.category)

  if (!productCategory) {
    notFound()
  }

  const region = await getRegion(countryCode)

  // Fetch all categories for filter pills and products in this category
  const [categoriesRaw, productsRaw] = await Promise.all([
    listCategories().catch(() => []),
    listProducts({
      countryCode,
      regionId: region?.id,
      queryParams: {
        category_id: [productCategory.id],
        limit: 100,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,*variants.options,*options.values,*categories,*images,+metadata,+tags",
      },
    }).catch(() => ({ response: { products: [] } })),
  ])

  // Extract category options for sticky filter bar pills
  const categories: CategoryOption[] = (categoriesRaw || []).map((cat) => ({
    id: cat.id,
    name: cat.name,
    handle: cat.handle,
  }))

  // Format products using unified formatter with calculated EUR prices & 3 color finish dots
  const products = (productsRaw?.response?.products || []).map(
    (product, index) => formatMedusaProduct(product, index)
  )

  const currentCategory: CategoryInfo = {
    id: productCategory.id,
    name: productCategory.name,
    handle: productCategory.handle,
    description: productCategory.description,
    metadata: productCategory.metadata,
    image: (productCategory.metadata as any)?.image_url || null,
  }

  // SEO BreadcrumbList JSON-LD
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tamzen.com"
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${siteUrl}/${countryCode}`,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Collection",
        "item": `${siteUrl}/${countryCode}/store`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": productCategory.name,
        "item": `${siteUrl}/${countryCode}/categories/${productCategory.handle}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CategoryTemplate
        products={products}
        categories={categories}
        currentCategory={currentCategory}
        initialSort={sortBy}
        initialSearch={q}
      />
    </>
  )
}
