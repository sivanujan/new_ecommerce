"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Settings,
  ExternalLink,
  LogOut,
  Sparkles,
} from "lucide-react"
import { logoutAction } from "@/lib/actions"

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Categories", href: "/categories", icon: FolderTree },
  { name: "Orders", href: "/orders", icon: ShoppingBag },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function Sidebar({ adminEmail }: { adminEmail?: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 shadow-sm">
      {/* Top Header */}
      <div>
        <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white font-serif font-black shadow-sm shadow-amber-500/30">
            TZ
          </div>
          <div>
            <span className="font-serif font-bold text-slate-900 tracking-tight text-base block leading-none">
              TamZen
            </span>
            <span className="text-[10px] font-mono tracking-wider uppercase text-amber-700 font-semibold">
              Boutique Admin
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </div>
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-amber-50 text-amber-900 font-semibold shadow-sm border border-amber-200/60"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive ? "text-amber-600" : "text-slate-400"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        {/* View Storefront Link */}
        <a
          href="http://localhost:8000/fr"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all group"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>View Live Store</span>
          </span>
          <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </a>

        {/* User Card & Logout */}
        <div className="pt-2 flex items-center justify-between px-2">
          <div className="min-w-0 pr-2">
            <span className="block text-xs font-semibold text-slate-800 truncate">
              {adminEmail || "Admin User"}
            </span>
            <span className="block text-[10px] text-slate-400">Store Manager</span>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              title="Sign out"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
