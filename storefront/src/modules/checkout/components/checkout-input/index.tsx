import React, { forwardRef, useState } from "react"
import Eye from "@modules/common/icons/eye"
import EyeOff from "@modules/common/icons/eye-off"

type CheckoutInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  name: string
  required?: boolean
  error?: string
}

const CheckoutInput = forwardRef<HTMLInputElement, CheckoutInputProps>(
  ({ label, name, type = "text", required, error, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const inputType = type === "password" ? (showPassword ? "text" : "password") : type

    return (
      <div className="flex flex-col w-full text-left">
        <label
          htmlFor={name}
          className="text-xs uppercase tracking-wider font-medium text-neutral-300 mb-1.5 flex items-center gap-1"
        >
          <span>{label}</span>
          {required && <span className="text-[#E5C378] font-bold">*</span>}
        </label>
        <div className="relative w-full">
          <input
            id={name}
            name={name}
            type={inputType}
            ref={ref}
            required={required}
            {...props}
            value={props.value !== undefined ? (props.value ?? "") : props.defaultValue}
            className={`w-full h-11 px-4 rounded-xl bg-[#121215] text-[#FDFBF7] border border-white/15 placeholder:text-neutral-500 text-sm font-sans focus:outline-none focus:bg-[#151519] focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378]/40 hover:border-white/30 transition-all ${
              error ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30 text-rose-100" : ""
            } ${className}`}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          )}
        </div>
        {error && <span className="text-xs text-rose-400 mt-1">{error}</span>}
      </div>
    )
  }
)

CheckoutInput.displayName = "CheckoutInput"

export default CheckoutInput
