import React, { useEffect, useImperativeHandle, useState } from "react"
import Eye from "@modules/common/icons/eye"
import EyeOff from "@modules/common/icons/eye-off"

type InputProps = Omit<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
  "placeholder"
> & {
  label: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  name: string
  topLabel?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, name, label, touched, required, topLabel, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [inputType, setInputType] = useState(type)

    useEffect(() => {
      if (type === "password" && showPassword) {
        setInputType("text")
      }

      if (type === "password" && !showPassword) {
        setInputType("password")
      }
    }, [type, showPassword])

    useImperativeHandle(ref, () => inputRef.current!)

    return (
      <div className="flex flex-col w-full font-sans">
        {topLabel && (
          <label className="mb-2 text-xs font-mono uppercase tracking-wider text-neutral-300 font-medium">
            {topLabel}
          </label>
        )}
        <div className="flex relative z-0 w-full">
          <input
            type={inputType}
            name={name}
            id={name}
            placeholder=" "
            required={required}
            className="peer pt-4 pb-1 block w-full h-12 px-4 bg-white/[0.04] border border-white/15 rounded-xl appearance-none text-white text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#E5C378]/40 focus:border-[#E5C378] hover:border-white/30 transition-all placeholder-transparent"
            {...props}
            ref={inputRef}
          />
          <label
            htmlFor={name}
            onClick={() => inputRef.current?.focus()}
            className="pointer-events-none absolute left-4 top-3.5 text-neutral-400 text-sm transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-[#E5C378] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider peer-[:not(:placeholder-shown)]:text-neutral-300 flex items-center gap-1"
          >
            <span>{label}</span>
            {required && <span className="text-[#E5C378]">*</span>}
          </label>
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-neutral-400 hover:text-[#E5C378] px-4 focus:outline-none transition-colors absolute right-0 top-3.5 z-10"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          )}
        </div>
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
