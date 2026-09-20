"use client"

import { useState } from "react"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="p-4 rounded-xl bg-white/[0.04] border border-white/15 text-center max-w-md mx-auto">
        <p className="text-sm font-display text-white tracking-wide">
          Welcome to the TamZen Circle.
        </p>
        <p className="text-xs text-neutral-400 font-sans mt-1">
          You will be the first to know about new cultural drops and releases.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="flex-1 bg-white/[0.05] border border-white/15 focus:border-white/40 focus:bg-white/[0.08] focus:outline-none rounded-full px-6 py-3.5 text-xs text-white placeholder-neutral-500 transition-all"
      />
      <button
        type="submit"
        className="pill-btn-primary py-3.5 px-7 whitespace-nowrap text-xs"
      >
        Subscribe
      </button>
    </form>
  )
}
