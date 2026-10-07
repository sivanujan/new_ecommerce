"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Sparkles,
  Flame,
  Clock,
  Search,
  Check,
  Plus,
  Trash2,
  Calendar,
  Save,
  Loader2,
  ExternalLink,
  Package,
  Layers,
  CheckCircle2,
  AlertCircle,
  X,
  Tag,
  ArrowRight,
  Sliders,
  ShieldCheck,
} from "lucide-react"
import { updateHomepageHighlightsAction } from "@/lib/admin/actions"
import { useToast } from "@/components/admin/ToastProvider"

interface FeaturedDealsClientProps {
  initialHighlights: {
    featured_product_ids: string[]
    deal_product_ids: string[]
    deal_end_time: string | null
  }
  products: any[]
  categories: any[]
}

export default function FeaturedDealsClient({
  initialHighlights,
  products,
  categories,
}: FeaturedDealsClientProps) {
  const router = useRouter()
  const toast = useToast()

  const [activeTab, setActiveTab] = useState<"featured" | "deals" | "timer">("featured")

  // State
  const [featuredIds, setFeaturedIds] = useState<string[]>(
    initialHighlights.featured_product_ids || []
  )
  const [dealIds, setDealIds] = useState<string[]>(
    initialHighlights.deal_product_ids || []
  )

  // Deal End Time as local ISO string for datetime-local input
  const initialLocalTime = useMemo(() => {
    if (!initialHighlights.deal_end_time) return ""
    const d = new Date(initialHighlights.deal_end_time)
    if (isNaN(d.getTime())) return ""
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
  }, [initialHighlights.deal_end_time])

  const [dealEndTime, setDealEndTime] = useState<string>(initialLocalTime)
  const [isSaving, setIsSaving] = useState(false)

  // Search & filter state
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Live countdown preview
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    expired: boolean
    isSet: boolean
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
    isSet: Boolean(dealEndTime),
  })

  useEffect(() => {
    if (!dealEndTime) {
      setTimeLeft({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expired: false,
        isSet: false,
      })
      return
    }

    const calc = () => {
      const target = new Date(dealEndTime).getTime()
      const now = Date.now()
      const diff = target - now

      if (isNaN(target) || diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
          isSet: true,
        })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        expired: false,
        isSet: true,
      })
    }

    calc()
    const timer = setInterval(calc, 1000)
    return () => clearInterval(timer)
  }, [dealEndTime])

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.handle?.toLowerCase().includes(search.toLowerCase())
      const matchesCategory =
        selectedCategory === "all" ||
        p.categories?.some((c: any) => c.id === selectedCategory)
      return matchesSearch && matchesCategory
    })
  }, [products, search, selectedCategory])

  // Products by ID lookup map
  const productMap = useMemo(() => {
    const map = new Map<string, any>()
    products.forEach((p) => map.set(p.id, p))
    return map
  }, [products])

  // Toggle Featured
  const toggleFeatured = (id: string) => {
    setFeaturedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Toggle Deal
  const toggleDeal = (id: string) => {
    setDealIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Timer Presets
  const applyPresetTimer = (daysToAdd: number) => {
    const d = new Date()
    d.setDate(d.getDate() + daysToAdd)
    d.setHours(23, 59, 59, 0)
    const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
    setDealEndTime(localIso)
    toast.success(`Countdown set for ${daysToAdd} day(s) from now!`)
  }

  const clearTimer = () => {
    setDealEndTime("")
    toast.success("Countdown timer cleared (Always active).")
  }

  // Save handler
  const handleSave = async () => {
    setIsSaving(true)
    try {
      const payload = {
        featured_product_ids: featuredIds,
        deal_product_ids: dealIds,
        deal_end_time: dealEndTime ? new Date(dealEndTime).toISOString() : null,
      }

      const res = await updateHomepageHighlightsAction(payload)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(
          "Featured products & Deal of the Week saved and live on storefront!"
        )
        router.refresh()
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to save highlights")
    } finally {
      setIsSaving(false)
    }
  }

  // Hotkey support: Cmd+S / Ctrl+S
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [featuredIds, dealIds, dealEndTime])

  return (
    <div className="space-y-8">
      {/* Top Banner & Save Action */}
      <div className="bg-[#121217] rounded-3xl border border-white/10 p-6 sm:p-7 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#997A15] p-0.5 shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#121217] rounded-[14px] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-[#D4AF37]" />
              </div>
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-[#F5F0E8]">
                Featured Pieces & Flash Deals
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Curate the boutique homepage rail and manage Deal of the Week urgency
              </p>
            </div>
          </div>

          {/* Quick Metrics Pills */}
          <div className="flex flex-wrap items-center gap-2.5 mt-4 text-xs font-mono">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#F5F0E8]">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>
                <strong className="text-[#D4AF37]">{featuredIds.length}</strong> Featured Pieces
              </span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#F5F0E8]">
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              <span>
                <strong className="text-amber-400">{dealIds.length}</strong> Flash Deals
              </span>
            </span>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                timeLeft.isSet && !timeLeft.expired
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : timeLeft.expired
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  : "bg-white/5 text-[#9CA3AF] border-white/10"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>
                {timeLeft.isSet && !timeLeft.expired
                  ? `Timer Active (${timeLeft.days}d ${timeLeft.hours}h left)`
                  : timeLeft.expired
                  ? "Timer Expired"
                  : "No Timer Set"}
              </span>
            </span>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <a
            href="/fr#featured-products"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-semibold text-[#F5F0E8] bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <span>Preview Storefront</span>
            <ExternalLink className="h-3.5 w-3.5 text-[#9CA3AF]" />
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-semibold text-black bg-[#D4AF37] hover:bg-[#E5C158] transition-all shadow-lg shadow-[#D4AF37]/20 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin text-black" />
            ) : (
              <Save className="h-4 w-4 text-black" />
            )}
            <span>Save & Publish Changes</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("featured")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === "featured"
              ? "bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20"
              : "bg-white/5 text-[#9CA3AF] hover:text-[#F5F0E8] hover:bg-white/10"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>1. Featured Products Rail ({featuredIds.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("deals")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === "deals"
              ? "bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20"
              : "bg-white/5 text-[#9CA3AF] hover:text-[#F5F0E8] hover:bg-white/10"
          }`}
        >
          <Flame className="h-4 w-4" />
          <span>2. Deal of the Week Pieces ({dealIds.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("timer")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === "timer"
              ? "bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20"
              : "bg-white/5 text-[#9CA3AF] hover:text-[#F5F0E8] hover:bg-white/10"
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>3. Flash Countdown Timer</span>
        </button>
      </div>

      {/* TAB 1: FEATURED PRODUCTS */}
      {activeTab === "featured" && (
        <div className="space-y-6">
          {/* Section explanation card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0D0D12] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-base text-[#F5F0E8] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#D4AF37]" />
                <span>Curated Homepage Rail Pieces</span>
              </h3>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Check the jewelry pieces you wish to showcase directly on the boutique homepage under "Featured Products".
              </p>
            </div>

            {featuredIds.length > 0 && (
              <button
                type="button"
                onClick={() => setFeaturedIds([])}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors shrink-0"
              >
                Clear All Featured
              </button>
            )}
          </div>

          {/* Currently Selected Tray */}
          {featuredIds.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                <span>Selected Pieces ({featuredIds.length})</span>
                <span className="text-[#D4AF37] font-mono lowercase">click x to remove</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {featuredIds.map((id) => {
                  const p = productMap.get(id)
                  if (!p) return null
                  const img = p.thumbnail || p.images?.[0]?.url
                  const price =
                    p.variants?.[0]?.prices?.[0]?.amount ||
                    p.variants?.[0]?.calculated_price?.calculated_amount ||
                    "0"

                  return (
                    <div
                      key={id}
                      className="p-3 rounded-2xl bg-[#121217] border border-[#D4AF37]/50 shadow-lg flex items-center gap-3 relative group"
                    >
                      {img ? (
                        <img
                          src={img}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 shrink-0">
                          <Package className="h-5 w-5" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-xs text-[#F5F0E8] truncate">
                          {p.title}
                        </h4>
                        <span className="font-serif font-bold text-xs text-[#D4AF37] block mt-0.5">
                          €{Number(price).toFixed(2)} EUR
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleFeatured(id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                        title="Remove from featured"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Product Filter & Selector Table */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search piece name or handle..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#121217] border border-white/10 text-xs text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 rounded-2xl bg-[#121217] border border-white/10 text-xs text-[#F5F0E8] focus:border-[#D4AF37] outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-[#121217] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181820] border-b border-white/5 text-[#9CA3AF] font-bold uppercase tracking-widest text-[10px]">
                    <tr>
                      <th className="py-4 px-6 w-12 text-center">Featured</th>
                      <th className="py-4 px-6">Jewelry Piece</th>
                      <th className="py-4 px-6">Collection</th>
                      <th className="py-4 px-6">Price</th>
                      <th className="py-4 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredProducts.map((p) => {
                      const isFeatured = featuredIds.includes(p.id)
                      const img = p.thumbnail || p.images?.[0]?.url
                      const price =
                        p.variants?.[0]?.prices?.[0]?.amount ||
                        p.variants?.[0]?.calculated_price?.calculated_amount ||
                        "0"
                      const catName = p.categories?.[0]?.name || "Unassigned"

                      return (
                        <tr
                          key={p.id}
                          onClick={() => toggleFeatured(p.id)}
                          className={`hover:bg-white/[0.02] cursor-pointer transition-colors ${
                            isFeatured ? "bg-[#D4AF37]/5" : ""
                          }`}
                        >
                          <td className="py-4 px-6 text-center">
                            <input
                              type="checkbox"
                              checked={isFeatured}
                              onChange={() => toggleFeatured(p.id)}
                              className="w-4 h-4 rounded text-[#D4AF37] focus:ring-[#D4AF37] accent-[#D4AF37] cursor-pointer"
                            />
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {img ? (
                                <img
                                  src={img}
                                  alt=""
                                  className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 shrink-0">
                                  <Package className="h-4 w-4" />
                                </div>
                              )}
                              <div>
                                <span className="font-medium text-sm text-[#F5F0E8] block">
                                  {p.title}
                                </span>
                                <span className="text-[11px] text-[#9CA3AF]/60 font-mono">
                                  {p.handle}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6 text-[#9CA3AF]">
                            {catName}
                          </td>

                          <td className="py-4 px-6 font-serif font-bold text-sm text-[#D4AF37]">
                            €{Number(price).toFixed(2)} EUR
                          </td>

                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                isFeatured
                                  ? "bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30"
                                  : "bg-white/5 text-[#9CA3AF] border-white/10"
                              }`}
                            >
                              {isFeatured ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  <span>Featured Rail</span>
                                </>
                              ) : (
                                <span>Standard</span>
                              )}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DEAL OF THE WEEK */}
      {activeTab === "deals" && (
        <div className="space-y-6">
          {/* Explanation card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0D0D12] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-base text-[#F5F0E8] flex items-center gap-2">
                <Flame className="h-4 w-4 text-amber-400" />
                <span>Exclusive "Deal of the Week" Selection</span>
              </h3>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Selected pieces will be highlighted in the boutique flash deals carousel accompanied by the active countdown timer.
              </p>
            </div>

            {dealIds.length > 0 && (
              <button
                type="button"
                onClick={() => setDealIds([])}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors shrink-0"
              >
                Clear All Deals
              </button>
            )}
          </div>

          {/* Currently Selected Deals Tray */}
          {dealIds.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                <span>Active Deals ({dealIds.length})</span>
                <span className="text-amber-400 font-mono lowercase">click x to remove</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {dealIds.map((id) => {
                  const p = productMap.get(id)
                  if (!p) return null
                  const img = p.thumbnail || p.images?.[0]?.url
                  const price =
                    p.variants?.[0]?.prices?.[0]?.amount ||
                    p.variants?.[0]?.calculated_price?.calculated_amount ||
                    "0"

                  return (
                    <div
                      key={id}
                      className="p-3 rounded-2xl bg-[#121217] border border-amber-500/50 shadow-lg flex items-center gap-3 relative group"
                    >
                      {img ? (
                        <img
                          src={img}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 shrink-0">
                          <Package className="h-5 w-5" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-xs text-[#F5F0E8] truncate">
                          {p.title}
                        </h4>
                        <span className="font-serif font-bold text-xs text-amber-400 block mt-0.5">
                          €{Number(price).toFixed(2)} EUR
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleDeal(id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                        title="Remove from deals"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Deals Table Selector */}
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search piece to add to flash deals..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#121217] border border-white/10 text-xs text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
              />
            </div>

            <div className="bg-[#121217] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181820] border-b border-white/5 text-[#9CA3AF] font-bold uppercase tracking-widest text-[10px]">
                    <tr>
                      <th className="py-4 px-6 w-12 text-center">Deal</th>
                      <th className="py-4 px-6">Jewelry Piece</th>
                      <th className="py-4 px-6">Collection</th>
                      <th className="py-4 px-6">Price</th>
                      <th className="py-4 px-6">Deal Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredProducts.map((p) => {
                      const isDeal = dealIds.includes(p.id)
                      const img = p.thumbnail || p.images?.[0]?.url
                      const price =
                        p.variants?.[0]?.prices?.[0]?.amount ||
                        p.variants?.[0]?.calculated_price?.calculated_amount ||
                        "0"
                      const catName = p.categories?.[0]?.name || "Unassigned"

                      return (
                        <tr
                          key={p.id}
                          onClick={() => toggleDeal(p.id)}
                          className={`hover:bg-white/[0.02] cursor-pointer transition-colors ${
                            isDeal ? "bg-amber-500/5" : ""
                          }`}
                        >
                          <td className="py-4 px-6 text-center">
                            <input
                              type="checkbox"
                              checked={isDeal}
                              onChange={() => toggleDeal(p.id)}
                              className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400 accent-amber-500 cursor-pointer"
                            />
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {img ? (
                                <img
                                  src={img}
                                  alt=""
                                  className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 shrink-0">
                                  <Package className="h-4 w-4" />
                                </div>
                              )}
                              <div>
                                <span className="font-medium text-sm text-[#F5F0E8] block">
                                  {p.title}
                                </span>
                                <span className="text-[11px] text-[#9CA3AF]/60 font-mono">
                                  {p.handle}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6 text-[#9CA3AF]">
                            {catName}
                          </td>

                          <td className="py-4 px-6 font-serif font-bold text-sm text-[#D4AF37]">
                            €{Number(price).toFixed(2)} EUR
                          </td>

                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                isDeal
                                  ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                                  : "bg-white/5 text-[#9CA3AF] border-white/10"
                              }`}
                            >
                              {isDeal ? (
                                <>
                                  <Flame className="h-3 w-3" />
                                  <span>Deal of the Week</span>
                                </>
                              ) : (
                                <span>Regular Price</span>
                              )}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FLASH COUNTDOWN TIMER */}
      {activeTab === "timer" && (
        <div className="space-y-8 max-w-4xl">
          {/* Live Preview Card */}
          <div className="bg-gradient-to-br from-[#121217] via-[#16161F] to-[#0D0D12] rounded-3xl border border-[#D4AF37]/30 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#F5F0E8]">
                    Live Storefront Urgency Timer
                  </h3>
                  <p className="text-xs text-[#9CA3AF]">
                    Preview of the exact countdown ribbon shown on the homepage
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  timeLeft.isSet && !timeLeft.expired
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : timeLeft.expired
                    ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                    : "bg-white/5 text-[#9CA3AF] border-white/10"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    timeLeft.isSet && !timeLeft.expired
                      ? "bg-emerald-400 animate-pulse"
                      : timeLeft.expired
                      ? "bg-rose-400"
                      : "bg-[#9CA3AF]"
                  }`}
                />
                <span>
                  {timeLeft.isSet && !timeLeft.expired
                    ? "Active Countdown"
                    : timeLeft.expired
                    ? "Expired"
                    : "Always Running"}
                </span>
              </span>
            </div>

            {/* Countdown Numerals Display */}
            <div className="grid grid-cols-4 gap-3 sm:gap-6 text-center py-2">
              <div className="p-4 sm:p-6 rounded-2xl bg-[#0A0A0C] border border-white/10 shadow-inner">
                <span className="font-serif font-bold text-3xl sm:text-5xl text-[#D4AF37] block">
                  {timeLeft.isSet ? String(timeLeft.days).padStart(2, "0") : "--"}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mt-2 block">
                  Days
                </span>
              </div>

              <div className="p-4 sm:p-6 rounded-2xl bg-[#0A0A0C] border border-white/10 shadow-inner">
                <span className="font-serif font-bold text-3xl sm:text-5xl text-[#D4AF37] block">
                  {timeLeft.isSet ? String(timeLeft.hours).padStart(2, "0") : "--"}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mt-2 block">
                  Hours
                </span>
              </div>

              <div className="p-4 sm:p-6 rounded-2xl bg-[#0A0A0C] border border-white/10 shadow-inner">
                <span className="font-serif font-bold text-3xl sm:text-5xl text-[#D4AF37] block">
                  {timeLeft.isSet ? String(timeLeft.minutes).padStart(2, "0") : "--"}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mt-2 block">
                  Minutes
                </span>
              </div>

              <div className="p-4 sm:p-6 rounded-2xl bg-[#0A0A0C] border border-white/10 shadow-inner">
                <span className="font-serif font-bold text-3xl sm:text-5xl text-[#D4AF37] block">
                  {timeLeft.isSet ? String(timeLeft.seconds).padStart(2, "0") : "--"}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mt-2 block">
                  Seconds
                </span>
              </div>
            </div>
          </div>

          {/* Quick Presets & Date Input */}
          <div className="bg-[#121217] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <h4 className="font-serif font-bold text-base text-[#F5F0E8]">
                Set Countdown Expiration
              </h4>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Choose a one-click preset or select an exact date & time.
              </p>
            </div>

            {/* Presets buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => applyPresetTimer(1)}
                className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#F5F0E8] bg-white/5 hover:bg-[#D4AF37] hover:text-black border border-white/10 hover:border-transparent transition-all"
              >
                +24 Hours (Flash Sale)
              </button>

              <button
                type="button"
                onClick={() => applyPresetTimer(3)}
                className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#F5F0E8] bg-white/5 hover:bg-[#D4AF37] hover:text-black border border-white/10 hover:border-transparent transition-all"
              >
                +3 Days (Weekend Special)
              </button>

              <button
                type="button"
                onClick={() => applyPresetTimer(7)}
                className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#F5F0E8] bg-white/5 hover:bg-[#D4AF37] hover:text-black border border-white/10 hover:border-transparent transition-all"
              >
                +7 Days (Weekly Deal)
              </button>

              <button
                type="button"
                onClick={() => applyPresetTimer(14)}
                className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#F5F0E8] bg-white/5 hover:bg-[#D4AF37] hover:text-black border border-white/10 hover:border-transparent transition-all"
              >
                +14 Days (Bi-Weekly)
              </button>

              <button
                type="button"
                onClick={clearTimer}
                className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
              >
                Clear Timer (Always Active)
              </button>
            </div>

            {/* Custom Datetime Input */}
            <div className="pt-2 border-t border-white/5 space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                Custom Date & Time (Local Time)
              </label>
              <input
                type="datetime-local"
                value={dealEndTime}
                onChange={(e) => setDealEndTime(e.target.value)}
                className="w-full sm:max-w-md px-4 py-3 rounded-2xl bg-[#0D0D12] border border-white/10 text-sm text-[#F5F0E8] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none font-mono"
              />
              <p className="text-[11px] text-[#9CA3AF]/60">
                When the expiration time is reached, the boutique deal timer will gracefully display an expired or next deal status.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
