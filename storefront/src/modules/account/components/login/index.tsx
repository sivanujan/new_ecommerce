"use client"

import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="relative max-w-md w-full rounded-3xl bg-[#121215] border border-white/10 p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col items-center text-center font-sans overflow-hidden"
      data-testid="login-page"
    >
      {/* Subtle gold ambient glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-[#E5C378]/10 blur-3xl" />

      {/* Eyebrow */}
      <div className="relative z-10 flex items-center gap-2 mb-2">
        <span className="w-4 h-px bg-[#E5C378]/60" />
        <span className="text-[11px] uppercase tracking-[0.2em] font-mono font-semibold text-[#E5C378]">
          Client Access • TamZen
        </span>
        <span className="w-4 h-px bg-[#E5C378]/60" />
      </div>

      {/* Bold Serif Heading */}
      <h1 className="relative z-10 font-display font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7] tracking-tight mb-2">
        Welcome Back
      </h1>
      <p className="relative z-10 text-xs sm:text-sm text-neutral-300 max-w-xs mb-8 leading-relaxed">
        Sign in to access your curated collections, saved addresses, and order history.
      </p>

      {/* Form */}
      <form className="relative z-10 w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-4">
          <Input
            label="Email Address"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>

        <div className="mt-2">
          <ErrorMessage error={message} data-testid="login-error-message" />
        </div>

        <div className="mt-6">
          <SubmitButton data-testid="sign-in-button" className="w-full">
            Sign In
          </SubmitButton>
        </div>
      </form>

      {/* Not a member */}
      <div className="relative z-10 text-center text-xs text-neutral-400 mt-8 pt-6 border-t border-white/10 w-full">
        <span>Not a member yet?</span>{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="text-[#E5C378] hover:text-[#F3D798] font-semibold underline underline-offset-4 ml-1 transition-colors cursor-pointer"
          data-testid="register-button"
        >
          Join Us
        </button>
      </div>
    </div>
  )
}

export default Login
