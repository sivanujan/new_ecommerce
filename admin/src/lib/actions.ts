"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  updateOrderStatus,
} from "./medusa"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

export async function loginAction(prevState: any, formData: FormData) {
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
        error: data.message || "Invalid email or password. Please check credentials.",
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

  redirect("/")
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("tamzen_admin_token")
  cookieStore.delete("tamzen_admin_email")
  redirect("/login")
}

export async function createProductAction(formData: FormData) {
  const title = formData.get("title")?.toString().trim()
  const description = formData.get("description")?.toString().trim()
  const price = parseFloat(formData.get("price")?.toString() || "0")
  const categoryId = formData.get("categoryId")?.toString() || undefined
  const stock = parseInt(formData.get("stock")?.toString() || "0", 10)
  const isPublished = formData.get("isPublished") === "true"
  const imagesRaw = formData.get("images")?.toString() || "[]"

  let images: string[] = []
  try {
    images = JSON.parse(imagesRaw)
  } catch {
    images = []
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
    categoryId: categoryId || undefined,
    stock,
    images,
    isPublished,
  })

  if (result.error) {
    return { error: result.error }
  }

  revalidatePath("/products")
  revalidatePath("/")
  return { success: true, product: result.data?.product }
}

export async function updateProductAction(id: string, formData: FormData) {
  const title = formData.get("title")?.toString().trim()
  const description = formData.get("description")?.toString().trim()
  const priceStr = formData.get("price")?.toString()
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

  revalidatePath("/products")
  revalidatePath("/")
  return { success: true }
}

export async function deleteProductAction(id: string) {
  const result = await deleteProduct(id)
  if (result.error) {
    return { error: result.error }
  }
  revalidatePath("/products")
  revalidatePath("/")
  return { success: true }
}

export async function createCategoryAction(formData: FormData) {
  const name = formData.get("name")?.toString().trim()
  const description = formData.get("description")?.toString().trim()

  if (!name) {
    return { error: "Category name is required." }
  }

  const result = await createCategory({ name, description })
  if (result.error) {
    return { error: result.error }
  }

  revalidatePath("/categories")
  revalidatePath("/products")
  return { success: true }
}

export async function updateCategoryAction(id: string, formData: FormData) {
  const name = formData.get("name")?.toString().trim()
  const description = formData.get("description")?.toString().trim()

  if (!name) {
    return { error: "Category name is required." }
  }

  const result = await updateCategory(id, { name, description })
  if (result.error) {
    return { error: result.error }
  }

  revalidatePath("/categories")
  return { success: true }
}

export async function deleteCategoryAction(id: string) {
  const result = await deleteCategory(id)
  if (result.error) {
    return { error: result.error }
  }
  revalidatePath("/categories")
  return { success: true }
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  const result = await updateOrderStatus(orderId, status)
  if (result.error) {
    return { error: result.error }
  }
  revalidatePath(`/orders/${orderId}`)
  revalidatePath("/orders")
  return { success: true }
}
