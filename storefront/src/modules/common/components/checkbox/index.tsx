import React from "react"

type CheckboxProps = {
  checked?: boolean
  onChange?: () => void
  label: string
  name?: string
  'data-testid'?: string
}

const CheckboxWithLabel: React.FC<CheckboxProps> = ({
  checked = true,
  onChange,
  label,
  name = "checkbox",
  'data-testid': dataTestId,
}) => {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer group select-none py-1">
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          data-testid={dataTestId}
          className="peer sr-only"
        />
        <div className="w-5 h-5 rounded-md border border-white/25 bg-white/[0.04] peer-checked:bg-[#E5C378] peer-checked:border-[#E5C378] group-hover:border-[#E5C378]/70 transition-all flex items-center justify-center shadow-sm">
          <svg
            className={`w-3.5 h-3.5 text-neutral-950 transition-all duration-200 ${
              checked ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <span className="text-sm font-sans text-neutral-200 group-hover:text-white transition-colors">
        {label}
      </span>
    </label>
  )
}

export default CheckboxWithLabel
