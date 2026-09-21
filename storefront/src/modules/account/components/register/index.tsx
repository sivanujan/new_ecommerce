"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div
      className="relative max-w-lg w-full rounded-3xl bg-gradient-to-b from-[#18181D] via-[#121215] to-[#0E0E10] border border-white/10 p-8 sm:p-12 shadow-2xl flex flex-col items-center text-center font-sans overflow-hidden"
      data-testid="register-page"
    >
      {/* Subtle gold ambient glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#E5C378]/10 blur-3xl" />

      {/* Eyebrow */}
      <div className="relative z-10 flex items-center gap-2 mb-2">
        <span className="w-4 h-px bg-[#E5C378]/60" />
        <span className="text-[11px] uppercase tracking-[0.2em] font-mono font-semibold text-[#E5C378]">
          Join The Atelier
        </span>
        <span className="w-4 h-px bg-[#E5C378]/60" />
      </div>

      {/* Bold Serif Heading */}
      <h1 className="relative z-10 font-display font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7] tracking-tight mb-2">
        Create Your Account
      </h1>
      <p className="relative z-10 text-xs sm:text-sm text-neutral-300 max-w-sm mb-8 leading-relaxed">
        Join TamZen Atelier to access bespoke order tracking, saved addresses, and curated heritage pieces.
      </p>

      {/* Form */}
      <form className="relative z-10 w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="first_name"
              required
              autoComplete="given-name"
              data-testid="first-name-input"
            />
            <Input
              label="Last Name"
              name="last_name"
              required
              autoComplete="family-name"
              data-testid="last-name-input"
            />
          </div>

          <Input
            label="Email Address"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />

          <Input
            label="Password"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>

        <div className="mt-2">
          <ErrorMessage error={message} data-testid="register-error" />
        </div>

        <p className="text-center text-xs text-neutral-400 mt-6 leading-relaxed">
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

        <div className="mt-6">
          <SubmitButton className="w-full" data-testid="register-button">
            Create Account
          </SubmitButton>
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

export default Register
