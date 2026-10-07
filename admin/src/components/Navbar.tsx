import Link from "next/link"
import { Plus, Sparkles, Search, User } from "lucide-react"

export default function Navbar({
  title,
  subtitle,
}: {
  title?: string
  subtitle?: string
}) {
  return (
    <header className="h-16 bg-[#121217]/90 backdrop-blur-md border-b border-white/5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="text-lg sm:text-xl font-serif font-bold text-[#F5F0E8] leading-tight">
          {title || "Overview"}
        </h1>
        {subtitle && (
          <p className="text-[11px] sm:text-xs text-[#9CA3AF] font-light">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Store Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#181820] border border-[#D4AF37]/30 text-[#E5C378] text-[11px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span>Store Live</span>
        </div>

        {/* Primary Action Button */}
        <Link
          href="/products/new"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-950 bg-gradient-to-r from-[#E5C378] to-[#D4AF37] hover:brightness-110 shadow-md shadow-amber-950/30 transition-all active:scale-[0.98]"
        >
          <Plus className="h-3.5 w-3.5 text-neutral-950" />
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </Link>

        {/* Admin Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E5C378] to-[#997926] p-[1px] shrink-0">
          <div className="w-full h-full rounded-full bg-[#181820] flex items-center justify-center text-[#E5C378] font-bold text-xs font-serif">
            TZ
          </div>
        </div>
      </div>
    </header>
  )
}
