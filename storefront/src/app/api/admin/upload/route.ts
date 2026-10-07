import { NextRequest, NextResponse } from "next/server"

const rawBackendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const BACKEND_URL = rawBackendUrl.replace(/\/+$/, "")

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("tamzen_admin_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()

    const medusaRes = await fetch(`${BACKEND_URL}/admin/uploads`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    const data = await medusaRes.json()

    if (!medusaRes.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to upload file to Medusa" },
        { status: medusaRes.status }
      )
    }

    // In Medusa v2, /admin/uploads returns { files: [{ id, url }] }
    const urls = (data.files || []).map((f: any) => f.url)
    return NextResponse.json({ urls, files: data.files })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error during upload" },
      { status: 500 }
    )
  }
}
