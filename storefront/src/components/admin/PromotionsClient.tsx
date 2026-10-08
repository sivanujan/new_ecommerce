"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Tag,
  Plus,
  Trash2,
  Copy,
  Check,
  Search,
  Loader2,
  X,
  Percent,
  CheckCircle2,
  Power,
  Sparkles,
  Ticket,
} from "lucide-react"
import {
  createPromotionAction,
  deletePromotionAction,
  bulkDeletePromotionsAction,
  togglePromotionStatusAction,
} from "@/lib/admin/actions"
import { useToast } from "@/components/admin/ToastProvider"

export default function PromotionsClient({
  initialPromotions,
}: {
  initialPromotions: any[]
}) {
  const router = useRouter()
  const toast = useToast()

  const [promotions, setPromotions] = useState<any[]>(initialPromotions)
  const [search, setSearch] = useState("")

  // Selection & Bulk
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

  // Single Action Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [confirmDeletePromo, setConfirmDeletePromo] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // Create Form State
  const [code, setCode] = useState("")
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage")
  const [value, setValue] = useState("10")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const filteredPromotions = promotions.filter((p) =>
    (p.code || "").toLowerCase().includes(search.toLowerCase())
  )

  const isAllSelected =
    filteredPromotions.length > 0 &&
    filteredPromotions.every((p) => selectedIds.includes(p.id))

  const isSomeSelected =
    filteredPromotions.some((p) => selectedIds.includes(p.id)) && !isAllSelected

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const visibleIds = new Set(filteredPromotions.map((p) => p.id))
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.has(id)))
    } else {
      const visibleIds = filteredPromotions.map((p) => p.id)
      setSelectedIds(Array.from(new Set([...selectedIds, ...visibleIds])))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleCopy = (codeText: string) => {
    navigator.clipboard.writeText(codeText)
    setCopiedCode(codeText)
    toast.success(`Promo code "${codeText}" copied to clipboard!`)
    setTimeout(() => {
      setCopiedCode(null)
    }, 2000)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!code.trim()) {
      setFormError("Promo code is required.")
      return
    }

    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue <= 0) {
      setFormError("Discount value must be greater than 0.")
      return
    }

    if (discountType === "percentage" && numValue > 100) {
      setFormError("Percentage discount cannot exceed 100%.")
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.set("code", code.trim().toUpperCase())
      formData.set("discountType", discountType)
      formData.set("value", value)

      const res = await createPromotionAction(formData)
      if (res.error) {
        setFormError(res.error)
        toast.error(res.error)
      } else {
        toast.success(`Promo code "${code.trim().toUpperCase()}" created successfully!`)
        if (res.promotion) {
          setPromotions((prev) => [res.promotion, ...prev])
        }
        setShowAddModal(false)
        setCode("")
        setValue("10")
        router.refresh()
      }
    } catch (err: any) {
      setFormError(err?.message || "Failed to create promo code.")
      toast.error(err?.message || "Failed to create promo code.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmDeletePromo) return
    setIsDeleting(true)
    try {
      const res = await deletePromotionAction(confirmDeletePromo.id)
      if (res.error) {
        toast.error(res.error)
      } else {
        setPromotions((prev) => prev.filter((p) => p.id !== confirmDeletePromo.id))
        setSelectedIds((prev) => prev.filter((id) => id !== confirmDeletePromo.id))
        toast.success(`Promo code "${confirmDeletePromo.code}" deleted.`)
        setConfirmDeletePromo(null)
        router.refresh()
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete promo code.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    setIsBulkDeleting(true)
    try {
      const count = selectedIds.length
      const res = await bulkDeletePromotionsAction(selectedIds)
      if (res.error) {
        toast.error(res.error)
      } else {
        setPromotions((prev) => prev.filter((p) => !selectedIds.includes(p.id)))
        setSelectedIds([])
        setShowBulkDeleteModal(false)
        toast.success(`Deleted ${count} ${count === 1 ? "promo code" : "promo codes"}.`)
        router.refresh()
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete selected promo codes.")
    } finally {
      setIsBulkDeleting(false)
    }
  }

  const handleToggleStatus = async (promo: any) => {
    setTogglingId(promo.id)
    try {
      const res = await togglePromotionStatusAction(promo.id, promo.status)
      if (res.error) {
        toast.error(res.error)
      } else {
        setPromotions((prev) =>
          prev.map((p) =>
            p.id === promo.id ? { ...p, status: res.status } : p
          )
        )
        toast.success(
          `Promo code "${promo.code}" is now ${
            res.status === "active" ? "Active" : "Draft"
          }.`
        )
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to toggle status.")
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search promo codes (e.g. TAMZEN10)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#121217] border border-white/10 text-xs text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
          />
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={() => {
            setFormError(null)
            setShowAddModal(true)
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D4AF37] hover:bg-[#E5C158] text-black font-semibold text-xs transition-all shadow-lg shadow-[#D4AF37]/20"
        >
          <Plus className="h-4 w-4 text-black" />
          <span>Create Promo Code</span>
        </button>
      </div>

      {/* Promotions Table Card */}
      <div className="bg-[#121217] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        {filteredPromotions.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-[#D4AF37] flex items-center justify-center mx-auto shadow-inner">
              <Ticket className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#F5F0E8]">
                {promotions.length === 0
                  ? "No Promo Codes Created Yet"
                  : "No Matching Promo Codes"}
              </h3>
              <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto mt-1 leading-relaxed">
                Create promotional discount codes (e.g. 10% off, €20 voucher) to delight your customers at checkout.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D4AF37] text-black font-semibold text-xs hover:bg-[#E5C158] transition-all shadow-lg shadow-[#D4AF37]/20"
            >
              <Plus className="h-4 w-4" />
              <span>Create Your First Promo Code</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs bg-transparent">
              <thead className="bg-[#181820] border-b border-white/5 text-[#9CA3AF] font-bold uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="py-4 px-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeSelected
                      }}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-white/20 bg-[#181820] text-[#D4AF37] focus:ring-[#D4AF37] accent-[#D4AF37] cursor-pointer transition-all"
                      title={isAllSelected ? "Deselect all" : "Select all promo codes"}
                    />
                  </th>
                  <th className="py-4 px-6">Promo Code</th>
                  <th className="py-4 px-6">Discount</th>
                  <th className="py-4 px-6">Scope</th>
                  <th className="py-4 px-6">Usage</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-transparent">
                {filteredPromotions.map((p) => {
                  const isSelected = selectedIds.includes(p.id)
                  const isPercent = p.application_method?.type === "percentage"
                  const discountVal = p.application_method?.value ?? 0
                  const isActive = p.status === "active"

                  return (
                    <tr
                      key={p.id}
                      className={`transition-colors group bg-transparent ${
                        isSelected
                          ? "bg-[#D4AF37]/[0.08] hover:bg-[#D4AF37]/[0.12]"
                          : "hover:bg-white/[0.04]"
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(p.id)}
                          className="w-4 h-4 rounded border-white/20 bg-[#181820] text-[#D4AF37] focus:ring-[#D4AF37] accent-[#D4AF37] cursor-pointer transition-all"
                        />
                      </td>

                      {/* Code Pill + Copy */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-xs px-3 py-1.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] tracking-wider shadow-sm">
                            {p.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(p.code)}
                            className="p-1.5 rounded-lg border border-white/10 hover:border-[#D4AF37]/50 text-[#9CA3AF] hover:text-[#D4AF37] bg-white/5 hover:bg-[#D4AF37]/10 transition-colors"
                            title="Copy promo code"
                          >
                            {copiedCode === p.code ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Discount Amount */}
                      <td className="py-4 px-6">
                        <span className="font-serif font-bold text-sm text-[#F5F0E8]">
                          {isPercent ? `${discountVal}% OFF` : `€${Number(discountVal).toFixed(2)} OFF`}
                        </span>
                        <span className="text-[10px] text-[#9CA3AF] block font-mono">
                          {isPercent ? "Percentage discount" : "Fixed cart discount"}
                        </span>
                      </td>

                      {/* Scope */}
                      <td className="py-4 px-6 text-[#9CA3AF] text-xs">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[#F5F0E8]">
                          Entire Order
                        </span>
                      </td>

                      {/* Usage */}
                      <td className="py-4 px-6 text-[#9CA3AF] text-xs font-mono">
                        {p.used || 0} times used
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <button
                          type="button"
                          disabled={togglingId === p.id}
                          onClick={() => handleToggleStatus(p)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                            isActive
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                              : "bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25"
                          }`}
                          title="Click to toggle status"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                            }`}
                          />
                          {togglingId === p.id ? "Updating..." : isActive ? "Active" : "Draft"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopy(p.code)}
                            className="p-2 rounded-xl border border-white/10 text-[#9CA3AF] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 bg-white/5 hover:bg-[#D4AF37]/10 transition-colors"
                            title="Copy code"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeletePromo(p)}
                            className="p-2 rounded-xl border border-rose-500/20 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 bg-rose-500/10 transition-colors"
                            title="Delete Promo Code"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#14141B]/95 backdrop-blur-xl border border-[#D4AF37]/40 shadow-2xl shadow-black/90 rounded-2xl px-5 py-3.5 flex items-center gap-4 transition-all animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] font-semibold text-xs whitespace-nowrap">
              {selectedIds.length} {selectedIds.length === 1 ? "promo code" : "promo codes"} selected
            </span>
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (isAllSelected) {
                  setSelectedIds([])
                } else {
                  setSelectedIds(filteredPromotions.map((p) => p.id))
                }
              }}
              className="text-xs text-[#9CA3AF] hover:text-[#F5F0E8] px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors whitespace-nowrap"
            >
              {isAllSelected ? "Deselect All" : "Select All Visible"}
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="p-1.5 rounded-xl text-[#9CA3AF] hover:text-[#F5F0E8] hover:bg-white/5 transition-colors"
              title="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowBulkDeleteModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 transition-all whitespace-nowrap"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Create Promo Code Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center">
                  <Ticket className="h-4 w-4" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#F5F0E8]">
                  Create Promo Code
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-xl text-[#9CA3AF] hover:text-[#F5F0E8] hover:bg-white/5 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-5">
              {/* Promo Code Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
                  Promo Code <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. TAMZEN10, WELCOME20, EELAM15"
                    className="w-full px-4 py-3 rounded-2xl bg-[#0D0D12] border border-white/10 text-sm font-mono tracking-wider text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all uppercase"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-[#D4AF37] font-semibold bg-[#D4AF37]/10 px-2 py-0.5 rounded-md border border-[#D4AF37]/20">
                    AUTO-UPPERCASE
                  </div>
                </div>
                <p className="text-[11px] text-[#9CA3AF]/60 mt-1.5">
                  Customers will type this exact code into the cart checkout discount box.
                </p>
              </div>

              {/* Discount Type Toggle */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
                  Discount Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDiscountType("percentage")}
                    className={`py-3 px-4 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      discountType === "percentage"
                        ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10"
                        : "bg-[#0D0D12] border-white/10 text-[#9CA3AF] hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <Percent className="h-4 w-4" />
                    <span>Percentage (%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDiscountType("fixed")}
                    className={`py-3 px-4 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      discountType === "fixed"
                        ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10"
                        : "bg-[#0D0D12] border-white/10 text-[#9CA3AF] hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <span className="font-serif font-bold text-sm">€</span>
                    <span>Fixed Amount (EUR)</span>
                  </button>
                </div>
              </div>

              {/* Discount Value Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
                  {discountType === "percentage" ? "Percentage Off (%)" : "Amount Off (€)"}{" "}
                  <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="1"
                    max={discountType === "percentage" ? "100" : undefined}
                    step="any"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={discountType === "percentage" ? "10" : "15.00"}
                    className="w-full px-4 py-3 rounded-2xl bg-[#0D0D12] border border-white/10 text-sm font-semibold text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#D4AF37]">
                    {discountType === "percentage" ? "%" : "EUR"}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-2xl text-xs font-semibold text-[#F5F0E8] bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-2xl text-xs font-semibold text-black bg-[#D4AF37] hover:bg-[#E5C158] transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin text-black" />}
                  <span>Create Promo Code</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Single Delete Modal */}
      {confirmDeletePromo && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] rounded-3xl max-w-sm w-full p-6 border border-white/10 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#F5F0E8]">
                Delete "{confirmDeletePromo.code}"?
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
                This code will immediately become invalid at checkout. Customers will no longer be able to apply it.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeletePromo(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-[#F5F0E8] bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] rounded-3xl max-w-md w-full p-6 sm:p-7 border border-white/10 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="h-7 w-7" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-xl text-[#F5F0E8]">
                Delete {selectedIds.length} {selectedIds.length === 1 ? "Promo Code" : "Promo Codes"}?
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-2 leading-relaxed">
                This will deactivate and permanently remove the selected promo codes from checkout.
              </p>
            </div>

            {/* Selected Items Preview */}
            <div className="bg-[#0D0D12] rounded-2xl p-3 border border-white/5 max-h-36 overflow-y-auto text-left space-y-1.5">
              {promotions
                .filter((p) => selectedIds.includes(p.id))
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-white/[0.02]"
                  >
                    <span className="font-mono font-bold text-[#D4AF37]">{p.code}</span>
                    <span className="text-[10px] text-[#9CA3AF]">
                      {p.application_method?.type === "percentage"
                        ? `${p.application_method?.value}% OFF`
                        : `€${p.application_method?.value} OFF`}
                    </span>
                  </div>
                ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isBulkDeleting}
                onClick={() => setShowBulkDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-[#F5F0E8] bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isBulkDeleting}
                onClick={handleBulkDelete}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isBulkDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Confirm Delete ({selectedIds.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
