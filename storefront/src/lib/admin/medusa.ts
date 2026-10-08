import { cookies } from "next/headers"

let rawBackendUrl = (process.env.MEDUSA_BACKEND_URL || "http://localhost:9000").replace("localhost", "127.0.0.1").trim()
if (!rawBackendUrl.startsWith("http://") && !rawBackendUrl.startsWith("https://")) {
  rawBackendUrl = `https://${rawBackendUrl}`
}
const BACKEND_URL = rawBackendUrl.replace(/\/+$/, "")
const DEFAULT_SALES_CHANNEL_ID = "sc_01M4AZ8B99DQHGQ3RFP2YR865W"

export async function adminFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string; status?: number }> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("tamzen_admin_token")?.value

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const res = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers,
      cache: "no-store",
    })

    const text = await res.text()
    let data: any = null
    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      data = { raw: text }
    }

    if (!res.ok) {
      return {
        error: data?.message || `Medusa API error (${res.status}): ${res.statusText}`,
        status: res.status,
      }
    }

    return { data, status: res.status }
  } catch (err: any) {
    return { error: err?.message || "Failed to connect to Medusa backend" }
  }
}

// Sales Channels
export async function getDefaultSalesChannels() {
  const res = await adminFetch<{ sales_channels: { id: string; name: string }[] }>("/admin/sales-channels")
  if (res.data?.sales_channels && res.data.sales_channels.length > 0) {
    return res.data.sales_channels
  }
  return [{ id: DEFAULT_SALES_CHANNEL_ID, name: "Default Sales Channel" }]
}

// Stores & Settings
export async function getStore() {
  const res = await adminFetch<{ stores: any[] }>("/admin/stores")
  return res.data?.stores?.[0] || null
}

export async function updateStore(
  id: string,
  data: { name?: string; contactEmail?: string }
) {
  const payload: any = {}
  if (data.name) payload.name = data.name
  if (data.contactEmail !== undefined) {
    payload.metadata = { contact_email: data.contactEmail }
  }
  return adminFetch(`/admin/stores/${id}`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function getCurrentUser() {
  const res = await adminFetch<{ user: any }>("/admin/users/me")
  return res.data?.user || null
}

export async function updateCurrentUser(
  id: string,
  data: { first_name?: string; last_name?: string }
) {
  return adminFetch(`/admin/users/${id}`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// Categories
export async function listCategories() {
  const res = await adminFetch<{ product_categories: any[] }>("/admin/product-categories?limit=100")
  return res.data?.product_categories || []
}

export async function createCategory(data: { name: string; description?: string; imageUrl?: string }) {
  const handle = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  const payload: any = {
    name: data.name,
    description: data.description || "",
    handle,
    is_active: true,
    is_internal: false,
  }
  if (data.imageUrl) {
    payload.metadata = { image_url: data.imageUrl }
  }
  return adminFetch("/admin/product-categories", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function updateCategory(id: string, data: { name: string; description?: string; imageUrl?: string }) {
  const payload: any = {
    name: data.name,
    description: data.description || "",
  }
  if (data.imageUrl !== undefined) {
    payload.metadata = { image_url: data.imageUrl }
  }
  return adminFetch(`/admin/product-categories/${id}`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function deleteCategory(id: string) {
  return adminFetch(`/admin/product-categories/${id}`, {
    method: "DELETE",
  })
}

// Products
export async function listProducts() {
  const res = await adminFetch<{ products: any[] }>(
    "/admin/products?limit=100&fields=*variants.prices,*categories,*images&order=-created_at"
  )
  const products = res.data?.products || []
  return [...products].sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0
    return timeB - timeA
  })
}

export async function getProduct(id: string) {
  const res = await adminFetch<{ product: any }>(
    `/admin/products/${id}?fields=*variants.prices,*categories,*images,*sales_channels`
  )
  return res.data?.product || null
}

export async function createProduct(input: {
  title: string
  description?: string
  price: number
  compareAtPrice?: number
  categoryId?: string
  stock: number
  images: string[]
  thumbnail?: string
  isPublished: boolean
  options?: { title: string; values: string[] }[]
  colorImages?: Record<string, string[]>
  metadata?: Record<string, any>
  optionTitle?: string
  optionValues?: string[]
}) {
  const salesChannels = await getDefaultSalesChannels()
  const salesChannelIds = salesChannels.map((sc) => ({ id: sc.id }))

  const handle =
    input.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") +
    "-" +
    Math.random().toString(36).substring(2, 6)

  // Determine options structure
  let finalOptions: { title: string; values: string[] }[] = []
  if (input.options && input.options.length > 0) {
    finalOptions = input.options
      .map((opt) => ({
        title: opt.title.trim(),
        values: opt.values.map((v) => v.trim()).filter(Boolean),
      }))
      .filter((opt) => opt.title && opt.values.length > 0)
  } else if (input.optionTitle && input.optionValues && input.optionValues.length > 0) {
    finalOptions = [
      {
        title: input.optionTitle.trim(),
        values: input.optionValues.map((v) => v.trim()).filter(Boolean),
      },
    ]
  }

  if (finalOptions.length === 0) {
    finalOptions = [{ title: "Option", values: ["Default"] }]
  }

  // Cartesian product generator for option combinations
  function cartesian(arr: { title: string; values: string[] }[]) {
    return arr.reduce<Record<string, string>[]>(
      (acc, curr) => {
        const next: Record<string, string>[] = []
        for (const prev of acc) {
          for (const val of curr.values) {
            next.push({ ...prev, [curr.title]: val })
          }
        }
        return next
      },
      [{}]
    )
  }

  const combinations = cartesian(finalOptions)
  const variants = combinations.map((combo) => {
    const titleParts = Object.values(combo).filter(Boolean)
    const variantTitle = titleParts.length > 0 ? titleParts.join(" / ") : "Default"
    const colorVal = combo["Color"] || combo["color"]
    const colorImgs = colorVal && input.colorImages ? input.colorImages[colorVal] : []

    return {
      title: variantTitle === "Default" ? "Default" : `${input.title} – ${variantTitle}`,
      options: combo,
      prices: [{ currency_code: "eur", amount: Number(input.price) }],
      manage_inventory: false,
      allow_backorder: true,
      metadata: {
        stock_quantity: Number(input.stock) || 0,
        compare_at_price: input.compareAtPrice ? Number(input.compareAtPrice) : null,
        image_url: colorImgs?.[0] || input.thumbnail || input.images[0] || null,
      },
    }
  })

  // Ensure featured thumbnail is at the front of images list
  const featured = input.thumbnail || (input.images && input.images[0]) || null
  const orderedImages = [...(input.images || [])]
  if (featured && orderedImages.includes(featured)) {
    const idx = orderedImages.indexOf(featured)
    if (idx > 0) {
      orderedImages.splice(idx, 1)
      orderedImages.unshift(featured)
    }
  } else if (featured && !orderedImages.includes(featured)) {
    orderedImages.unshift(featured)
  }

  const payload: any = {
    title: input.title,
    handle,
    description: input.description || "",
    status: input.isPublished ? "published" : "draft",
    thumbnail: featured,
    images: orderedImages.map((url) => ({ url })),
    sales_channels: salesChannelIds,
    options: finalOptions,
    variants,
    metadata: {
      ...(input.metadata || {}),
      featured_image: featured,
      color_images: input.colorImages || {},
    },
  }

  if (input.categoryId) {
    payload.categories = [{ id: input.categoryId }]
  }

  const res = await adminFetch<{ product: any }>("/admin/products", {
    method: "POST",
    body: JSON.stringify(payload),
  })

  // Explicitly associate category if specified
  if (res.data?.product?.id && input.categoryId) {
    await adminFetch(`/admin/products/${res.data.product.id}`, {
      method: "POST",
      body: JSON.stringify({ categories: [{ id: input.categoryId }] }),
    })
  }

  return res
}

export async function updateProduct(
  id: string,
  input: {
    title: string
    description?: string
    price?: number
    compareAtPrice?: number | null
    categoryId?: string
    stock?: number
    images?: string[]
    thumbnail?: string
    isPublished?: boolean
    colorImages?: Record<string, string[]>
    metadata?: Record<string, any>
  }
) {
  const payload: any = {
    title: input.title,
    description: input.description || "",
  }

  if (input.isPublished !== undefined) {
    payload.status = input.isPublished ? "published" : "draft"
  }

  const featured = input.thumbnail || (input.images && input.images[0]) || undefined
  if (featured) {
    payload.thumbnail = featured
  }

  if (input.images && input.images.length > 0) {
    const reordered = [...input.images]
    if (featured) {
      const idx = reordered.indexOf(featured)
      if (idx > 0) {
        reordered.splice(idx, 1)
        reordered.unshift(featured)
      }
    }
    payload.images = reordered.map((url) => ({ url }))
  }

  if (input.categoryId !== undefined) {
    payload.categories = input.categoryId ? [{ id: input.categoryId }] : []
  }

  const existing = await getProduct(id)
  const existingMetadata = existing?.metadata || {}
  const nextMetadata: any = {
    ...existingMetadata,
    ...(input.metadata || {}),
  }
  if (featured) {
    nextMetadata.featured_image = featured
  }
  if (input.colorImages !== undefined) {
    nextMetadata.color_images = input.colorImages
  }
  payload.metadata = nextMetadata

  // Update base product
  const updateRes = await adminFetch(`/admin/products/${id}`, {
    method: "POST",
    body: JSON.stringify(payload),
  })

  // Update variant price / stock / compareAtPrice across variants
  if (
    input.price !== undefined ||
    input.stock !== undefined ||
    input.compareAtPrice !== undefined
  ) {
    const variants = existing?.variants || []
    for (const variant of variants) {
      const variantPayload: any = {}
      if (input.price !== undefined) {
        variantPayload.prices = [{ currency_code: "eur", amount: Number(input.price) }]
      }
      const existingMetadata = variant.metadata || {}
      const updatedMetadata: any = { ...existingMetadata }
      if (input.stock !== undefined) {
        updatedMetadata.stock_quantity = Number(input.stock)
      }
      if (input.compareAtPrice !== undefined) {
        updatedMetadata.compare_at_price = input.compareAtPrice
          ? Number(input.compareAtPrice)
          : null
      }
      variantPayload.metadata = updatedMetadata

      await adminFetch(`/admin/products/${id}/variants/${variant.id}`, {
        method: "POST",
        body: JSON.stringify(variantPayload),
      })
    }
  }

  return updateRes
}

export async function deleteProduct(id: string) {
  return adminFetch(`/admin/products/${id}`, {
    method: "DELETE",
  })
}

export async function updateProductStatus(id: string, status: "published" | "draft") {
  return adminFetch(`/admin/products/${id}`, {
    method: "POST",
    body: JSON.stringify({ status }),
  })
}

// Promotions
export async function listPromotions() {
  const res = await adminFetch<{ promotions: any[] }>(
    "/admin/promotions?limit=100&fields=*application_method,*application_method.target_rules,*application_method.target_rules.values,*campaign&order=-created_at"
  )
  return res.data?.promotions || []
}

export async function createPromotion(input: {
  code: string
  type?: "standard" | "buyget"
  status?: "active" | "draft"
  isAutomatic?: boolean
  applicationMethod: {
    type: "percentage" | "fixed"
    targetType?: "order" | "items"
    value: number
    currencyCode?: string
    allocation?: "across" | "each"
    targetProductIds?: string[]
  }
}) {
  const targetType =
    input.applicationMethod.targetType ||
    (input.applicationMethod.targetProductIds &&
    input.applicationMethod.targetProductIds.length > 0
      ? "items"
      : "order")

  const appMethod: any = {
    type: input.applicationMethod.type,
    target_type: targetType,
    value: Number(input.applicationMethod.value),
    currency_code: input.applicationMethod.currencyCode || "eur",
    allocation: input.applicationMethod.allocation || "across",
  }

  if (
    targetType === "items" &&
    input.applicationMethod.targetProductIds &&
    input.applicationMethod.targetProductIds.length > 0
  ) {
    appMethod.target_rules = [
      {
        attribute: "items.product.id",
        operator: "in",
        values: input.applicationMethod.targetProductIds,
      },
    ]
  }

  const payload: any = {
    code: input.code.toUpperCase().trim(),
    type: input.type || "standard",
    status: input.status || "active",
    is_automatic: !!input.isAutomatic,
    application_method: appMethod,
  }

  return adminFetch<{ promotion: any }>("/admin/promotions", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function deletePromotion(id: string) {
  return adminFetch(`/admin/promotions/${id}`, {
    method: "DELETE",
  })
}

export async function updatePromotionStatus(id: string, status: "active" | "draft") {
  return adminFetch(`/admin/promotions/${id}`, {
    method: "POST",
    body: JSON.stringify({ status }),
  })
}

// Orders
export async function listOrders() {
  const res = await adminFetch<{ orders: any[] }>(
    "/admin/orders?limit=50&fields=*customer,*items,*shipping_address,*total"
  )
  return res.data?.orders || []
}

export async function getOrder(id: string) {
  const res = await adminFetch<{ order: any }>(
    `/admin/orders/${id}?fields=*customer,*items,*shipping_address,*total,*fulfillments,*payment_collections`
  )
  return res.data?.order || null
}

export async function updateOrderStatus(
  id: string,
  status: string,
  trackingNumber?: string
) {
  const metadata: any = { order_status: status }
  if (trackingNumber) {
    metadata.tracking_number = trackingNumber
  }
  return adminFetch(`/admin/orders/${id}`, {
    method: "POST",
    body: JSON.stringify({ metadata }),
  })
}

// Customers
export async function listCustomers() {
  const res = await adminFetch<{ customers: any[]; count: number }>(
    "/admin/customers?limit=100"
  )
  return res.data?.customers || []
}

export async function getCustomer(id: string) {
  const res = await adminFetch<{ customer: any }>(
    `/admin/customers/${id}?fields=*orders`
  )
  return res.data?.customer || null
}

export async function getCustomersWithMetrics() {
  const [customersRes, ordersRes] = await Promise.all([
    listCustomers(),
    listOrders(),
  ])

  const customers = customersRes || []
  const orders = ordersRes || []

  const customerMap = new Map<string, any>()

  customers.forEach((c: any) => {
    customerMap.set(c.id, {
      id: c.id,
      first_name: c.first_name || "Collector",
      last_name: c.last_name || "",
      email: c.email || "No email",
      phone: c.phone || null,
      created_at: c.created_at || new Date().toISOString(),
      orders: [],
      ordersCount: 0,
      totalSpent: 0,
      isRegistered: true,
    })
  })

  orders.forEach((o: any) => {
    const custId = o.customer_id
    const custEmail = o.customer?.email || o.email
    if (!custEmail && !custId) return

    let target: any = null
    if (custId && customerMap.has(custId)) {
      target = customerMap.get(custId)
    } else {
      for (const val of Array.from(customerMap.values())) {
        if (val.email && custEmail && val.email.toLowerCase() === custEmail.toLowerCase()) {
          target = val
          break
        }
      }
    }

    if (!target) {
      target = {
        id: custId || `client_${custEmail.replace(/[^a-zA-Z0-9]/g, "_")}`,
        first_name: o.customer?.first_name || o.shipping_address?.first_name || "Client",
        last_name: o.customer?.last_name || o.shipping_address?.last_name || "",
        email: custEmail,
        phone: o.shipping_address?.phone || null,
        created_at: o.created_at,
        orders: [],
        ordersCount: 0,
        totalSpent: 0,
        isRegistered: false,
      }
      customerMap.set(target.id, target)
    }

    target.orders.push(o)
    target.ordersCount += 1
    target.totalSpent += (o.total || 0)
  })

  return Array.from(customerMap.values())
}

// Highlights & Featured Deals
export async function getAdminHighlights() {
  const res = await adminFetch<{
    highlights: {
      featured_product_ids: string[]
      deal_product_ids: string[]
      deal_end_time: string | null
    }
    store_id?: string
  }>("/admin/homepage-highlights")

  return (
    res.data?.highlights || {
      featured_product_ids: [],
      deal_product_ids: [],
      deal_end_time: null,
    }
  )
}

export async function updateAdminHighlights(payload: {
  featured_product_ids?: string[]
  deal_product_ids?: string[]
  deal_end_time?: string | null
}) {
  return await adminFetch<{
    message: string
    highlights: {
      featured_product_ids: string[]
      deal_product_ids: string[]
      deal_end_time: string | null
    }
  }>("/admin/homepage-highlights", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

// Dashboard metrics
export async function getDashboardStats() {
  const [productsRes, ordersRes, customersRes, highlightsRes] = await Promise.all([
    listProducts(),
    listOrders(),
    listCustomers(),
    getAdminHighlights(),
  ])

  const products = productsRes || []
  const orders = ordersRes || []
  const customers = customersRes || []
  const highlights = highlightsRes || {
    featured_product_ids: [],
    deal_product_ids: [],
    deal_end_time: null,
  }

  const customerEmails = new Set(customers.map((c: any) => c.email).filter(Boolean))
  orders.forEach((o: any) => {
    const email = o.customer?.email || o.email
    if (email) customerEmails.add(email)
  })
  const totalCustomers = Math.max(customers.length, customerEmails.size)

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  const monthlyOrders = orders.filter((o: any) => {
    const d = new Date(o.created_at)
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth
  })
  const monthlyRevenue = (monthlyOrders.length > 0 ? monthlyOrders : orders).reduce(
    (sum: number, o: any) => sum + (o.total || 0),
    0
  )
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0)

  const daysMap = new Map<
    string,
    { date: string; label: string; amount: number; count: number }
  >()
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split("T")[0]
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    daysMap.set(key, { date: key, label, amount: 0, count: 0 })
  }

  orders.forEach((o: any) => {
    if (!o.created_at) return
    const key = new Date(o.created_at).toISOString().split("T")[0]
    if (daysMap.has(key)) {
      const entry = daysMap.get(key)!
      entry.amount += o.total || 0
      entry.count += 1
    }
  })
  const last30DaysSales = Array.from(daysMap.values())

  const lowStockProducts = products
    .map((p: any) => {
      const stock =
        p.variants?.[0]?.metadata?.stock_quantity ??
        p.variants?.[0]?.inventory_quantity ??
        0
      return { ...p, currentStock: Number(stock) }
    })
    .filter((p: any) => p.currentStock <= 25)
    .sort((a: any, b: any) => a.currentStock - b.currentStock)
    .slice(0, 6)

  return {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalCustomers,
    monthlyRevenue,
    totalRevenue,
    recentOrders: orders.slice(0, 5),
    lowStockProducts,
    last30DaysSales,
    highlights,
  }
}
