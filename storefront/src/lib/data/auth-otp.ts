"use server"

import crypto from "crypto"
import { cookies as nextCookies } from "next/headers"
import { revalidateTag } from "next/cache"
import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheTag, setAuthToken } from "./cookies"
import { transferCart } from "./customer"

const OTP_COOKIE_NAME = "_tamzen_reg_otp"
const OTP_SECRET = process.env.REVALIDATE_SECRET || "tamzen-heritage-secure-otp-key-2026"
const RESEND_API_KEY = process.env.RESEND_API_KEY || "re_Muh9RHSr_DDXVY3DfFnshEmvtVBHTpUGt"

interface PendingRegistration {
  email: string
  first_name: string
  last_name: string
  phone?: string
  password: string
  otp: string
  createdAt: number
  expiresAt: number
  attempts: number
}

// Encrypt payload using AES-256-GCM
function encryptPayload(data: PendingRegistration): string {
  const key = crypto.createHash("sha256").update(OTP_SECRET).digest()
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)
  
  const text = JSON.stringify(data)
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  const authTag = cipher.getAuthTag().toString("hex")
  
  return `${iv.toString("hex")}:${authTag}:${encrypted}`
}

// Decrypt payload using AES-256-GCM
function decryptPayload(encryptedStr: string): PendingRegistration | null {
  try {
    const parts = encryptedStr.split(":")
    if (parts.length !== 3) return null
    const [ivHex, authTagHex, encrypted] = parts
    
    const key = crypto.createHash("sha256").update(OTP_SECRET).digest()
    const iv = Buffer.from(ivHex, "hex")
    const authTag = Buffer.from(authTagHex, "hex")
    
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
    decipher.setAuthTag(authTag)
    
    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")
    
    return JSON.parse(decrypted) as PendingRegistration
  } catch (err) {
    return null
  }
}

// Send OTP email via Resend
async function dispatchOtpEmail(toEmail: string, firstName: string, otp: string): Promise<boolean> {
  const digits = otp.split("")
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Your TamZen Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0B0B0C; color: #FDFBF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0B0B0C; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="560" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; background-color: #121215; border: 1px solid rgba(229,195,120,0.3); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.85);">
          
          <!-- Header -->
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

          <!-- Body -->
          <tr>
            <td style="padding: 36px 32px 20px 32px; text-align: center;">
              <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; border-radius: 50%; background-color: rgba(229,195,120,0.12); border: 1px solid #E5C378; color: #E5C378; font-size: 18px; margin-bottom: 16px;">
                ✦
              </div>
              <h1 style="font-family: Georgia, serif; font-size: 24px; font-weight: bold; color: #FDFBF7; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.05em;">
                Account Verification
              </h1>
              <p style="font-size: 14px; color: #d4d4d8; line-height: 1.6; margin: 0 0 24px 0;">
                Vanakkam <strong style="color: #FDFBF7;">${firstName || "Member"}</strong>, please use the 6-digit verification code below to verify your account registration.
              </p>
            </td>
          </tr>

          <!-- 6-Digit OTP Box -->
          <tr>
            <td style="padding: 0 32px 28px 32px;" align="center">
              <table cellpadding="0" cellspacing="6" border="0" style="margin: 0 auto;">
                <tr>
                  ${digits
                    .map(
                      (d) => `
                    <td style="width: 48px; height: 56px; background-color: #18181D; border: 1.5px solid #E5C378; border-radius: 10px; text-align: center; vertical-align: middle; font-family: monospace; font-size: 26px; font-weight: bold; color: #FDFBF7; box-shadow: 0 4px 15px rgba(229,195,120,0.2);">
                      ${d}
                    </td>`
                    )
                    .join("")}
                </tr>
              </table>
              <div style="font-size: 12px; color: #a1a1aa; margin-top: 14px; font-family: monospace;">
                This code expires in <strong style="color: #E5C378;">10 minutes</strong>.
              </div>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="padding: 0 32px 30px 32px; text-align: center;">
              <div style="padding: 14px 18px; background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; font-size: 12px; color: #71717a; line-height: 1.5;">
                Never share this verification code with anyone. TamZen team members will never ask for your code.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 22px 30px; text-align: center; background-color: #0E0E11; border-top: 1px solid rgba(255,255,255,0.08);">
              <p style="font-size: 11px; color: #71717a; margin: 0 0 6px 0;">
                Did not create an account? You can safely disregard this email.
              </p>
              <p style="font-size: 10px; color: #52525b; margin: 0; font-family: monospace;">
                TamZen Atelier • tamzen.shop
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

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "TamZen <verify@tamzen.shop>",
        to: [toEmail],
        subject: `Your TamZen Verification Code: ${otp}`,
        html,
        text: `Your TamZen verification code is ${otp}. It expires in 10 minutes. If you did not request this, please disregard.`,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error("[OTP Dispatch] Failed to send email via Resend:", errText)
      return false
    }

    const data = await res.json()
    console.log(`[OTP Dispatch] Sent OTP email to ${toEmail} (ID: ${data.id})`)
    return true
  } catch (error) {
    console.error("[OTP Dispatch] Error calling Resend API:", error)
    return false
  }
}

/**
 * Step 1: Request 6-digit OTP for Registration
 */
export async function sendRegistrationOtp(formData: {
  first_name: string
  last_name: string
  email: string
  phone?: string
  password: string
}): Promise<{ success: boolean; error?: string; email?: string }> {
  try {
    const email = formData.email.trim().toLowerCase()
    const firstName = formData.first_name.trim()
    const lastName = formData.last_name.trim()
    const password = formData.password

    if (!email || !email.includes("@")) {
      return { success: false, error: "Please enter a valid email address." }
    }
    if (!firstName || !lastName) {
      return { success: false, error: "First and last name are required." }
    }
    if (!password || password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters." }
    }

    // Generate 6-digit random code
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const pendingData: PendingRegistration = {
      email,
      first_name: firstName,
      last_name: lastName,
      phone: formData.phone || "",
      password,
      otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0,
    }

    const encryptedToken = encryptPayload(pendingData)

    // Save encrypted token in httpOnly cookie
    const cookieStore = await nextCookies()
    cookieStore.set(OTP_COOKIE_NAME, encryptedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 600, // 10 minutes
      path: "/",
    })

    // Send the email with the 6-digit OTP code
    const sent = await dispatchOtpEmail(email, firstName, otp)
    if (!sent) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`\n========================================\n[DEV OTP] Verification code for ${email} is: ${otp}\n========================================\n`)
        return { success: true, email }
      }
      return {
        success: false,
        error: "Failed to dispatch verification email. Please check the address or try again.",
      }
    }

    return { success: true, email }
  } catch (error: any) {
    console.error("[sendRegistrationOtp] Error:", error)
    return { success: false, error: error.message || "Failed to process verification code." }
  }
}

/**
 * Resend OTP (with 30-second cooldown protection)
 */
export async function resendRegistrationOtp(): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await nextCookies()
    const existingCookie = cookieStore.get(OTP_COOKIE_NAME)?.value
    if (!existingCookie) {
      return { success: false, error: "Session expired. Please fill out the registration form again." }
    }

    const pending = decryptPayload(existingCookie)
    if (!pending) {
      return { success: false, error: "Invalid session. Please register again." }
    }

    // Cooldown check (minimum 30s)
    const elapsed = Date.now() - pending.createdAt
    if (elapsed < 30 * 1000) {
      const waitSec = Math.ceil((30 * 1000 - elapsed) / 1000)
      return { success: false, error: `Please wait ${waitSec}s before requesting a new code.` }
    }

    // Generate fresh OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
    pending.otp = newOtp
    pending.createdAt = Date.now()
    pending.expiresAt = Date.now() + 10 * 60 * 1000
    pending.attempts = 0

    const updatedToken = encryptPayload(pending)
    cookieStore.set(OTP_COOKIE_NAME, updatedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 600,
      path: "/",
    })

    const sent = await dispatchOtpEmail(pending.email, pending.first_name, newOtp)
    if (!sent) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`\n========================================\n[DEV OTP RESEND] New verification code for ${pending.email} is: ${newOtp}\n========================================\n`)
        return { success: true }
      }
      return { success: false, error: "Could not send verification email. Please try again." }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to resend code." }
  }
}

/**
 * Step 2: Verify 6-digit OTP and complete Medusa account registration & login
 */
export async function verifyOtpAndRegister(
  enteredOtp: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanOtp = enteredOtp.trim().replace(/\D/g, "")
    if (cleanOtp.length !== 6) {
      return { success: false, error: "Please enter the full 6-digit verification code." }
    }

    const cookieStore = await nextCookies()
    const existingCookie = cookieStore.get(OTP_COOKIE_NAME)?.value
    if (!existingCookie) {
      return {
        success: false,
        error: "Verification session expired. Please submit the registration form again.",
      }
    }

    const pending = decryptPayload(existingCookie)
    if (!pending) {
      return {
        success: false,
        error: "Invalid verification session. Please restart registration.",
      }
    }

    // Expiry check
    if (Date.now() > pending.expiresAt) {
      cookieStore.delete(OTP_COOKIE_NAME)
      return {
        success: false,
        error: "This verification code has expired. Please request a new code.",
      }
    }

    // Attempt limit check
    if (pending.attempts >= 5) {
      cookieStore.delete(OTP_COOKIE_NAME)
      return {
        success: false,
        error: "Too many incorrect attempts. For security, please start registration again.",
      }
    }

    // OTP match check
    if (pending.otp !== cleanOtp) {
      pending.attempts += 1
      const updatedToken = encryptPayload(pending)
      cookieStore.set(OTP_COOKIE_NAME, updatedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: Math.max(1, Math.floor((pending.expiresAt - Date.now()) / 1000)),
        path: "/",
      })

      const remaining = 5 - pending.attempts
      return {
        success: false,
        error: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
      }
    }

    // --- OTP VERIFIED SUCCESSFULLY ---
    // Now create and authenticate customer in Medusa
    const customerForm = {
      email: pending.email,
      first_name: pending.first_name,
      last_name: pending.last_name,
      phone: pending.phone || "",
    }

    try {
      const token = await sdk.auth.register("customer", "emailpass", {
        email: customerForm.email,
        password: pending.password,
      })

      await setAuthToken(token as string)

      const headers = {
        ...(await getAuthHeaders()),
      }

      await sdk.store.customer.create(customerForm, {}, headers)

      const loginToken = await sdk.auth.login("customer", "emailpass", {
        email: customerForm.email,
        password: pending.password,
      })

      await setAuthToken(loginToken as string)

      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)

      await transferCart()

      // Clean up the OTP cookie once successfully registered & logged in
      cookieStore.delete(OTP_COOKIE_NAME)

      return { success: true }
    } catch (authError: any) {
      console.error("[verifyOtpAndRegister] Medusa registration error:", authError)
      const errStr = authError?.message || authError?.toString() || ""
      if (errStr.includes("already exists") || errStr.includes("duplicate")) {
        return {
          success: false,
          error: "An account with this email address already exists. Please sign in instead.",
        }
      }
      return {
        success: false,
        error: `Registration could not be completed: ${errStr || "Unknown error"}. Please try again.`,
      }
    }
  } catch (error: any) {
    console.error("[verifyOtpAndRegister] Unexpected error:", error)
    return { success: false, error: error.message || "An unexpected error occurred during verification." }
  }
}
