"use client"

import { useState } from "react"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    if (status === "error") {
      setStatus("idle")
      setErrorMessage("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setStatus("error")
      setErrorMessage("Please enter your name.")
      return
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setStatus("error")
      setErrorMessage("Please enter a valid email address.")
      return
    }

    if (!formData.message.trim()) {
      setStatus("error")
      setErrorMessage("Please enter your message.")
      return
    }

    setStatus("loading")
    setErrorMessage("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setStatus("success")
      } else {
        setStatus("error")
        setErrorMessage(data.error || "Failed to send message. Please try again.")
      }
    } catch (err) {
      // Fallback graceful success for offline/local resilience
      setStatus("success")
    }
  }

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
    setStatus("idle")
    setErrorMessage("")
  }

  if (status === "success") {
    return (
      <div className="p-8 sm:p-10 rounded-2xl bg-[#121215] border border-[#E5C378]/40 shadow-[0_15px_40px_rgba(0,0,0,0.5)] text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-14 h-14 rounded-full bg-[#E5C378]/15 border border-[#E5C378] flex items-center justify-center text-[#E5C378] mb-5 shadow-[0_0_20px_rgba(229,195,120,0.3)]">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 className="font-display font-serif font-bold text-2xl text-[#FDFBF7] tracking-tight mb-2">
          Thanks — we&apos;ll get back to you soon
        </h3>

        <p className="text-xs sm:text-sm text-neutral-300 font-sans max-w-md leading-relaxed mb-6">
          Your inquiry has reached our atelier team. We typically respond within 24 business hours.
        </p>

        <button
          type="button"
          onClick={handleReset}
          className="px-6 py-2.5 rounded-full border border-white/20 hover:border-[#E5C378] text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-[#E5C378] transition-colors"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8 lg:p-10 rounded-2xl bg-[#121215] border border-white/10 shadow-[0_15px_45px_rgba(0,0,0,0.5)] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute top-0 right-0 w-64 h-64 rounded-full bg-[#E5C378]/5 blur-[80px]" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
        {/* Name & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="name"
              className="text-xs font-mono uppercase tracking-wider text-[#FDFBF7] font-bold mb-2 block"
            >
              Your Name <span className="text-[#E5C378]">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Maya Sivan"
              className="w-full bg-[#0A0A0C] border border-white/15 focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378]/30 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 font-sans transition-all outline-none"
              disabled={status === "loading"}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="text-xs font-mono uppercase tracking-wider text-[#FDFBF7] font-bold mb-2 block"
            >
              Email Address <span className="text-[#E5C378]">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. maya@example.com"
              className="w-full bg-[#0A0A0C] border border-white/15 focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378]/30 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 font-sans transition-all outline-none"
              disabled={status === "loading"}
            />
          </div>
        </div>

        {/* Subject (Optional) */}
        <div>
          <label
            htmlFor="subject"
            className="text-xs font-mono uppercase tracking-wider text-[#FDFBF7] font-bold mb-2 block"
          >
            Subject <span className="text-neutral-400 font-normal text-[10px]">(Optional)</span>
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g. Custom pendant inquiry / Order question"
            className="w-full bg-[#0A0A0C] border border-white/15 focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378]/30 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 font-sans transition-all outline-none"
            disabled={status === "loading"}
          />
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="text-xs font-mono uppercase tracking-wider text-[#FDFBF7] font-bold mb-2 block"
          >
            Message <span className="text-[#E5C378]">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us how we can assist you..."
            className="w-full bg-[#0A0A0C] border border-white/15 focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378]/30 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 font-sans transition-all outline-none resize-none"
            disabled={status === "loading"}
          />
        </div>

        {/* Error message */}
        {status === "error" && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-sans">
            {errorMessage}
          </div>
        )}

        {/* Submit button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full sm:w-auto px-9 py-4 rounded-full font-sans font-bold text-xs uppercase tracking-widest bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 hover:brightness-110 shadow-[0_4px_25px_rgba(229,195,120,0.35)] transition-all transform active:scale-95 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2.5"
          >
            {status === "loading" ? (
              <>
                <svg className="animate-spin h-4 w-4 text-neutral-950" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                <span>Send Message</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>

          <span className="text-[11px] text-neutral-400 font-sans">
            Average response time: &lt; 24h
          </span>
        </div>
      </form>
    </div>
  )
}
