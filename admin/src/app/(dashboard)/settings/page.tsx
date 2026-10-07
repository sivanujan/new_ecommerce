import Navbar from "@/components/Navbar"
import {
  Store,
  Mail,
  ShieldCheck,
  Server,
  Globe,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from "lucide-react"

export default function SettingsPage() {
  return (
    <div>
      <Navbar
        title="Store Settings"
        subtitle="Manage basic boutique information and system connections"
      />

      <div className="p-8 max-w-4xl mx-auto space-y-6">
        {/* Store Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Boutique Profile
              </h2>
              <p className="text-xs text-slate-500">
                Core identity and contact details displayed to customers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Store Name
              </label>
              <input
                type="text"
                disabled
                defaultValue="TamZen"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-700 font-semibold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Official diaspora jewelry brand
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Support & Contact Email
              </label>
              <input
                type="email"
                disabled
                defaultValue="contact@tamzen.shop"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-700 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Receives order inquiries and support requests
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Currency
              </label>
              <input
                type="text"
                disabled
                defaultValue="EUR (€) — Euro"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-700 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Tax & Region
              </label>
              <input
                type="text"
                disabled
                defaultValue="France / Europe (TVA 20%)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Integration Status Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                System Status & Integrations
              </h2>
              <p className="text-xs text-slate-500">
                Live backend engine, storage, and storefront endpoints
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Medusa Backend */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <div>
                  <span className="font-semibold text-xs text-slate-900 block">
                    Medusa v2 Commerce Engine
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    http://localhost:9000
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full border border-emerald-200">
                Online & Healthy
              </span>
            </div>

            {/* Storefront */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <div>
                  <span className="font-semibold text-xs text-slate-900 block">
                    Next.js Storefront
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    http://localhost:8000/fr
                  </span>
                </div>
              </div>
              <a
                href="http://localhost:8000/fr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-full border border-amber-200/60 transition-colors"
              >
                <span>Open Store</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Database & Redis */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <div>
                  <span className="font-semibold text-xs text-slate-900 block">
                    PostgreSQL 16 & Redis 8
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Local Homebrew Services
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full border border-emerald-200">
                Running
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
