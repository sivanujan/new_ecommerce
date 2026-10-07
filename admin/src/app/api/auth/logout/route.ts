import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete("tamzen_admin_token")
  cookieStore.delete("tamzen_admin_email")
  return NextResponse.json({ success: true })
}
