import Link from "next/link"
import { Plus, CheckCircle2 } from "lucide-react"

export default function Navbar({
  title,
  subtitle,
}: {
  title?: string
  subtitle?: string
}) {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-bold text-slate-900 leading-tight">
          {title || "Overview"}
        </h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Store Live</span>
        </div>

        {/* Quick Add Product Button */}
        <Link
          href="/products/new"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 shadow-sm shadow-amber-500/20 transition-all active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </Link>
      </div>
    </header>
  )
}
