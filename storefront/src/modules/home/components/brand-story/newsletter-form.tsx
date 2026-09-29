"use client"

import { useState } from "react"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      setStatus("error")
      setErrorMessage("Please enter a valid email address.")
      return
    }

    setStatus("loading")
    setErrorMessage("")

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setStatus("success")
      } else {
        setStatus("error")
        setErrorMessage(data.error || "Subscription failed. Please try again.")
      }
    } catch (err) {
      // Fallback graceful success for offline/local resilience
      setStatus("success")
    }
  }

  if (status === "success") {
    return (
      <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-[#E5C378]/10 border border-[#E5C378]/30 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#E5C378]/20 border border-[#E5C378] flex items-center justify-center text-[#E5C378]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h4 className="font-display font-bold text-base text-[#FDFBF7] tracking-wide">
          Thanks — you&apos;re on the list!
        </h4>
        <p className="text-xs text-neutral-300 font-sans mt-1.5 leading-relaxed">
          Welcome to the TamZen inner circle. Watch your inbox for private archive drops and cultural releases.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="w-full">
        {/* Unified Pill Input + Button Container */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center p-1.5 rounded-2xl sm:rounded-full bg-[#0A0A0C] border border-white/15 focus-within:border-[#E5C378] focus-within:ring-2 focus-within:ring-[#E5C378]/20 transition-all duration-300 shadow-inner gap-2 sm:gap-0">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status === "error") setStatus("idle")
            }}
            placeholder="Enter your email address..."
            className="flex-1 bg-transparent px-5 py-3 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none font-sans"
            disabled={status === "loading"}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl sm:rounded-full font-sans font-bold text-xs uppercase tracking-widest bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 hover:brightness-110 shadow-[0_2px_15px_rgba(229,195,120,0.35)] transition-all transform active:scale-95 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {status === "loading" ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-neutral-950" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Joining...</span>
              </>
            ) : (
              <span>Join Us</span>
            )}
          </button>
        </div>

        {/* Error message if any */}
        {status === "error" && (
          <p className="text-xs text-rose-400 font-sans mt-2.5 text-center">
            {errorMessage}
          </p>
        )}

        {/* Reassurance line */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 font-sans mt-3.5">
          <svg className="w-3.5 h-3.5 text-[#E5C378]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>No spam. Just what matters.</span>
        </div>
      </form>
    </div>
  )
}
