"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { clx } from "@medusajs/ui"
import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

type LoginTemplateProps = {
  initialView?: LOGIN_VIEW
}

function LoginContent({ initialView = LOGIN_VIEW.SIGN_IN }: LoginTemplateProps) {
  const searchParams = useSearchParams()
  const viewParam = searchParams.get("mode") || searchParams.get("view")

  const [currentView, setCurrentView] = useState<LOGIN_VIEW>(() => {
    if (viewParam === "register") return LOGIN_VIEW.REGISTER
    if (viewParam === "sign-in" || viewParam === "login") return LOGIN_VIEW.SIGN_IN
    return initialView
  })

  useEffect(() => {
    if (viewParam === "register") {
      setCurrentView(LOGIN_VIEW.REGISTER)
    } else if (viewParam === "sign-in" || viewParam === "login") {
      setCurrentView(LOGIN_VIEW.SIGN_IN)
    }
  }, [viewParam])

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 sm:py-8 font-sans">
      {/* Visual Navigation Tabs for Instant Clarity */}
      <div className="flex items-center p-1 rounded-full bg-[#141418] border border-white/10 w-full max-w-[320px] mb-6 shadow-xl relative z-20">
        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className={clx(
            "flex-1 py-2.5 px-4 text-xs uppercase tracking-[0.18em] font-semibold rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5",
            currentView === LOGIN_VIEW.SIGN_IN
              ? "bg-[#E5C378] text-[#0B0B0C] font-bold shadow-[0_4px_16px_rgba(229,195,120,0.3)]"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          )}
          data-testid="tab-sign-in"
        >
          <span>Sign In</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className={clx(
            "flex-1 py-2.5 px-4 text-xs uppercase tracking-[0.18em] font-semibold rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5",
            currentView === LOGIN_VIEW.REGISTER
              ? "bg-[#E5C378] text-[#0B0B0C] font-bold shadow-[0_4px_16px_rgba(229,195,120,0.3)]"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          )}
          data-testid="tab-register"
        >
          <span>Register</span>
        </button>
      </div>

      {currentView === LOGIN_VIEW.SIGN_IN ? (
        <Login setCurrentView={setCurrentView} />
      ) : (
        <Register setCurrentView={setCurrentView} />
      )}
    </div>
  )
}

export default function LoginTemplate(props: LoginTemplateProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[400px] flex items-center justify-center text-neutral-400">
          <div className="w-8 h-8 rounded-full border-2 border-[#E5C378]/30 border-t-[#E5C378] animate-spin" />
        </div>
      }
    >
      <LoginContent {...props} />
    </Suspense>
  )
}
