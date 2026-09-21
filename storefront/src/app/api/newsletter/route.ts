import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { email } = body

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      )
    }

    // Ready for integration with email services like Resend, Mailchimp, or Klaviyo
    // e.g., await resend.contacts.create({ email, audienceId: process.env.RESEND_AUDIENCE_ID })

    return NextResponse.json({
      success: true,
      message: "Thanks — you're on the list!",
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
