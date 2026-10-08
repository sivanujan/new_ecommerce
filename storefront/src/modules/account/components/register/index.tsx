"use client"

import { useState, useMemo, useRef, useEffect, useTransition } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  sendRegistrationOtp,
  verifyOtpAndRegister,
  resendRegistrationOtp,
} from "@lib/data/auth-otp"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register({ setCurrentView }: Props) {
  // Step state: "FORM" (fill details) or "OTP" (verify 6-digit code)
  const [step, setStep] = useState<"FORM" | "OTP">("FORM")

  // Form field state for real-time validation
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  })

  // Track touched fields for polite, non-intrusive validation
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // OTP State: 6 individual digit values
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""])
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Loading & error states
  const [isSendingOtp, startSendingOtp] = useTransition()
  const [isVerifyingOtp, startVerifyingOtp] = useTransition()
  const [isResendingOtp, startResendingOtp] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successNotice, setSuccessNotice] = useState<string | null>(null)

  // Resend countdown timer
  const [cooldown, setCooldown] = useState<number>(60)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (step === "OTP" && cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [step, cooldown])

  // Focus the first OTP box when entering OTP view
  useEffect(() => {
    if (step === "OTP") {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus()
      }, 100)
    }
  }, [step])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  // Password rule checks
  const passwordLengthValid = formData.password.length >= 8
  const passwordHasLetter = /[A-Za-z]/.test(formData.password)
  const passwordHasNumber = /[0-9]/.test(formData.password)
  const passwordHasSpecial = /[^A-Za-z0-9]/.test(formData.password)
  const passwordRulesMet = passwordLengthValid && passwordHasLetter && passwordHasNumber

  // Passwords match check
  const passwordsMatch =
    formData.confirm_password.length > 0 &&
    formData.password === formData.confirm_password

  // Password strength scoring
  const passwordStrength = useMemo(() => {
    if (!formData.password) return { score: 0, label: "", color: "" }

    let score = 0
    if (formData.password.length >= 8) score += 1
    if (formData.password.length >= 12) score += 1
    if (passwordHasLetter && passwordHasNumber) score += 1
    if (passwordHasSpecial) score += 1

    if (!passwordLengthValid || score <= 1) {
      return { score: 1, label: "Weak", color: "bg-rose-500", text: "text-rose-400" }
    }
    if (score <= 3) {
      return { score: 2, label: "Medium", color: "bg-[#E5C378]", text: "text-[#E5C378]" }
    }
    return { score: 3, label: "Strong", color: "bg-emerald-400", text: "text-emerald-400" }
  }, [formData.password, passwordLengthValid, passwordHasLetter, passwordHasNumber, passwordHasSpecial])

  // Field validity checks
  const isFirstNameValid = formData.first_name.trim().length > 0
  const isLastNameValid = formData.last_name.trim().length > 0
  const isEmailValid = EMAIL_REGEX.test(formData.email.trim())

  // Overall form validity
  const isFormValid =
    isFirstNameValid &&
    isLastNameValid &&
    isEmailValid &&
    passwordRulesMet &&
    passwordsMatch

  // Inline error messages
  const firstNameError =
    touched.first_name && !isFirstNameValid
      ? "First name is required."
      : undefined

  const lastNameError =
    touched.last_name && !isLastNameValid
      ? "Last name is required."
      : undefined

  const emailError =
    touched.email && !isEmailValid
      ? formData.email.trim().length === 0
        ? "Email address is required."
        : "Please enter a valid email address."
      : undefined

  const passwordError =
    touched.password && !passwordRulesMet
      ? "Password must be at least 8 characters with letters & numbers."
      : undefined

  const confirmPasswordError =
    touched.confirm_password && !passwordsMatch
      ? formData.confirm_password.length === 0
        ? "Please confirm your password."
        : "Passwords do not match."
      : undefined

  // Handler: Submit Step 1 (Send OTP)
  const handleInitiateRegistration = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || isSendingOtp) return

    setErrorMessage(null)
    setSuccessNotice(null)

    startSendingOtp(async () => {
      const res = await sendRegistrationOtp(formData)
      if (res.success) {
        setStep("OTP")
        setCooldown(60)
        setSuccessNotice(`Verification code sent to ${formData.email.trim()}`)
      } else {
        setErrorMessage(res.error || "Failed to send verification code. Please try again.")
      }
    })
  }

  // Handler: OTP Input Change (Single box + auto focus)
  const handleOtpDigitChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, "")
    if (!cleanVal) {
      const updated = [...otpDigits]
      updated[index] = ""
      setOtpDigits(updated)
      return
    }

    // Handle single digit input
    const char = cleanVal.slice(-1)
    const updated = [...otpDigits]
    updated[index] = char
    setOtpDigits(updated)

    // Auto advance to next input box
    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  // Handler: OTP Keydown for Backspace navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  // Handler: OTP Paste (Allow pasting complete 6-digit code)
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (!pasted) return

    const updated = [...otpDigits]
    for (let i = 0; i < pasted.length; i++) {
      updated[i] = pasted[i]
    }
    setOtpDigits(updated)

    const nextIndex = Math.min(pasted.length, 5)
    otpInputRefs.current[nextIndex]?.focus()
  }

  const isOtpComplete = otpDigits.every((d) => d.length === 1)

  // Handler: Submit Step 2 (Verify OTP & Register)
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isOtpComplete || isVerifyingOtp) return

    const fullCode = otpDigits.join("")
    setErrorMessage(null)
    setSuccessNotice(null)

    startVerifyingOtp(async () => {
      const res = await verifyOtpAndRegister(fullCode)
      if (!res.success) {
        setErrorMessage(res.error || "Verification failed. Please try again.")
      } else {
        // Successful verification automatically sets auth cookies and revalidates Next.js cache.
        // Reload / transition to dashboard will occur immediately.
      }
    })
  }

  // Handler: Resend OTP Code
  const handleResend = () => {
    if (cooldown > 0 || isResendingOtp) return

    setErrorMessage(null)
    setSuccessNotice(null)

    startResendingOtp(async () => {
      const res = await resendRegistrationOtp()
      if (res.success) {
        setCooldown(60)
        setSuccessNotice("A new 6-digit verification code has been sent to your email.")
        setOtpDigits(["", "", "", "", "", ""])
        otpInputRefs.current[0]?.focus()
      } else {
        setErrorMessage(res.error || "Failed to resend code. Please try again.")
      }
    })
  }

  return (
    <div
      className="relative max-w-lg w-full rounded-3xl bg-[#121215] border border-white/10 p-7 sm:p-10 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col items-center text-center font-sans overflow-hidden transition-all duration-300"
      data-testid="register-page"
    >
      {/* Subtle gold ambient glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#E5C378]/[0.08] blur-3xl" />

      {/* Eyebrow */}
      <div className="relative z-10 flex items-center gap-2 mb-2">
        <span className="w-4 h-px bg-[#E5C378]/60" />
        <span className="text-[11px] uppercase tracking-[0.25em] font-mono font-bold text-[#E5C378]">
          {step === "FORM" ? "Join The Atelier" : "Security Verification"}
        </span>
        <span className="w-4 h-px bg-[#E5C378]/60" />
      </div>

      {/* Heading */}
      <h1 className="relative z-10 font-display font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7] tracking-tight mb-2">
        {step === "FORM" ? "Create Your Account" : "Verify Your Email"}
      </h1>

      <p className="relative z-10 text-xs sm:text-sm text-neutral-300 max-w-sm mb-7 leading-relaxed">
        {step === "FORM" ? (
          "Join TamZen Atelier to access bespoke order tracking, saved addresses, and curated heritage pieces."
        ) : (
          <>
            We sent a 6-digit verification code to{" "}
            <strong className="text-[#E5C378] font-mono">{formData.email.trim()}</strong>. Enter it below to activate your account.
          </>
        )}
      </p>

      {/* Step Indicators */}
      <div className="relative z-10 flex items-center justify-center gap-3 mb-6 w-full max-w-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#E5C378] text-neutral-950 font-bold text-[11px] flex items-center justify-center font-mono">
            1
          </div>
          <span className="text-xs font-semibold text-neutral-300">Details</span>
        </div>
        <div className={`h-px w-10 transition-colors ${step === "OTP" ? "bg-[#E5C378]" : "bg-white/10"}`} />
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full font-bold text-[11px] flex items-center justify-center font-mono transition-colors ${
              step === "OTP"
                ? "bg-[#E5C378] text-neutral-950 shadow-[0_0_12px_rgba(229,195,120,0.5)]"
                : "bg-white/10 text-neutral-400"
            }`}
          >
            2
          </div>
          <span className={`text-xs font-semibold ${step === "OTP" ? "text-[#E5C378]" : "text-neutral-400"}`}>
            Verification
          </span>
        </div>
      </div>

      {/* STEP 1: Registration Form */}
      {step === "FORM" && (
        <form className="relative z-10 w-full flex flex-col" onSubmit={handleInitiateRegistration}>
          <div className="flex flex-col w-full gap-y-4">
            {/* First & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="first_name"
                required
                autoComplete="given-name"
                data-testid="first-name-input"
                value={formData.first_name}
                onChange={handleChange}
                onBlur={() => handleBlur("first_name")}
                error={firstNameError}
              />
              <Input
                label="Last Name"
                name="last_name"
                required
                autoComplete="family-name"
                data-testid="last-name-input"
                value={formData.last_name}
                onChange={handleChange}
                onBlur={() => handleBlur("last_name")}
                error={lastNameError}
              />
            </div>

            {/* Email Address */}
            <Input
              label="Email Address"
              name="email"
              required
              type="email"
              autoComplete="email"
              data-testid="email-input"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              error={emailError}
            />

            {/* Phone Number (Optional) */}
            <Input
              label="Phone Number (Optional)"
              name="phone"
              type="tel"
              autoComplete="tel"
              data-testid="phone-input"
              value={formData.phone}
              onChange={handleChange}
            />

            {/* Password */}
            <div className="flex flex-col w-full">
              <Input
                label="Password"
                name="password"
                required
                type="password"
                autoComplete="new-password"
                data-testid="password-input"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur("password")}
                error={passwordError}
              />

              {/* Password Strength Indicator */}
              {formData.password.length > 0 && (
                <div className="mt-2.5 flex flex-col gap-1.5 text-left animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-neutral-400">Password Strength:</span>
                    <span className={`font-bold uppercase tracking-wider ${passwordStrength.text}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 w-full h-1.5 rounded-full overflow-hidden bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        passwordStrength.score >= 1 ? passwordStrength.color : "bg-transparent"
                      }`}
                    />
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        passwordStrength.score >= 2 ? passwordStrength.color : "bg-transparent"
                      }`}
                    />
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        passwordStrength.score >= 3 ? passwordStrength.color : "bg-transparent"
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              name="confirm_password"
              required
              type="password"
              autoComplete="new-password"
              data-testid="confirm-password-input"
              value={formData.confirm_password}
              onChange={handleChange}
              onBlur={() => handleBlur("confirm_password")}
              error={confirmPasswordError}
            />

            {/* Password Requirements Checklist */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-left flex flex-col gap-2 mt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                Account Security Requirements
              </span>
              <div className="flex flex-col gap-1.5 text-xs font-sans">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-colors shrink-0 ${
                      passwordLengthValid
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-white/5 text-neutral-400 border border-white/10"
                    }`}
                  >
                    {passwordLengthValid ? "✓" : "•"}
                  </div>
                  <span className={passwordLengthValid ? "text-[#FDFBF7]" : "text-neutral-400"}>
                    At least 8 characters
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-colors shrink-0 ${
                      passwordHasLetter && passwordHasNumber
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-white/5 text-neutral-400 border border-white/10"
                    }`}
                  >
                    {passwordHasLetter && passwordHasNumber ? "✓" : "•"}
                  </div>
                  <span className={passwordHasLetter && passwordHasNumber ? "text-[#FDFBF7]" : "text-neutral-400"}>
                    Mix of letters and numbers
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-colors shrink-0 ${
                      passwordsMatch
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-white/5 text-neutral-400 border border-white/10"
                    }`}
                  >
                    {passwordsMatch ? "✓" : "•"}
                  </div>
                  <span className={passwordsMatch ? "text-[#FDFBF7]" : "text-neutral-400"}>
                    Passwords match
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Error notice */}
          {errorMessage && (
            <div className="mt-4">
              <ErrorMessage error={errorMessage} data-testid="register-error" />
            </div>
          )}

          {/* Legal notice */}
          <p className="text-center text-xs text-neutral-400 mt-5 leading-relaxed">
            By creating an account, you agree to TamZen Atelier&apos;s{" "}
            <LocalizedClientLink
              href="/contact"
              className="text-neutral-200 underline underline-offset-4 hover:text-[#E5C378] transition-colors"
            >
              Privacy Policy
            </LocalizedClientLink>{" "}
            and{" "}
            <LocalizedClientLink
              href="/contact"
              className="text-neutral-200 underline underline-offset-4 hover:text-[#E5C378] transition-colors"
            >
              Terms of Service
            </LocalizedClientLink>
            .
          </p>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={!isFormValid || isSendingOtp}
              data-testid="register-button"
              className="w-full py-4 px-6 rounded-full font-sans font-bold text-xs uppercase tracking-widest bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 hover:brightness-110 shadow-[0_4px_25px_rgba(229,195,120,0.35)] transition-all transform active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100 flex items-center justify-center gap-2"
            >
              {isSendingOtp ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-neutral-950" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <span>Continue to Verification &rarr;</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: OTP Verification Screen */}
      {step === "OTP" && (
        <form className="relative z-10 w-full flex flex-col items-center" onSubmit={handleVerifyOtp}>
          {/* Success banner */}
          {successNotice && (
            <div className="w-full mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-center gap-2">
              <span>✓</span>
              <span>{successNotice}</span>
            </div>
          )}

          {/* 6 Digit Input Boxes */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 my-4">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  otpInputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                onPaste={handleOtpPaste}
                data-testid={`otp-input-${index}`}
                className="w-11 sm:w-12 h-14 sm:h-16 text-center text-xl sm:text-2xl font-mono font-bold text-[#FDFBF7] bg-[#18181D] border border-white/20 rounded-xl focus:border-[#E5C378] focus:ring-2 focus:ring-[#E5C378]/30 focus:outline-none transition-all shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
              />
            ))}
          </div>

          <p className="text-xs text-neutral-400 mt-2 mb-4 font-mono">
            Check your inbox & spam folder for the code from{" "}
            <span className="text-[#E5C378]">verify@tamzen.shop</span>
          </p>

          {/* Error banner */}
          {errorMessage && (
            <div className="w-full mb-4">
              <ErrorMessage error={errorMessage} data-testid="otp-error" />
            </div>
          )}

          {/* Verify Button */}
          <button
            type="submit"
            disabled={!isOtpComplete || isVerifyingOtp}
            data-testid="verify-otp-button"
            className="w-full py-4 px-6 rounded-full font-sans font-bold text-xs uppercase tracking-widest bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 hover:brightness-110 shadow-[0_4px_25px_rgba(229,195,120,0.35)] transition-all transform active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100 flex items-center justify-center gap-2 mb-4"
          >
            {isVerifyingOtp ? (
              <>
                <svg className="animate-spin h-4 w-4 text-neutral-950" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Verifying & Entering Dashboard...</span>
              </>
            ) : (
              <span>Verify & Access Dashboard</span>
            )}
          </button>

          {/* Resend Code / Countdown */}
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 mt-2">
            <span>Didn&apos;t receive the code?</span>
            {cooldown > 0 ? (
              <span className="font-mono text-[#E5C378]">Resend in {cooldown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResendingOtp}
                className="text-[#E5C378] hover:text-[#F3D798] font-semibold underline underline-offset-4 cursor-pointer disabled:opacity-50"
              >
                {isResendingOtp ? "Sending..." : "Resend Code"}
              </button>
            )}
          </div>

          {/* Go back to edit email button */}
          <button
            type="button"
            onClick={() => {
              setStep("FORM")
              setErrorMessage(null)
              setSuccessNotice(null)
            }}
            className="text-xs text-neutral-400 hover:text-neutral-200 mt-5 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>&larr;</span>
            <span>Edit details or change email</span>
          </button>
        </form>
      )}

      {/* Already a member */}
      <div className="relative z-10 text-center text-xs text-neutral-400 mt-8 pt-6 border-t border-white/10 w-full">
        <span>Already a member?</span>{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="text-[#E5C378] hover:text-[#F3D798] font-semibold underline underline-offset-4 ml-1 transition-colors cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </div>
  )
}
