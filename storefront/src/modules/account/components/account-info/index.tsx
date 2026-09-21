import { Disclosure } from "@headlessui/react"
import { clx } from "@medusajs/ui"
import { useEffect } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import { useFormStatus } from "react-dom"

type AccountInfoProps = {
  label: string
  currentInfo: string | React.ReactNode
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  clearState: () => void
  children?: React.ReactNode
  "data-testid"?: string
}

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage = "An error occurred, please try again",
  children,
  "data-testid": dataTestid,
}: AccountInfoProps) => {
  const { state, close, toggle } = useToggleState()
  const { pending } = useFormStatus()

  const handleToggle = () => {
    clearState()
    setTimeout(() => toggle(), 100)
  }

  useEffect(() => {
    if (isSuccess) {
      close()
    }
  }, [isSuccess, close])

  return (
    <div
      className="rounded-2xl bg-[#121215] border border-white/10 p-5 sm:p-6 shadow-lg font-sans text-white"
      data-testid={dataTestid}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] uppercase tracking-wider font-mono text-neutral-400 font-medium">
            {label}
          </span>
          <div className="flex items-center gap-x-4 mt-1">
            {typeof currentInfo === "string" ? (
              <span
                className="font-display font-bold text-base sm:text-lg text-white truncate"
                data-testid="current-info"
              >
                {currentInfo}
              </span>
            ) : (
              currentInfo
            )}
          </div>
        </div>

        <button
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#E5C378]/50 text-xs font-semibold text-neutral-200 hover:text-[#E5C378] transition-all cursor-pointer shrink-0"
          onClick={handleToggle}
          type={state ? "reset" : "button"}
          data-testid="edit-button"
          data-active={state}
        >
          {state ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Success state */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden",
            {
              "max-h-[1000px] opacity-100": isSuccess,
              "max-h-0 opacity-0": !isSuccess,
            }
          )}
          data-testid="success-message"
        >
          <div className="p-3 my-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{label} updated successfully</span>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      {/* Error state */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden",
            {
              "max-h-[1000px] opacity-100": isError,
              "max-h-0 opacity-0": !isError,
            }
          )}
          data-testid="error-message"
        >
          <div className="p-3 my-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>{errorMessage}</span>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      {/* Edit Form Accordion */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            "transition-[max-height,opacity] duration-300 ease-in-out overflow-visible",
            {
              "max-h-[1000px] opacity-100": state,
              "max-h-0 opacity-0 pointer-events-none": !state,
            }
          )}
        >
          <div className="flex flex-col gap-y-4 pt-4 mt-4 border-t border-white/10">
            <div>{children}</div>
            <div className="flex items-center justify-end">
              <button
                disabled={pending}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-[0_2px_15px_rgba(229,195,120,0.3)] hover:brightness-105 transition-all disabled:opacity-50 cursor-pointer"
                type="submit"
                data-testid="save-button"
              >
                {pending ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  )
}

export default AccountInfo
