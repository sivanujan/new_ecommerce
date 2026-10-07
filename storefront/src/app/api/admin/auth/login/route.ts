import { NextRequest, NextResponse } from "next/server"

const rawBackendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const BACKEND_URL = rawBackendUrl.replace(/\/+$/, "")

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const res = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    })

    const data = await res.json()

    if (!res.ok || !data.token) {
      return NextResponse.json(
        { error: data.message || "Invalid email or password" },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ success: true })

    response.cookies.set("tamzen_admin_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    })

    response.cookies.set("tamzen_admin_email", email, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    })

    return response
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to authenticate with backend" },
      { status: 500 }
    )
  }
}
