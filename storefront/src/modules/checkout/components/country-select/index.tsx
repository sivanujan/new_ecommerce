import { forwardRef, useImperativeHandle, useMemo, useRef } from "react"
import { HttpTypes } from "@medusajs/types"

type CountrySelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  region?: HttpTypes.StoreRegion
  placeholder?: string
  label?: string
}

const CountrySelect = forwardRef<HTMLSelectElement, CountrySelectProps>(
  (
    {
      placeholder = "Select Country",
      region,
      defaultValue,
      value,
      label = "Country",
      required,
      name,
      ...props
    },
    ref
  ) => {
    const innerRef = useRef<HTMLSelectElement>(null)

    useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
      ref,
      () => innerRef.current
    )

    const countryOptions = useMemo(() => {
      if (!region || !region.countries) {
        return []
      }

      return region.countries
        .map((country) => ({
          value: country.iso_2?.toLowerCase(),
          label: country.display_name || country.iso_2?.toUpperCase() || "",
        }))
        .filter((c) => Boolean(c.value && c.label))
        .sort((a, b) => a.label.localeCompare(b.label))
    }, [region])

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
          <select
            id={name}
            name={name}
            ref={innerRef}
            required={required}
            {...props}
            {...(value !== undefined ? { value: value ?? "" } : defaultValue !== undefined ? { defaultValue } : { value: "" })}
            className="w-full h-11 px-4 pr-10 rounded-xl bg-[#121215] border border-white/15 text-white text-sm font-sans appearance-none focus:outline-none focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] hover:border-white/30 transition-all cursor-pointer"
          >
            <option disabled value="" className="bg-[#121215] text-neutral-500">
              {placeholder}
            </option>
            {countryOptions?.map(({ value, label }, index) => (
              <option key={index} value={value} className="bg-[#121215] text-[#FDFBF7] py-1.5">
                {label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    )
  }
)

CountrySelect.displayName = "CountrySelect"

export default CountrySelect
