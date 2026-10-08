"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Settings,
  Sparkles,
  Ticket,
} from "lucide-react"

export default function MobileTabBar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Promos", href: "/admin/promotions", icon: Ticket },
    { name: "Deals", href: "/admin/featured", icon: Sparkles },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0C]/90 backdrop-blur-md border-t border-white/10 px-2 py-2 flex items-center justify-around">
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
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              isActive ? "text-[#D4AF37]" : "text-[#9CA3AF] hover:text-[#F5F0E8]"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-[10px] font-medium tracking-tight">
              {item.name}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
