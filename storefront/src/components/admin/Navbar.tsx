"use client"

import Link from "next/link"
import { Plus, Sparkles, User, ExternalLink } from "lucide-react"

interface NavbarProps {
  title: string
  subtitle?: string
}

export default function Navbar({ title, subtitle }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 bg-[#0A0A0C]/80 backdrop-blur-md border-b border-white/10 px-6 sm:px-8 py-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#F5F0E8] truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-[#9CA3AF] mt-0.5 truncate hidden sm:block">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#9CA3AF]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px]">TamZen Atelier • Live</span>
        </div>

        {/* Quick Add Piece */}
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-black bg-[#D4AF37] hover:bg-[#E5C158] transition-all shadow-md shadow-[#D4AF37]/20"
        >
          <Plus className="h-3.5 w-3.5 text-black" />
          <span className="hidden sm:inline">Add Piece</span>
        </Link>

        {/* Admin Avatar */}
        <div className="w-9 h-9 rounded-xl bg-[#121217] border border-white/10 flex items-center justify-center text-[#D4AF37] shadow-inner">
          <User className="h-4 w-4" />
        </div>
      </div>
    </header>
  )
}
