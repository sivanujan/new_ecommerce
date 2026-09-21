"use client"

import { useActionState, useState, useMemo } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register({ setCurrentView }: Props) {
  const [message, formAction, isPending] = useActionState(signup, null)

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

  return (
    <div
      className="relative max-w-lg w-full rounded-3xl bg-[#121215] border border-white/10 p-7 sm:p-10 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col items-center text-center font-sans overflow-hidden"
      data-testid="register-page"
    >
      {/* Subtle gold ambient glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#E5C378]/[0.08] blur-3xl" />

      {/* Eyebrow */}
      <div className="relative z-10 flex items-center gap-2 mb-2">
        <span className="w-4 h-px bg-[#E5C378]/60" />
        <span className="text-[11px] uppercase tracking-[0.25em] font-mono font-bold text-[#E5C378]">
          Join The Atelier
        </span>
        <span className="w-4 h-px bg-[#E5C378]/60" />
      </div>

      {/* Bold Serif Heading */}
      <h1 className="relative z-10 font-display font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7] tracking-tight mb-2">
        Create Your Account
      </h1>
      <p className="relative z-10 text-xs sm:text-sm text-neutral-300 max-w-sm mb-7 leading-relaxed">
        Join TamZen Atelier to access bespoke order tracking, saved addresses, and curated heritage pieces.
      </p>

      {/* Form */}
      <form className="relative z-10 w-full flex flex-col" action={formAction}>
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
                {/* 3-segment strength bar */}
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
              {/* Length */}
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

              {/* Letters and numbers */}
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

              {/* Passwords Match */}
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

        {/* Server error announcement */}
        <div className="mt-3">
          <ErrorMessage error={message} data-testid="register-error" />
        </div>

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

        {/* Submit button with disabled & loading state */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={!isFormValid || isPending}
            data-testid="register-button"
            className="w-full py-4 px-6 rounded-full font-sans font-bold text-xs uppercase tracking-widest bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 hover:brightness-110 shadow-[0_4px_25px_rgba(229,195,120,0.35)] transition-all transform active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-4 w-4 text-neutral-950" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Creating Your Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </div>
      </form>

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
