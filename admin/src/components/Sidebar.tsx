"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Settings,
  ExternalLink,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Categories", href: "/categories", icon: FolderTree },
  { name: "Orders", href: "/orders", icon: ShoppingBag },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function Sidebar({ adminEmail }: { adminEmail?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      router.refresh()
    } catch {
      window.location.href = "/login"
    }
  }

  return (
    <aside
      className={`hidden md:flex flex-col justify-between shrink-0 h-screen sticky top-0 bg-[#121217] border-r border-white/10 transition-all duration-300 z-30 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E5C378] to-[#997926] p-[1px] shadow-sm shrink-0">
              <div className="w-full h-full bg-[#121217] rounded-xl flex items-center justify-center font-serif font-black text-[#E5C378] text-sm">
                TZ
              </div>
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="font-serif font-bold text-[#F5F0E8] tracking-tight text-base block leading-none">
                  TamZen
                </span>
                <span className="text-[10px] font-mono tracking-wider uppercase text-[#D4AF37] font-semibold">
                  Atelier Admin
                </span>
              </div>
            )}
          </Link>

          {/* Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white/40 hover:text-[#D4AF37] p-1.5 rounded-lg hover:bg-white/5 transition-colors shrink-0"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {!isCollapsed && (
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[#9CA3AF]/60 font-bold">
              Navigation
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.name}
                href={item.href}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? "bg-[#D4AF37]/15 text-[#E5C378] font-bold border border-[#D4AF37]/30 shadow-sm shadow-amber-950/20"
                    : "text-[#9CA3AF] hover:text-[#F5F0E8] hover:bg-white/5"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? "text-[#E5C378]" : "text-[#9CA3AF]"
                  }`}
                />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Area: Live Store & Profile */}
      <div className="p-3 border-t border-white/5 space-y-2">
        {/* View Live Store */}
        <a
          href="http://localhost:8000/fr"
          target="_blank"
          rel="noopener noreferrer"
          title="View Live Storefront"
          className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-[#F5F0E8] bg-white/5 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/40 border border-white/5 transition-all group ${
            isCollapsed ? "justify-center px-0" : ""
          }`}
        >
          <span className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
            {!isCollapsed && <span>Live Store</span>}
          </span>
          {!isCollapsed && (
            <ExternalLink className="h-3.5 w-3.5 text-white/40 group-hover:text-[#D4AF37] transition-colors" />
          )}
        </a>

        {/* User Card */}
        <div
          className={`pt-2 flex items-center justify-between px-2 ${
            isCollapsed ? "justify-center px-0" : ""
          }`}
        >
          {!isCollapsed && (
            <div className="min-w-0 pr-2">
              <span className="block text-xs font-bold text-[#F5F0E8] truncate font-serif">
                {adminEmail?.split("@")[0] || "TamZen"}
              </span>
              <span className="block text-[10px] text-[#9CA3AF] truncate font-mono">
                {adminEmail || "admin@tamzen.shop"}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            title="Sign out"
            className="p-2 rounded-xl text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
