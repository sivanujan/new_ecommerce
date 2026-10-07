"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"

type ToastType = "success" | "error" | "info"

interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastContextType {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, type, message }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const contextValue = {
    success: (msg: string) => addToast("success", msg),
    error: (msg: string) => addToast("error", msg),
    info: (msg: string) => addToast("info", msg),
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast Render Portal */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-2 ${
              toast.type === "success"
                ? "bg-[#141B15]/95 border-emerald-500/40 text-emerald-200 shadow-emerald-950/40"
                : toast.type === "error"
                ? "bg-[#211414]/95 border-rose-500/40 text-rose-200 shadow-rose-950/40"
                : "bg-[#181820]/95 border-[#D4AF37]/40 text-[#F5F0E8] shadow-amber-950/30"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : toast.type === "error" ? (
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              ) : (
                <Info className="h-4 w-4 text-[#D4AF37] shrink-0" />
              )}
              <span className="text-xs font-medium leading-relaxed truncate">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/40 hover:text-white p-1 rounded-lg transition-colors shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}
