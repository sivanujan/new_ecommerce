import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { name, email, subject, message } = body

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Please provide your name." },
        { status: 400 }
      )
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      )
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Please enter your message." },
        { status: 400 }
      )
    }

    // Placeholder: ready to wire with Resend, SendGrid, or Medusa notification service
    // e.g., await resend.emails.send({ from: 'onboarding@resend.dev', to: 'contact@tamzen.com', subject, text: message })

    return NextResponse.json({
      success: true,
      message: "Thanks — we'll get back to you soon.",
    })
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
  }
}
