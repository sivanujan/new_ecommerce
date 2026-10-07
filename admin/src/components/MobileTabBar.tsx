"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Settings,
} from "lucide-react"

const mobileTabs = [
  { name: "Home", href: "/", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Categories", href: "/categories", icon: FolderTree },
  { name: "Orders", href: "/orders", icon: ShoppingBag },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function MobileTabBar() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#121217]/95 backdrop-blur-lg border-t border-white/10 px-2 py-1.5 flex items-center justify-around">
      {mobileTabs.map((tab) => {
        const Icon = tab.icon
        const isActive =
          tab.href === "/"
            ? pathname === "/"
            : pathname.startsWith(tab.href)

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isActive
                ? "text-[#E5C378] font-bold"
                : "text-[#9CA3AF] hover:text-[#F5F0E8]"
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? "text-[#E5C378]" : ""}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">{tab.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
