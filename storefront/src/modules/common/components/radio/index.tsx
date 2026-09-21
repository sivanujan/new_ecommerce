const Radio = ({ checked, 'data-testid': dataTestId }: { checked: boolean, 'data-testid'?: string }) => {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      className="group relative flex h-5 w-5 items-center justify-center outline-none shrink-0"
      data-testid={dataTestId || 'radio-button'}
    >
      <div
        className={`flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-200 ${
          checked
            ? "border-[#E5C378] bg-[#E5C378]/15 ring-2 ring-[#E5C378]/30"
            : "border-white/25 bg-[#141418] group-hover:border-white/50"
        }`}
      >
        {checked && (
          <div className="h-1.5 w-1.5 rounded-full bg-[#E5C378] shadow-[0_0_6px_rgba(229,195,120,0.8)]" />
        )}
      </div>
    </button>
  )
}

export default Radio
