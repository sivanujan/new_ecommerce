"use server"

import { cookies } from "next/headers"
import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  createCategory,
  updateCategory,
  deleteCategory,
  updateOrderStatus,
  updateStore,
  updateCurrentUser,
  updateAdminHighlights,
  createPromotion,
  deletePromotion,
  updatePromotionStatus,
} from "./medusa"

let rawBackendUrl = (process.env.MEDUSA_BACKEND_URL || "http://localhost:9000").replace("localhost", "127.0.0.1").trim()
if (!rawBackendUrl.startsWith("http://") && !rawBackendUrl.startsWith("https://")) {
  rawBackendUrl = `https://${rawBackendUrl}`
}
const BACKEND_URL = rawBackendUrl.replace(/\/+$/, "")

export async function loginAdminAction(prevState: any, formData: FormData) {
  const email = formData.get("email")?.toString().trim()
  const password = formData.get("password")?.toString()

  if (!email || !password) {
    return { error: "Please enter both email and password." }
  }

  try {
    const res = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    })

    const data = await res.json()

    if (!res.ok || !data.token) {
      return {
        error: data.message || "Invalid email or password. Please verify credentials.",
      }
    }

    const cookieStore = await cookies()
    cookieStore.set("tamzen_admin_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    })
    cookieStore.set("tamzen_admin_email", email, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    })
  } catch (err: any) {
    return { error: err?.message || "Could not connect to Medusa backend server." }
  }

  redirect("/admin")
}

export async function logoutAdminAction() {
  const cookieStore = await cookies()
  cookieStore.delete("tamzen_admin_token")
  cookieStore.delete("tamzen_admin_email")
  redirect("/admin-login")
}

export async function createProductAction(formData: FormData) {
  const title = formData.get("title")?.toString().trim()
  const description = formData.get("description")?.toString().trim()
  const price = parseFloat(formData.get("price")?.toString() || "0")
  const compareAtPriceStr = formData.get("compareAtPrice")?.toString()
  const compareAtPrice = compareAtPriceStr ? parseFloat(compareAtPriceStr) : undefined
  const categoryId = formData.get("categoryId")?.toString() || undefined
  const stock = parseInt(formData.get("stock")?.toString() || "0", 10)
  const isPublished = formData.get("isPublished") === "true"
  const imagesRaw = formData.get("images")?.toString() || "[]"
  const optionTitle = formData.get("optionTitle")?.toString() || undefined
  const optionValuesRaw = formData.get("optionValues")?.toString()

  let images: string[] = []
  try {
    images = JSON.parse(imagesRaw)
  } catch {
    images = []
  }

  let optionValues: string[] | undefined = undefined
  if (optionValuesRaw) {
    try {
      optionValues = JSON.parse(optionValuesRaw)
    } catch {
      optionValues = optionValuesRaw.split(",").map((s) => s.trim()).filter(Boolean)
    }
  }

  if (!title) {
    return { error: "Product name is required." }
  }

  if (isNaN(price) || price < 0) {
    return { error: "Please enter a valid price in EUR." }
  }

  const result = await createProduct({
    title,
    description,
    price,
    compareAtPrice,
    categoryId: categoryId || undefined,
    stock,
    images,
    isPublished,
    optionTitle,
    optionValues,
  })

  if (result.error) {
    return { error: result.error }
  }

  revalidatePath("/admin/products")
  revalidatePath("/admin")
  revalidatePath("/[countryCode]/store", "page")
  return { success: true, product: result.data?.product }
}

export async function updateProductAction(id: string, formData: FormData) {
  const title = formData.get("title")?.toString().trim()
  const description = formData.get("description")?.toString().trim()
  const priceStr = formData.get("price")?.toString()
  const compareAtPriceStr = formData.get("compareAtPrice")?.toString()
  const categoryId = formData.get("categoryId")?.toString() || undefined
  const stockStr = formData.get("stock")?.toString()
  const isPublishedStr = formData.get("isPublished")?.toString()
  const imagesRaw = formData.get("images")?.toString()

  if (!title) {
    return { error: "Product name is required." }
  }

  let images: string[] | undefined = undefined
  if (imagesRaw) {
    try {
      images = JSON.parse(imagesRaw)
    } catch {
      // ignore
    }
  }

  const updateData: any = {
    title,
    description,
    categoryId: categoryId || undefined,
  }

  if (priceStr) {
    updateData.price = parseFloat(priceStr)
  }
  if (compareAtPriceStr !== undefined) {
    updateData.compareAtPrice = compareAtPriceStr ? parseFloat(compareAtPriceStr) : null
  }
  if (stockStr) {
    updateData.stock = parseInt(stockStr, 10)
  }
  if (isPublishedStr !== undefined) {
    updateData.isPublished = isPublishedStr === "true"
  }
  if (images) {
    updateData.images = images
  }

  const result = await updateProduct(id, updateData)

  if (result.error) {
    return { error: result.error }
  }

  revalidatePath("/admin/products")
  revalidatePath(`/admin/products/${id}/edit`)
  revalidatePath("/admin")
  revalidatePath("/[countryCode]/store", "page")
  return { success: true }
}

export async function deleteProductAction(id: string) {
  const result = await deleteProduct(id)
  if (result.error) {
    return { error: result.error }
  }
  revalidatePath("/admin/products")
  revalidatePath("/admin")
  revalidatePath("/[countryCode]/store", "page")
  return { success: true }
}

export async function bulkDeleteProductsAction(ids: string[]) {
  if (!ids || ids.length === 0) {
    return { success: true, count: 0 }
  }

  let successCount = 0
  const errors: string[] = []

  for (const id of ids) {
    try {
      const res = await deleteProduct(id)
      if (res.error) {
        errors.push(`Failed to delete piece ${id}: ${res.error}`)
      } else {
        successCount++
      }
    } catch (err: any) {
      errors.push(`Error deleting ${id}: ${err?.message || "Unknown error"}`)
    }
  }

  revalidatePath("/admin/products")
  revalidatePath("/admin")
  revalidatePath("/[countryCode]/store", "page")

  if (errors.length > 0 && successCount === 0) {
    return { error: errors[0], success: false, count: 0 }
  }

  return { success: true, count: successCount, errors: errors.length > 0 ? errors : undefined }
}

export async function bulkUpdateProductStatusAction(ids: string[], isPublished: boolean) {
  if (!ids || ids.length === 0) {
    return { success: true, count: 0 }
  }

  const targetStatus = isPublished ? "published" : "draft"
  let successCount = 0
  const errors: string[] = []

  for (const id of ids) {
    try {
      const res = await updateProductStatus(id, targetStatus)
      if (res.error) {
        errors.push(`Failed to update status for ${id}: ${res.error}`)
      } else {
        successCount++
      }
    } catch (err: any) {
      errors.push(`Error updating ${id}: ${err?.message || "Unknown error"}`)
    }
  }

  revalidatePath("/admin/products")
  revalidatePath("/admin")
  revalidatePath("/[countryCode]/store", "page")

  if (errors.length > 0 && successCount === 0) {
    return { error: errors[0], success: false, count: 0 }
  }

  return { success: true, count: successCount, errors: errors.length > 0 ? errors : undefined }
}

export async function createCategoryAction(formData: FormData) {
  const name = formData.get("name")?.toString().trim()
  const description = formData.get("description")?.toString().trim()
  const imageUrl = formData.get("imageUrl")?.toString().trim()

  if (!name) {
    return { error: "Category name is required." }
  }

  const result = await createCategory({
    name,
    description,
    imageUrl: imageUrl || undefined,
  })
  if (result.error) {
    return { error: result.error }
  }

  revalidatePath("/admin/categories")
  revalidatePath("/admin/products")
  return { success: true }
}

export async function updateCategoryAction(id: string, formData: FormData) {
  const name = formData.get("name")?.toString().trim()
  const description = formData.get("description")?.toString().trim()
  const imageUrl = formData.get("imageUrl")?.toString().trim()

  if (!name) {
    return { error: "Category name is required." }
  }

  const result = await updateCategory(id, {
    name,
    description,
    imageUrl: imageUrl !== undefined ? imageUrl : undefined,
  })
  if (result.error) {
    return { error: result.error }
  }

  revalidatePath("/admin/categories")
  revalidatePath("/admin/products")
  return { success: true }
}

export async function deleteCategoryAction(id: string) {
  const result = await deleteCategory(id)
  if (result.error) {
    return { error: result.error }
  }
  revalidatePath("/admin/categories")
  return { success: true }
}

export async function bulkDeleteCategoriesAction(ids: string[]) {
  if (!ids || ids.length === 0) {
    return { success: true, count: 0 }
  }

  let successCount = 0
  const errors: string[] = []

  for (const id of ids) {
    try {
      const res = await deleteCategory(id)
      if (res.error) {
        errors.push(`Failed to delete category ${id}: ${res.error}`)
      } else {
        successCount++
      }
    } catch (err: any) {
      errors.push(`Error deleting category ${id}: ${err?.message || "Unknown error"}`)
    }
  }

  revalidatePath("/admin/categories")
  revalidatePath("/admin/products")

  if (errors.length > 0 && successCount === 0) {
    return { error: errors[0], success: false, count: 0 }
  }

  return { success: true, count: successCount, errors: errors.length > 0 ? errors : undefined }
}

export async function updateOrderStatusAction(
  orderId: string,
  status: string,
  trackingNumber?: string
) {
  const result = await updateOrderStatus(orderId, status, trackingNumber)
  if (result.error) {
    return { error: result.error }
  }
  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath("/admin/orders")
  revalidatePath("/admin")
  return { success: true }
}

export async function updateStoreSettingsAction(formData: FormData) {
  const storeId = formData.get("storeId")?.toString()
  const storeName = formData.get("storeName")?.toString().trim()
  const contactEmail = formData.get("contactEmail")?.toString().trim()

  if (!storeId || !storeName) {
    return { error: "Store name is required." }
  }

  const res = await updateStore(storeId, {
    name: storeName,
    contactEmail: contactEmail || undefined,
  })

  if (res.error) {
    return { error: res.error }
  }

  revalidatePath("/admin/settings")
  revalidatePath("/admin")
  return { success: true }
}

export async function updateAdminProfileAction(formData: FormData) {
  const userId = formData.get("userId")?.toString()
  const firstName = formData.get("firstName")?.toString().trim()
  const lastName = formData.get("lastName")?.toString().trim()

  if (!userId) {
    return { error: "User ID is required." }
  }

  const res = await updateCurrentUser(userId, {
    first_name: firstName,
    last_name: lastName,
  })

  if (res.error) {
    return { error: res.error }
  }

  revalidatePath("/admin/settings")
  return { success: true }
}

export async function updateAdminPasswordAction(formData: FormData) {
  const currentPassword = formData.get("currentPassword")?.toString()
  const newPassword = formData.get("newPassword")?.toString()
  const confirmPassword = formData.get("confirmPassword")?.toString()

  if (!currentPassword || !newPassword) {
    return { error: "Please enter your current password and new password." }
  }

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters long." }
  }

  if (newPassword !== confirmPassword) {
    return { error: "New password and confirm password do not match." }
  }

  const cookieStore = await cookies()
  const email = cookieStore.get("tamzen_admin_email")?.value || "admin@tamzen.shop"

  // Verify current password against Medusa admin auth
  const checkRes = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: currentPassword }),
  })

  if (!checkRes.ok) {
    return { error: "Current password is incorrect. Please verify credentials." }
  }

  // Request password reset token workflow in Medusa
  await fetch(`${BACKEND_URL}/auth/user/emailpass/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: email }),
  })

  revalidatePath("/admin/settings")
  return { success: true }
}

export async function updateHomepageHighlightsAction(payload: {
  featured_product_ids: string[]
  deal_product_ids: string[]
  deal_end_time: string | null
}) {
  const res = await updateAdminHighlights(payload)
  if (res.error) {
    return { error: res.error }
  }

  revalidatePath("/admin/featured")
  revalidatePath("/admin")
  revalidatePath("/[countryCode]", "page")
  try {
    revalidateTag("homepage-highlights")
  } catch {
    // Ignore in dev edge contexts if any
  }
  return { success: true, highlights: res.data?.highlights }
}

export async function createPromotionAction(formData: FormData) {
  const code = formData.get("code")?.toString().trim().toUpperCase()
  const discountType = formData.get("discountType")?.toString() || "percentage"
  const valueStr = formData.get("value")?.toString() || "10"
  const value = parseFloat(valueStr)

  if (!code) {
    return { error: "Promo code is required." }
  }

  if (isNaN(value) || value <= 0) {
    return { error: "Please enter a valid discount value greater than 0." }
  }

  if (discountType === "percentage" && value > 100) {
    return { error: "Percentage discount cannot exceed 100%." }
  }

  const result = await createPromotion({
    code,
    type: "standard",
    status: "active",
    applicationMethod: {
      type: discountType === "percentage" ? "percentage" : "fixed",
      value: value,
      currencyCode: "eur",
      allocation: "across",
      targetType: "order",
    },
  })

  if (result.error) {
    return { error: result.error }
  }

  revalidatePath("/admin/promotions")
  revalidatePath("/admin")
  return { success: true, promotion: result.data?.promotion }
}

export async function deletePromotionAction(id: string) {
  const result = await deletePromotion(id)
  if (result.error) {
    return { error: result.error }
  }
  revalidatePath("/admin/promotions")
  return { success: true }
}

export async function bulkDeletePromotionsAction(ids: string[]) {
  if (!ids || ids.length === 0) {
    return { success: true, count: 0 }
  }

  let successCount = 0
  const errors: string[] = []

  for (const id of ids) {
    try {
      const res = await deletePromotion(id)
      if (res.error) {
        errors.push(`Failed to delete promotion ${id}: ${res.error}`)
      } else {
        successCount++
      }
    } catch (err: any) {
      errors.push(`Error deleting ${id}: ${err?.message || "Unknown error"}`)
    }
  }

  revalidatePath("/admin/promotions")

  if (errors.length > 0 && successCount === 0) {
    return { error: errors[0], success: false, count: 0 }
  }

  return { success: true, count: successCount, errors: errors.length > 0 ? errors : undefined }
}

export async function togglePromotionStatusAction(id: string, currentStatus: string) {
  const nextStatus = currentStatus === "active" ? "draft" : "active"
  const res = await updatePromotionStatus(id, nextStatus)
  if (res.error) {
    return { error: res.error }
  }
  revalidatePath("/admin/promotions")
  return { success: true, status: nextStatus }
}
