import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { sendEmail } from "../utils/resend"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderId = data.id
  console.log(`[OrderPlaced Subscriber] Processing order receipt for ID: ${orderId}`)

  try {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "currency_code",
        "total",
        "subtotal",
        "tax_total",
        "shipping_total",
        "discount_total",
        "created_at",
        "items.*",
        "shipping_address.*",
        "customer.*",
      ],
      filters: { id: orderId },
    })

    const order = orders?.[0]
    if (!order || !order.email) {
      console.warn(`[OrderPlaced Subscriber] No order or email found for order ${orderId}`)
      return
    }

    const currency = (order.currency_code || "EUR").toUpperCase()
    const displayId = order.display_id || order.id.slice(-6)
    const customerName =
      order.shipping_address?.first_name ||
      order.customer?.first_name ||
      "Valued Customer"

    const formattedDate = new Date(order.created_at || Date.now()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

    // Format currency amount helper
    const fmt = (amount?: number | null) => {
      const val = typeof amount === "number" ? amount : 0
      return `${currency} ${val.toFixed(2)}`
    }

    // Build items HTML table rows
    const itemsHtml = (order.items || [])
      .map((item: any) => {
        const itemTitle = item.title || item.product_title || "TamZen Jewelry Creation"
        const variantTitle = item.variant_title ? ` (${item.variant_title})` : ""
        const quantity = item.quantity || 1
        const unitPrice = fmt(item.unit_price)
        const lineTotal = fmt(item.total || (item.unit_price ? item.unit_price * quantity : 0))
        const thumbnail = item.thumbnail || "https://tamzen.shop/logo-icon.svg"

        return `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 16px 8px; vertical-align: middle;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width: 50px; height: 50px; border-radius: 8px; overflow: hidden; background-color: #1a1a1f; border: 1px solid rgba(255,255,255,0.1); text-align: center;">
                    <img src="${thumbnail}" alt="${itemTitle}" width="50" height="50" style="object-fit: cover; display: block;" />
                  </td>
                  <td style="padding-left: 14px;">
                    <div style="font-family: Georgia, serif; font-size: 14px; font-weight: bold; color: #FDFBF7; line-height: 1.3;">
                      ${itemTitle}
                    </div>
                    <div style="font-family: monospace; font-size: 11px; color: #E5C378; margin-top: 3px;">
                      Qty: ${quantity}${variantTitle}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
            <td style="padding: 16px 8px; text-align: right; vertical-align: middle; font-family: monospace; font-size: 14px; font-weight: bold; color: #E5C378;">
              ${lineTotal}
            </td>
          </tr>
        `
      })
      .join("")

    const addressHtml = order.shipping_address
      ? `
        <div style="font-size: 13px; color: #a1a1aa; line-height: 1.6; margin-top: 6px;">
          ${order.shipping_address.first_name || ""} ${order.shipping_address.last_name || ""}<br />
          ${order.shipping_address.address_1 || ""}<br />
          ${order.shipping_address.city || ""}, ${order.shipping_address.postal_code || ""}<br />
          ${order.shipping_address.country_code ? order.shipping_address.country_code.toUpperCase() : ""}
        </div>
      `
      : `<div style="font-size: 13px; color: #a1a1aa;">Standard Shipping</div>`

    // Complete luxury TamZen dark email template
    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>TamZen Order Confirmation</title>
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

          <!-- Receipt Hero Notice -->
          <tr>
            <td style="padding: 32px 30px 20px 30px; text-align: center;">
              <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; border-radius: 50%; background-color: rgba(229,195,120,0.1); border: 1px solid #E5C378; color: #E5C378; font-size: 20px; margin-bottom: 14px;">
                ✓
              </div>
              <h1 style="font-family: Georgia, serif; font-size: 22px; font-weight: bold; color: #FDFBF7; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em;">
                Order Confirmed
              </h1>
              <p style="font-size: 13px; color: #a1a1aa; line-height: 1.6; margin: 0;">
                Thank you for your creation order, <strong style="color: #FDFBF7;">${customerName}</strong>. We are preparing your heritage jewelry piece for shipment.
              </p>
            </td>
          </tr>

          <!-- Order Summary Meta Box -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <table width="100%" cellpadding="12" cellspacing="0" border="0" style="background-color: #17171C; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
                <tr>
                  <td style="font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.1em; font-family: monospace;">Order Number</td>
                  <td style="font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.1em; font-family: monospace; text-align: right;">Date</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; font-weight: bold; color: #E5C378; font-family: monospace;">#${displayId}</td>
                  <td style="font-size: 13px; color: #FDFBF7; text-align: right; font-family: monospace;">${formattedDate}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${itemsHtml}
              </table>
            </td>
          </tr>

          <!-- Totals Calculation -->
          <tr>
            <td style="padding: 0 30px 24px 30px;">
              <table width="100%" cellpadding="6" cellspacing="0" border="0" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;">
                <tr>
                  <td style="font-size: 13px; color: #a1a1aa;">Subtotal</td>
                  <td style="font-size: 13px; color: #FDFBF7; text-align: right; font-family: monospace;">${fmt(order.subtotal)}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #a1a1aa;">Shipping</td>
                  <td style="font-size: 13px; color: #FDFBF7; text-align: right; font-family: monospace;">${fmt(order.shipping_total)}</td>
                </tr>
                ${
                  order.tax_total
                    ? `
                  <tr>
                    <td style="font-size: 13px; color: #a1a1aa;">Tax</td>
                    <td style="font-size: 13px; color: #FDFBF7; text-align: right; font-family: monospace;">${fmt(order.tax_total)}</td>
                  </tr>
                `
                    : ""
                }
                <tr>
                  <td style="font-size: 16px; font-weight: bold; color: #FDFBF7; padding-top: 10px; font-family: Georgia, serif;">Total Paid</td>
                  <td style="font-size: 18px; font-weight: bold; color: #E5C378; text-align: right; padding-top: 10px; font-family: monospace;">${fmt(order.total)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Address Box -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #17171C; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 16px;">
                <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #E5C378; letter-spacing: 0.15em; font-family: monospace;">
                  Shipping Destination
                </div>
                ${addressHtml}
              </div>
            </td>
          </tr>

          <!-- View Online Button -->
          <tr>
            <td style="padding: 0 30px 36px 30px; text-align: center;">
              <a href="https://tamzen.shop/account/orders" style="display: inline-block; background: linear-gradient(135deg, #F3D798 0%, #E5C378 50%, #C99C47 100%); color: #000000; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.18em; padding: 14px 32px; border-radius: 30px; box-shadow: 0 4px 20px rgba(229,195,120,0.35);">
                View Order Status &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 30px; text-align: center; background-color: #0E0E11; border-top: 1px solid rgba(255,255,255,0.08);">
              <p style="font-size: 11px; color: #71717a; margin: 0 0 6px 0;">
                Questions about your order? Reply to this email or reach us at <a href="mailto:notification@tamzen.shop" style="color: #E5C378; text-decoration: none;">notification@tamzen.shop</a>
              </p>
              <p style="font-size: 10px; color: #52525b; margin: 0; font-family: monospace;">
                TamZen • Bespoke 316L Stainless Steel Jewelry • tamzen.shop
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

    // 1. Send luxury confirmation receipt to the customer
    await sendEmail({
      from: "TamZen Orders <notification@tamzen.shop>",
      to: order.email,
      subject: `Order Confirmation — TamZen (#${displayId})`,
      html: emailHtml,
      text: `Thank you for your order #${displayId}, ${customerName}! Total paid: ${fmt(order.total)}. View your order at https://tamzen.shop/account/orders`,
    })

    // 2. Send new order notification to store admin (nishaned129@gmail.com)
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "nishaned129@gmail.com"
    await sendEmail({
      from: "TamZen Orders <notification@tamzen.shop>",
      to: adminEmail,
      subject: `🔔 [NEW ORDER] #${displayId} — ${customerName} (${fmt(order.total)})`,
      html: emailHtml,
      text: `New order #${displayId} placed by ${customerName} (${order.email})! Total: ${fmt(order.total)}.`,
    })
    console.log(`[OrderPlaced Subscriber] Dispatched admin order notification to ${adminEmail}`)
  } catch (error) {
    console.error(`[OrderPlaced Subscriber] Error processing order receipt for ${orderId}:`, error)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
