import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Sparkles, Clock, Star, Check } from "@medusajs/icons"
import {
  Container,
  Heading,
  Text,
  Button,
  Badge,
  Input,
  clx,
  toast,
  Toaster,
} from "@medusajs/ui"
import { useEffect, useState, useMemo } from "react"

interface ProductItem {
  id: string
  title: string
  handle: string
  thumbnail?: string | null
  status?: string
}

const HighlightsPage = () => {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [featuredProductIds, setFeaturedProductIds] = useState<string[]>([])
  const [dealProductIds, setDealProductIds] = useState<string[]>([])
  const [dealEndTime, setDealEndTime] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)

  // Live countdown preview calculation
  const [countdownPreview, setCountdownPreview] = useState<string>("")

  // Fetch products and current highlights config
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)

        // 1. Fetch products
        const prodRes = await fetch("/admin/products?limit=100", {
          credentials: "include",
        })
        const prodData = await prodRes.json()
        if (prodData.products) {
          setProducts(prodData.products)
        }

        // 2. Fetch current highlights
        const hlRes = await fetch("/admin/homepage-highlights", {
          credentials: "include",
        })
        const hlData = await hlRes.json()
        if (hlData.highlights) {
          setFeaturedProductIds(hlData.highlights.featured_product_ids || [])
          setDealProductIds(hlData.highlights.deal_product_ids || [])

          if (hlData.highlights.deal_end_time) {
            // Convert to local format for datetime-local input
            const dt = new Date(hlData.highlights.deal_end_time)
            if (!isNaN(dt.getTime())) {
              const localIso = new Date(
                dt.getTime() - dt.getTimezoneOffset() * 60000
              )
                .toISOString()
                .slice(0, 16)
              setDealEndTime(localIso)
            }
          }
        }
      } catch (err: any) {
        console.error("Failed to load highlights data", err)
        toast.error("Failed to load settings: " + err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Update live countdown preview
  useEffect(() => {
    if (!dealEndTime) {
      setCountdownPreview("No expiration date set")
      return
    }

    const interval = setInterval(() => {
      const target = new Date(dealEndTime).getTime()
      const now = Date.now()
      const diff = target - now

      if (isNaN(target) || diff <= 0) {
        setCountdownPreview("Expired")
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setCountdownPreview(
        `${String(days).padStart(2, "0")}d : ${String(hours).padStart(2, "0")}h : ${String(minutes).padStart(2, "0")}m : ${String(seconds).padStart(2, "0")}s remaining`
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [dealEndTime])

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products
    const q = searchQuery.toLowerCase()
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) || p.handle.toLowerCase().includes(q)
    )
  }, [products, searchQuery])

  // Toggle Featured
  const toggleFeatured = (id: string) => {
    setFeaturedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Toggle Deal
  const toggleDeal = (id: string) => {
    setDealProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Quick timer presets
  const setPresetTimer = (days: number) => {
    const d = new Date()
    d.setDate(d.getDate() + days)
    d.setHours(23, 59, 0, 0)
    const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
    setDealEndTime(localIso)
  }

  // Save changes
  const handleSave = async () => {
    try {
      setSaving(true)

      const payload = {
        featured_product_ids: featuredProductIds,
        deal_product_ids: dealProductIds,
        deal_end_time: dealEndTime ? new Date(dealEndTime).toISOString() : null,
      }

      const res = await fetch("/admin/homepage-highlights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to save")
      }

      toast.success(
        "Homepage highlights and countdown timer saved successfully!"
      )
    } catch (err: any) {
      toast.error("Error saving highlights: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-y-6 pb-20 max-w-6xl">
      <Toaster />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ui-border-base pb-6">
        <div>
          <Heading level="h1" className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="text-ui-fg-interactive" />
            Homepage Highlights & Promotions
          </Heading>
          <Text className="text-ui-fg-subtle text-sm mt-1">
            Choose which products appear under <strong>Featured Products</strong>{" "}
            and <strong>Deal of the Week</strong>, and customize the live countdown timer.
          </Text>
        </div>
        <Button
          variant="primary"
          size="base"
          isLoading={saving}
          onClick={handleSave}
          className="shrink-0"
        >
          Save All Changes
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-ui-fg-muted">
          <Text>Loading products and homepage configurations...</Text>
        </div>
      ) : (
        <>
          {/* ============================================================ */}
          {/* SECTION 1: DEAL OF THE WEEK COUNTDOWN TIMER */}
          {/* ============================================================ */}
          <Container className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-ui-fg-interactive" />
              <Heading level="h2" className="text-lg font-semibold">
                Deal of the Week: Countdown Timer
              </Heading>
            </div>
            <Text className="text-ui-fg-subtle text-xs mb-5">
              Set the exact end date and time for the Deal of the Week banner. The storefront
              timer will live-count down to this target.
            </Text>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-ui-bg-subtle p-5 rounded-xl border border-ui-border-base">
              {/* Left: Input & Presets */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold text-ui-fg-base uppercase tracking-wider">
                  Target Expiration Date & Time:
                </label>
                <input
                  type="datetime-local"
                  value={dealEndTime}
                  onChange={(e) => setDealEndTime(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-ui-border-base bg-ui-bg-base text-ui-fg-base text-sm focus:outline-none focus:border-ui-border-interactive"
                />

                {/* Quick Presets */}
                <div className="flex items-center gap-2 pt-2 flex-wrap">
                  <span className="text-xs text-ui-fg-muted">Quick Presets:</span>
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => setPresetTimer(3)}
                  >
                    +3 Days
                  </Button>
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => setPresetTimer(7)}
                  >
                    +7 Days
                  </Button>
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => setPresetTimer(14)}
                  >
                    +14 Days
                  </Button>
                  <Button
                    size="small"
                    variant="transparent"
                    onClick={() => setDealEndTime("")}
                    className="text-ui-fg-error"
                  >
                    Clear Timer
                  </Button>
                </div>
              </div>

              {/* Right: Live Preview Badge */}
              <div className="flex flex-col justify-center items-start md:items-end md:border-l md:border-ui-border-base md:pl-6">
                <span className="text-xs uppercase tracking-wider text-ui-fg-muted mb-2 font-mono">
                  Storefront Timer Preview
                </span>
                <div className="px-4 py-3 rounded-xl bg-ui-bg-base border border-ui-border-interactive shadow-sm flex items-center gap-3">
                  <Clock className="w-5 h-5 text-ui-fg-interactive animate-pulse" />
                  <span className="font-mono font-bold text-sm text-ui-fg-base tracking-wider">
                    {countdownPreview}
                  </span>
                </div>
              </div>
            </div>
          </Container>

          {/* ============================================================ */}
          {/* SECTION 2: PRODUCT SELECTION */}
          {/* ============================================================ */}
          <Container className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <Heading level="h2" className="text-lg font-semibold flex items-center gap-2">
                  <Star className="text-ui-fg-interactive" />
                  Product Assignments
                </Heading>
                <Text className="text-ui-fg-subtle text-xs mt-1">
                  Select which products belong to each homepage section. Products can belong to
                  both sections simultaneously without altering their category or main collection.
                </Text>
              </div>

              {/* Search Bar */}
              <div className="w-full sm:w-72">
                <Input
                  type="search"
                  placeholder="Search products by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Selection Summary Badges */}
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-ui-border-base text-xs">
              <span className="font-semibold text-ui-fg-base">Active Selections:</span>
              <Badge color="orange">
                ⭐ Featured Products: {featuredProductIds.length}
              </Badge>
              <Badge color="blue">
                🔥 Deal of the Week: {dealProductIds.length}
              </Badge>
            </div>

            {/* Products Table / Cards */}
            <div className="divide-y divide-ui-border-base border border-ui-border-base rounded-xl overflow-hidden">
              {filteredProducts.length === 0 ? (
                <div className="p-8 text-center text-ui-fg-muted">
                  No products matched your search.
                </div>
              ) : (
                filteredProducts.map((p) => {
                  const isFeatured = featuredProductIds.includes(p.id)
                  const isDeal = dealProductIds.includes(p.id)

                  return (
                    <div
                      key={p.id}
                      className={clx(
                        "flex items-center justify-between p-4 transition-colors gap-4",
                        isFeatured || isDeal
                          ? "bg-ui-bg-subtle"
                          : "hover:bg-ui-bg-base"
                      )}
                    >
                      {/* Product Thumbnail & Title */}
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        {p.thumbnail ? (
                          <img
                            src={p.thumbnail}
                            alt={p.title}
                            className="w-12 h-14 rounded-lg object-cover bg-ui-bg-base border border-ui-border-base shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-14 rounded-lg bg-ui-bg-base border border-ui-border-base flex items-center justify-center text-xs text-ui-fg-muted shrink-0">
                            No img
                          </div>
                        )}

                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-ui-fg-base truncate">
                            {p.title}
                          </span>
                          <span className="text-xs text-ui-fg-muted font-mono truncate">
                            /{p.handle}
                          </span>
                        </div>
                      </div>

                      {/* Action Toggles */}
                      <div className="flex items-center gap-3 shrink-0">
                        {/* Featured Button */}
                        <button
                          type="button"
                          onClick={() => toggleFeatured(p.id)}
                          className={clx(
                            "px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer",
                            isFeatured
                              ? "bg-amber-500/15 border-amber-500/40 text-amber-600 hover:bg-amber-500/25"
                              : "border-ui-border-base bg-ui-bg-base text-ui-fg-subtle hover:border-ui-border-interactive"
                          )}
                        >
                          {isFeatured && <Check className="w-3.5 h-3.5" />}
                          <span>Featured</span>
                        </button>

                        {/* Deal of Week Button */}
                        <button
                          type="button"
                          onClick={() => toggleDeal(p.id)}
                          className={clx(
                            "px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer",
                            isDeal
                              ? "bg-blue-500/15 border-blue-500/40 text-blue-600 hover:bg-blue-500/25"
                              : "border-ui-border-base bg-ui-bg-base text-ui-fg-subtle hover:border-ui-border-interactive"
                          )}
                        >
                          {isDeal && <Check className="w-3.5 h-3.5" />}
                          <span>Deal of Week</span>
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </Container>
        </>
      )}
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Featured & Deals",
  icon: Sparkles,
})

export default HighlightsPage
