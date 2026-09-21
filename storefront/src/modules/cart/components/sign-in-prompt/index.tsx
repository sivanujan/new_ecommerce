import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex flex-col">
        <h3 className="font-display text-sm sm:text-base font-bold text-white uppercase tracking-wider">
          Already have an account?
        </h3>
        <p className="text-xs text-neutral-400 font-sans mt-0.5">
          Sign in to access your saved addresses and order history.
        </p>
      </div>
      <div>
        <LocalizedClientLink
          href="/account"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-[#E5C378]/40 hover:border-[#E5C378] text-[#F3D798] text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-95"
          data-testid="sign-in-button"
        >
          Sign In
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
