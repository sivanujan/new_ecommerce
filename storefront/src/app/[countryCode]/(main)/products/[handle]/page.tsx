import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"
import { normalizeImageUrl } from "@lib/util/normalize-image-url"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string; color?: string }>
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    const promises = countryCodes.map(async (country) => {
      const { response } = await listProducts({
        countryCode: country,
        queryParams: { limit: 100, fields: "handle" },
      })

      return {
        country,
        products: response.products,
      }
    })

    const countryProducts = await Promise.all(promises)

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        }))
      )
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string,
  colorParam?: string
) {
  let images = product.images ? [...product.images] : []

  // If a color is specified in URL query, place that color's image first
  if (colorParam) {
    const metaColorImgs = (product.metadata as any)?.color_images || {}
    const matchedColorKey = Object.keys(metaColorImgs).find(
      (k) => k.toLowerCase() === colorParam.toLowerCase()
    )
    if (matchedColorKey && metaColorImgs[matchedColorKey]?.length) {
      const colorUrls = metaColorImgs[matchedColorKey]
      const colorNormSet = new Set(colorUrls.map((u: string) => normalizeImageUrl(u)))
      const matched = colorUrls.map((url: string, i: number) => ({
        id: `color-${matchedColorKey}-${i}`,
        url: normalizeImageUrl(url),
      })) as HttpTypes.StoreProductImage[]
      const remainder = images.filter((img) => !colorNormSet.has(normalizeImageUrl(img.url)))
      return [...matched, ...remainder]
    }
  }

  if (selectedVariantId && product.variants) {
    const variant = product.variants.find((v) => v.id === selectedVariantId)
    if (variant && variant.images?.length) {
      const imageIdsMap = new Map((variant.images || []).map((i) => [i.id, true]))
      const variantMatched = (product.images || []).filter((i) => imageIdsMap.has(i.id))
      if (variantMatched.length > 0) {
        images = variantMatched
      }
    }
  }

  // Ensure the main featured cover image is FIRST in the gallery
  const featured = product.thumbnail || (product.metadata as any)?.featured_image
  if (featured && images.length > 0) {
    const normFeatured = normalizeImageUrl(featured)
    const existingIndex = images.findIndex(
      (img) => normalizeImageUrl(img.url) === normFeatured
    )
    if (existingIndex > 0) {
      const [featImg] = images.splice(existingIndex, 1)
      images.unshift(featImg)
    } else if (existingIndex === -1) {
      images.unshift({ id: "featured-cover", url: featured } as any)
    }
  }

  return images
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  const title = `${product.title} | TamZen — More Than Jewellery`
  const description =
    product.description ||
    `${product.title} — Handcrafted Tamil cultural emblem jewellery by TamZen Atelier. Solid 316L stainless steel, designed to endure.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.thumbnail ? [{ url: product.thumbnail }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)
  const searchParams = await props.searchParams

  const selectedVariantId = searchParams.v_id
  const selectedColorParam = searchParams.color

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    regionId: region.id,
    queryParams: {
      handle: params.handle,
      fields:
        "*variants.calculated_price,+variants.inventory_quantity,*variants.options,*options.values,*categories,*images,+metadata,+tags",
    },
  }).then(({ response }) => response.products[0])

  if (!pricedProduct) {
    notFound()
  }

  const images = getImagesForVariant(pricedProduct, selectedVariantId, selectedColorParam)

  // JSON-LD Structured Data for Google rich results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pricedProduct.title,
    image: pricedProduct.thumbnail ? [pricedProduct.thumbnail] : [],
    description: pricedProduct.description || pricedProduct.title,
    brand: {
      "@type": "Brand",
      name: "TamZen",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: region.currency_code?.toUpperCase() || "EUR",
      price:
        pricedProduct.variants?.[0]?.calculated_price?.calculated_amount ||
        undefined,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "TamZen",
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={params.countryCode}
        images={images}
      />
    </>
  )
}
