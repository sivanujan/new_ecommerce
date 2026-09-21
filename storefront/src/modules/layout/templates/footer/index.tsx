import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "id, title, handle",
  }).catch(() => ({ collections: [] }))
  
  const productCategories = await listCategories().catch(() => [])

  return (
    <footer className="w-full bg-[#080809] border-t border-white/10 text-neutral-400 text-xs font-sans">
      <div className="content-container py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b border-white/10">
          {/* Brand Mark Column */}
          <div className="lg:col-span-2 flex flex-col items-start pr-0 lg:pr-8">
            <LocalizedClientLink href="/" className="group flex items-center gap-3.5 mb-5">
              <div className="w-9 h-9 rounded-full border border-white/20 bg-gradient-to-b from-white/15 to-white/5 flex items-center justify-center transition-all duration-300 group-hover:border-white/40">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 18h16M5 14h14M3 8l4 5 5-7 5 7 4-5v10H3z" />
                  <circle cx="12" cy="5" r="1" fill="currentColor" />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="font-display text-xl font-bold tracking-[0.22em] text-white uppercase leading-none">
                  TamZen
                </span>
                <span className="text-[8px] uppercase tracking-[0.28em] text-neutral-400 mt-1">
                  More Than Jewellery
                </span>
              </div>
            </LocalizedClientLink>

            {/* Tagline */}
            <p className="font-display text-sm tracking-widest text-neutral-200 uppercase mb-3">
              Culture Lives On
            </p>

            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm mb-6">
              Handcrafted stainless steel pendants embodying Tamil-Eelam symbols of resilience, heritage, and pride. Built to withstand time and trends.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
              <span>Worldwide Shipping Available</span>
            </div>
          </div>

          {/* Quick Nav / Collections */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display text-xs uppercase tracking-[0.2em] font-bold text-white mb-2">
              Collections
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <LocalizedClientLink
                  href="/store"
                  className="hover:text-white transition-colors"
                >
                  All Creations
                </LocalizedClientLink>
              </li>
              {collections && collections.length > 0 ? (
                collections.slice(0, 4).map((c) => (
                  <li key={c.id}>
                    <LocalizedClientLink
                      href={`/collections/${c.handle}`}
                      className="hover:text-white transition-colors"
                    >
                      {c.title}
                    </LocalizedClientLink>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <LocalizedClientLink href="/store" className="hover:text-white transition-colors">
                      Signature Pendants
                    </LocalizedClientLink>
                  </li>
                  <li>
                    <LocalizedClientLink href="/store" className="hover:text-white transition-colors">
                      Heritage Dog-Tags
                    </LocalizedClientLink>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Heritage & Values */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display text-xs uppercase tracking-[0.2em] font-bold text-white mb-2">
              Brand & Story
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <LocalizedClientLink href="#story" className="hover:text-white transition-colors">
                  Our Story
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="#story" className="hover:text-white transition-colors">
                  316L Stainless Steel
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="#story" className="hover:text-white transition-colors">
                  Cultural Symbols
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/account" className="hover:text-white transition-colors">
                  My Account
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="flex flex-col gap-3" id="contact-info">
            <h4 className="font-display text-xs uppercase tracking-[0.2em] font-bold text-white mb-2">
              Contact
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li className="text-neutral-400">
                Email:{" "}
                <a
                  href="mailto:contact@tamzen.com"
                  className="hover:text-white transition-colors"
                >
                  contact@tamzen.com
                </a>
              </li>
              <li className="text-neutral-400">
                Support: Mon &ndash; Fri (9:00 &ndash; 18:00 CET)
              </li>
              <li>
                <LocalizedClientLink href="/cart" className="hover:text-white transition-colors">
                  View Bag
                </LocalizedClientLink>
              </li>
              <li className="pt-2">
                <span className="inline-block px-3 py-1 rounded-full border border-white/10 text-[10px] uppercase tracking-wider text-neutral-300 bg-white/[0.03]">
                  Europe • France / EUR
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>
            © {new Date().getFullYear()} TamZen. All rights reserved. &bull; More Than Jewellery
          </p>
          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-300 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span>&bull;</span>
            <span className="hover:text-neutral-300 transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span>&bull;</span>
            <span className="hover:text-neutral-300 transition-colors cursor-pointer">
              Shipping Policy
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
