"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("admin@tamzen.shop")
  const [password, setPassword] = useState("supersecret")
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFillDemo = () => {
    setEmail("admin@tamzen.shop")
    setPassword("supersecret")
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || "Invalid email or password.")
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (err: any) {
      setError(err?.message || "Could not connect to authentication server.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient luxury lighting */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-[#D4AF37]/5 blur-[120px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E5C378] to-[#997926] p-[1px] shadow-xl shadow-amber-950/40">
            <div className="w-full h-full bg-[#121217] rounded-2xl flex items-center justify-center">
              <span className="font-serif font-black text-[#E5C378] text-2xl tracking-tighter">
                TZ
              </span>
            </div>
          </div>
          <h1 className="mt-5 text-center text-3xl font-serif font-bold tracking-tight text-[#F5F0E8]">
            TamZen
          </h1>
          <p className="mt-1 text-center text-xs tracking-[0.25em] uppercase font-mono font-bold text-[#D4AF37]/80">
            Exclusive Atelier Admin
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#121217] py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-white/10 relative overflow-hidden">
          {/* Top Gold Accent Border */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

          <div className="mb-6">
            <h2 className="text-lg font-serif font-bold text-[#F5F0E8]">
              Welcome Back
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
              Sign in to manage catalog pieces, orders, and customer requests.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-200 text-xs font-medium flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider mb-1.5 font-mono"
              >
                Admin Email
              </label>
              <div className="relative rounded-xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#9CA3AF]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tamzen.shop"
                  className="block w-full rounded-xl border border-white/10 pl-10 pr-4 py-2.5 text-sm text-[#F5F0E8] placeholder:text-white/20 bg-[#181820] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider mb-1.5 font-mono"
              >
                Password
              </label>
              <div className="relative rounded-xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#9CA3AF]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full rounded-xl border border-white/10 pl-10 pr-10 py-2.5 text-sm text-[#F5F0E8] placeholder:text-white/20 bg-[#181820] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/40 hover:text-[#F5F0E8] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-bold text-neutral-950 bg-gradient-to-r from-[#E5C378] to-[#D4AF37] hover:brightness-110 shadow-lg shadow-amber-950/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] disabled:opacity-70 transition-all active:scale-[0.99]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-neutral-950" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Admin Dashboard</span>
                    <ArrowRight className="h-4 w-4 text-neutral-950" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick autofill helper */}
          <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-xs text-[#9CA3AF]">
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Medusa Auth
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[#E5C378] hover:text-white font-medium inline-flex items-center gap-1 hover:underline text-xs"
            >
              <Sparkles className="h-3 w-3 text-[#D4AF37]" />
              Autofill Credentials
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#9CA3AF]/60 font-mono tracking-wider">
          TamZen • எங்கள் வேர் எங்கள் அடையாளம்
        </p>
      </div>
    </div>
  )
}
