import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { sendEmail } from "../utils/resend"

export default async function customerCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const customerId = data.id
  console.log(`[CustomerCreated Subscriber] Processing welcome email for ID: ${customerId}`)

  try {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id", "email", "first_name", "last_name", "created_at"],
      filters: { id: customerId },
    })

    const customer = customers?.[0]
    if (!customer || !customer.email) {
      console.warn(`[CustomerCreated Subscriber] No customer or email found for ${customerId}`)
      return
    }

    const customerName = customer.first_name
      ? `${customer.first_name}`
      : "Valued Member"

    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Welcome to TamZen</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0B0B0C; color: #FDFBF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0B0B0C; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #121215; border: 1px solid rgba(229,195,120,0.3); border-radius: 16px; overflow: hidden; box-shadow: 0 15px 50px rgba(0,0,0,0.8);">
          
          <!-- Gold Header Banner -->
          <tr>
            <td style="padding: 32px 30px; text-align: center; background: linear-gradient(180deg, #18181D 0%, #121215 100%); border-bottom: 1px solid rgba(229,195,120,0.25);">
              <div style="font-family: Georgia, serif; font-size: 26px; font-weight: bold; letter-spacing: 0.15em; color: #FDFBF7; text-transform: uppercase;">
                TAMZEN
              </div>
              <div style="font-size: 10px; color: #E5C378; letter-spacing: 0.25em; text-transform: uppercase; margin-top: 4px; font-weight: 600;">
                எங்கள் வேர் எங்கள் அடையாளம் • Wear Your Roots
              </div>
            </td>
          </tr>

          <!-- Welcome Body -->
          <tr>
            <td style="padding: 36px 30px 24px 30px; text-align: center;">
              <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 50%; background-color: rgba(229,195,120,0.1); border: 1px solid #E5C378; color: #E5C378; font-size: 20px; margin-bottom: 16px;">
                ✦
              </div>
              <h1 style="font-family: Georgia, serif; font-size: 24px; font-weight: bold; color: #FDFBF7; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.05em;">
                Welcome to the Clan
              </h1>
              <p style="font-size: 14px; color: #d4d4d8; line-height: 1.7; margin: 0 0 20px 0;">
                Vanakkam, <strong style="color: #FDFBF7;">${customerName}</strong>! Your TamZen account is now verified and active.
              </p>
              <p style="font-size: 13px; color: #a1a1aa; line-height: 1.6; margin: 0;">
                You are now connected to a heritage collective forging diaspora identity in solid 316L stainless steel and radiant gold.
              </p>
            </td>
          </tr>

          <!-- Account Details Box -->
          <tr>
            <td style="padding: 0 30px 28px 30px;">
              <table width="100%" cellpadding="16" cellspacing="0" border="0" style="background-color: #17171C; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
                <tr>
                  <td style="font-size: 11px; color: #71717a; text-transform: uppercase; letter-spacing: 0.12em; font-family: monospace;">Registered Account</td>
                </tr>
                <tr>
                  <td style="font-size: 15px; font-weight: bold; color: #E5C378; font-family: monospace; padding-top: 4px;">
                    ${customer.email}
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #a1a1aa; padding-top: 8px; line-height: 1.5;">
                    ✓ Email verified &bull; Ready for checkout &bull; Track orders anytime
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Call to Action -->
          <tr>
            <td style="padding: 0 30px 36px 30px; text-align: center;">
              <a href="https://tamzen.shop/store" style="display: inline-block; background: linear-gradient(135deg, #F3D798 0%, #E5C378 50%, #C99C47 100%); color: #000000; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.18em; padding: 14px 32px; border-radius: 30px; box-shadow: 0 4px 20px rgba(229,195,120,0.35);">
                Explore The Collection &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 30px; text-align: center; background-color: #0E0E11; border-top: 1px solid rgba(255,255,255,0.08);">
              <p style="font-size: 11px; color: #71717a; margin: 0 0 6px 0;">
                Need help or custom engraving? Reach our concierge team at <a href="mailto:verify@tamzen.shop" style="color: #E5C378; text-decoration: none;">verify@tamzen.shop</a>
              </p>
              <p style="font-size: 10px; color: #52525b; margin: 0; font-family: monospace;">
                TamZen • Cultural Jewelry &bull; tamzen.shop
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    await sendEmail({
      from: "TamZen <verify@tamzen.shop>",
      to: customer.email,
      subject: "Welcome to TamZen — Your Roots, Your Identity",
      html: emailHtml,
      text: `Welcome to TamZen, ${customerName}! Your account (${customer.email}) is active. Explore our jewelry collection at https://tamzen.shop/store`,
    })
  } catch (error) {
    console.error(`[CustomerCreated Subscriber] Error sending welcome email for ${customerId}:`, error)
  }
}

export const config: SubscriberConfig = {
  event: "customer.created",
}
