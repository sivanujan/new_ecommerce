export interface SendEmailOptions {
  from?: string
  to: string | string[]
  subject: string
  html: string
  text?: string
}

export async function sendEmail({
  from = "TamZen <notification@tamzen.shop>",
  to,
  subject,
  html,
  text,
}: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: any }> {
  const apiKey =
    process.env.RESEND_API_KEY || "re_Muh9RHSr_DDXVY3DfFnshEmvtVBHTpUGt"

  const recipientList = Array.isArray(to) ? to : [to]

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: recipientList,
        subject,
        html,
        text,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error("[Resend] Email delivery failed:", data)
      return { success: false, error: data }
    }

    console.log(`[Resend] Email sent successfully to ${recipientList.join(", ")} (ID: ${data.id})`)
    return { success: true, id: data.id }
  } catch (error) {
    console.error("[Resend] Network error sending email:", error)
    return { success: false, error }
  }
}
