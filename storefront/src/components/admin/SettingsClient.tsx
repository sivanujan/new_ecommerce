"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Store,
  Mail,
  ShieldCheck,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Server,
  Globe,
  ExternalLink,
  Sparkles,
  Save,
  User,
} from "lucide-react"
import {
  updateStoreSettingsAction,
  updateAdminPasswordAction,
  updateAdminProfileAction,
} from "@/lib/admin/actions"
import { useToast } from "@/components/admin/ToastProvider"

interface SettingsClientProps {
  store: any
  user: any
}

export default function SettingsClient({ store, user }: SettingsClientProps) {
  const router = useRouter()
  const toast = useToast()

  // Store form state
  const [storeName, setStoreName] = useState(store?.name || "TamZen")
  const [contactEmail, setContactEmail] = useState(
    store?.metadata?.contact_email || "contact@tamzen.shop"
  )
  const [isSavingStore, setIsSavingStore] = useState(false)

  // Profile form state
  const [firstName, setFirstName] = useState(user?.first_name || "Atelier")
  const [lastName, setLastName] = useState(user?.last_name || "Manager")
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  // Handle Save Store Profile
  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!storeName.trim()) {
      toast.error("Store name is required")
      return
    }

    setIsSavingStore(true)
    try {
      const formData = new FormData()
      formData.set("storeId", store?.id || "")
      formData.set("storeName", storeName.trim())
      formData.set("contactEmail", contactEmail.trim())

      const res = await updateStoreSettingsAction(formData)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success("Boutique settings saved successfully!")
        router.refresh()
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update store settings")
    } finally {
      setIsSavingStore(false)
    }
  }

  // Handle Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    setIsSavingProfile(true)
    try {
      const formData = new FormData()
      formData.set("userId", user.id)
      formData.set("firstName", firstName.trim())
      formData.set("lastName", lastName.trim())

      const res = await updateAdminProfileAction(formData)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success("Admin profile updated successfully!")
        router.refresh()
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile")
    } finally {
      setIsSavingProfile(false)
    }
  }

  // Handle Update Password
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)

    if (!currentPassword) {
      setPasswordError("Please enter your current password.")
      return
    }
    if (!newPassword || newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.")
      return
    }

    setIsSavingPassword(true)
    try {
      const formData = new FormData()
      formData.set("currentPassword", currentPassword)
      formData.set("newPassword", newPassword)
      formData.set("confirmPassword", confirmPassword)

      const res = await updateAdminPasswordAction(formData)
      if (res.error) {
        setPasswordError(res.error)
        toast.error(res.error)
      } else {
        toast.success("Admin password updated successfully!")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      }
    } catch (err: any) {
      setPasswordError(err?.message || "Failed to update password.")
      toast.error(err?.message || "Failed to update password.")
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* 1. Store Identity & Boutique Settings */}
      <form
        onSubmit={handleSaveStore}
        className="bg-[#121217] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#F5F0E8]">
                Boutique Identity
              </h3>
              <p className="text-xs text-[#9CA3AF]">
                Public brand name and contact credentials
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
            EUR (€) Store
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
              Store Brand Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="TamZen"
              className="w-full px-4 py-3 rounded-2xl bg-[#0D0D12] border border-white/10 text-sm text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none font-medium"
            />
            <p className="text-[11px] text-[#9CA3AF]/70 mt-1.5">
              Official store name shown on customer invoices & emails.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
              Customer Contact Email <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="contact@tamzen.shop"
              className="w-full px-4 py-3 rounded-2xl bg-[#0D0D12] border border-white/10 text-sm text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none font-mono"
            />
            <p className="text-[11px] text-[#9CA3AF]/70 mt-1.5">
              Receives customer questions, orders, and support requests.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSavingStore}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#D4AF37] hover:bg-[#E5C158] text-black font-semibold text-xs transition-all shadow-lg shadow-[#D4AF37]/20 disabled:opacity-50"
          >
            {isSavingStore ? (
              <Loader2 className="h-4 w-4 animate-spin text-black" />
            ) : (
              <Save className="h-4 w-4 text-black" />
            )}
            <span>Save Boutique Settings</span>
          </button>
        </div>
      </form>

      {/* 2. Admin Password Change */}
      <form
        onSubmit={handleSavePassword}
        className="bg-[#121217] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#F5F0E8]">
                Change Admin Password
              </h3>
              <p className="text-xs text-[#9CA3AF]">
                Update authentication credentials for the store manager account
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono text-[#9CA3AF] bg-white/5 px-3 py-1 rounded-full border border-white/10">
            {user?.email || "admin@tamzen.shop"}
          </span>
        </div>

        {passwordError && (
          <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{passwordError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPass ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-[#0D0D12] border border-white/10 text-sm text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#F5F0E8]"
              >
                {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPass ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-[#0D0D12] border border-white/10 text-sm text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#F5F0E8]"
              >
                {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-[#0D0D12] border border-white/10 text-sm text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#F5F0E8]"
              >
                {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSavingPassword}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-[#D4AF37] hover:text-black border border-white/10 hover:border-transparent text-[#F5F0E8] font-semibold text-xs transition-all shadow-md disabled:opacity-50"
          >
            {isSavingPassword ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            <span>Update Admin Password</span>
          </button>
        </div>
      </form>

      {/* 3. System Environment & Connected Services */}
      <div className="bg-[#121217] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#F5F0E8]">
              System Health & Architecture
            </h3>
            <p className="text-xs text-[#9CA3AF]">
              All services connected and operational
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Medusa Backend */}
          <div className="p-4 rounded-2xl bg-[#0D0D12] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#F5F0E8]">Medusa Backend API</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="font-mono text-[11px] text-[#9CA3AF]">http://localhost:9000</p>
            <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold block">
              Operational
            </span>
          </div>

          {/* Storefront & Admin */}
          <div className="p-4 rounded-2xl bg-[#0D0D12] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#F5F0E8]">Boutique & Integrated Admin</span>
              <a
                href="/fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF37] hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <p className="font-mono text-[11px] text-[#9CA3AF]">localhost:8000 / tamzen.shop</p>
            <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold block">
              Active Admin Session
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
