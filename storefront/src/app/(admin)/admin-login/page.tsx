"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Crown,
  Sparkles,
  ExternalLink,
} from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("admin@tamzen.shop")
  const [password, setPassword] = useState("supersecret")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || "Invalid email or password.")
      } else {
        router.push("/admin")
        router.refresh()
      }
    } catch (err: any) {
      setError(err?.message || "Could not connect to Medusa backend.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const fillDemoCredentials = () => {
    setEmail("admin@tamzen.shop")
    setPassword("supersecret")
    setError(null)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] flex flex-col justify-center items-center p-4 sm:p-6 text-[#F5F0E8] relative overflow-hidden font-sans">
      {/* Background radial gold glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-br from-[#D4AF37] to-[#997A15] p-0.5 shadow-2xl shadow-[#D4AF37]/30 mx-auto">
            <div className="w-full h-full bg-[#0A0A0C] rounded-[22px] flex items-center justify-center">
              <Crown className="h-7 w-7 text-[#D4AF37]" />
            </div>
          </div>

          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#F5F0E8]">
              TamZen Atelier
            </h1>
            <p className="text-xs text-[#9CA3AF] tracking-widest uppercase font-semibold mt-1">
              Boutique Admin Portal
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#121217] rounded-3xl border border-white/10 p-7 sm:p-8 shadow-2xl space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h2 className="font-serif font-bold text-lg text-[#F5F0E8]">
              Staff Sign In
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Enter your credentials to access boutique inventory & orders
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tamzen.shop"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#0D0D12] border border-white/10 text-sm text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                  Password
                </label>
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-2xl bg-[#0D0D12] border border-white/10 text-sm text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#F5F0E8] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-[#D4AF37] hover:bg-[#E5C158] text-black font-semibold text-sm transition-all shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-black" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In to Dashboard</span>
                )}
              </button>
            </div>
          </form>

          {/* Demo Credentials Quick Fill */}
          <div className="pt-2 border-t border-white/5 text-center">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:underline font-medium"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Use Demo Admin Credentials</span>
            </button>
            <p className="text-[11px] text-[#9CA3AF]/60 mt-1 font-mono">
              admin@tamzen.shop / supersecret
            </p>
          </div>
        </div>

        {/* Back to Storefront Link */}
        <div className="text-center">
          <a
            href="/fr"
            className="inline-flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#F5F0E8] transition-colors"
          >
            <span>Return to Live Boutique</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
