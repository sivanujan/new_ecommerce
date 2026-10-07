import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("tamzen_admin_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const files = formData.getAll("files")

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const medusaFormData = new FormData()
    for (const file of files) {
      medusaFormData.append("files", file)
    }

    const res = await fetch(`${BACKEND_URL}/admin/uploads`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: medusaFormData,
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to upload to Medusa file storage" },
        { status: res.status }
      )
    }

    // Return the uploaded URLs
    const urls = (data.files || []).map((f: any) => f.url)
    return NextResponse.json({ urls, files: data.files })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "File upload failed" },
      { status: 500 }
    )
  }
}
