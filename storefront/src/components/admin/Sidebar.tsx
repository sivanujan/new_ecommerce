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
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Crown,
} from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" })
      router.push("/admin-login")
      router.refresh()
    } catch {
      router.push("/admin-login")
    }
  }

  return (
    <aside
      className={`hidden md:flex flex-col justify-between border-r border-white/10 bg-[#0A0A0C] transition-all duration-300 relative z-30 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Brand Section */}
      <div>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#997A15] p-0.5 shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#0A0A0C] rounded-[14px] flex items-center justify-center">
                <Crown className="h-5 w-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              </div>
            </div>

            {!collapsed && (
              <div className="min-w-0 animate-in fade-in duration-200">
                <span className="font-serif font-bold text-lg tracking-wide text-[#F5F0E8] block">
                  TamZen
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[#D4AF37] block -mt-0.5">
                  Atelier Admin
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#D4AF37] text-black font-semibold shadow-lg shadow-[#D4AF37]/20 scale-[1.02]"
                    : "text-[#9CA3AF] hover:text-[#F5F0E8] hover:bg-white/5"
                } ${collapsed ? "justify-center px-0" : ""}`}
                title={collapsed ? item.name : undefined}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-transform ${
                    isActive ? "text-black" : "text-[#D4AF37]"
                  }`}
                />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/5 space-y-2">
        {/* Live Storefront Link */}
        <a
          href="/fr"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-[#9CA3AF] hover:text-[#D4AF37] hover:bg-white/5 transition-colors ${
            collapsed ? "justify-center px-0" : ""
          }`}
          title={collapsed ? "View Live Boutique" : undefined}
        >
          <ExternalLink className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
          {!collapsed && <span>View Boutique</span>}
        </a>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors ${
            collapsed ? "justify-center px-0" : ""
          }`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0 text-rose-400" />
          {!collapsed && <span>Sign Out</span>}
        </button>

        {/* Collapse Sidebar Toggle */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-xl border border-white/10 hover:border-[#D4AF37]/50 text-[#9CA3AF] hover:text-[#F5F0E8] bg-white/5 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </aside>
  )
}
