import Image from "next/image"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "id, title, handle",
  }).catch(() => ({ collections: [] }))

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      href: "https://tiktok.com",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.95-4.49V8.62a8.28 8.28 0 0 0 4.82 1.52V6.69h-1z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://youtube.com",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
        </svg>
      ),
    },
  ]

  return (
    <footer className="w-full bg-bg-base text-neutral-300 text-xs font-sans relative overflow-hidden">
      {/* Top subtle gold hairline accent */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#E5C378]/25 to-transparent" />

      {/* Ambient subtle glow & watermark */}
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-[600px] h-[300px] bg-[#E5C378]/[0.02] rounded-full blur-[140px]" />
      
      {/* Faint luxury watermark lion crest in background */}
      <div className="pointer-events-none absolute -bottom-12 -right-12 opacity-[0.04] select-none">
        <Image
          src="/logo-icon.svg"
          alt=""
          width={340}
          height={340}
          className="object-contain"
        />
      </div>

      <div className="content-container py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          {/* Brand Mark Column (2 cols) */}
          <div className="lg:col-span-2 flex flex-col items-start pr-0 lg:pr-10">
            <LocalizedClientLink href="/" className="group flex items-center gap-3.5 mb-5">
              <div className="relative w-12 h-12 shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo-icon.svg"
                  alt="TamZen"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex flex-col">
                <span className="font-display font-bold text-xl tracking-[0.22em] text-[#FDFBF7] group-hover:text-[#E5C378] transition-colors uppercase leading-none">
                  TamZen
                </span>
                <span className="text-[8px] uppercase tracking-[0.3em] font-mono text-[#E5C378]/80 mt-1">
                  More Than Jewellery
                </span>
              </div>
            </LocalizedClientLink>

            {/* Tagline */}
            <p className="font-display font-serif font-bold text-sm tracking-widest text-[#FDFBF7] uppercase mb-2">
              Culture Lives On
            </p>

            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm mb-6">
              Bespoke stainless steel cultural jewelry embodying Tamil-Eelam symbols of resilience, heritage, and identity. Forged in 316L steel to endure.
            </p>

            {/* Worldwide Shipping status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <span>Worldwide Shipping Available</span>
            </div>

            {/* Follow TAMZEN */}
            <div className="flex flex-col mb-3">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-[#FDFBF7]">
                Follow TAMZEN
              </span>
              <span className="text-[11px] text-neutral-400 font-sans mt-0.5">
                Stay connected for new designs, launches, special offers, and more
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full border border-white/10 hover:border-[#E5C378] bg-white/[0.03] hover:bg-[#E5C378]/10 flex items-center justify-center text-neutral-400 hover:text-[#E5C378] transition-all duration-300 shadow-sm hover:scale-105"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 1: Shop */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display text-xs uppercase tracking-[0.25em] font-bold text-[#E5C378] mb-2 flex items-center gap-1.5">
              <span>Shop</span>
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <LocalizedClientLink
                  href="/store"
                  className="text-neutral-300 hover:text-[#E5C378] transition-colors"
                >
                  Shop All
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/categories/pendants"
                  className="text-neutral-300 hover:text-[#E5C378] transition-colors"
                >
                  Pendants
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/categories/chains"
                  className="text-neutral-300 hover:text-[#E5C378] transition-colors"
                >
                  Chains
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/categories/special-editions"
                  className="text-neutral-300 hover:text-[#E5C378] transition-colors"
                >
                  Special Editions
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Column 2: Brand & Story */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display text-xs uppercase tracking-[0.25em] font-bold text-[#E5C378] mb-2 flex items-center gap-1.5">
              <span>Brand & Story</span>
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <LocalizedClientLink href="/faq" className="text-neutral-300 hover:text-[#E5C378] transition-colors">
                  FAQ &amp; Care
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="#story" className="text-neutral-300 hover:text-[#E5C378] transition-colors">
                  Our Story
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="#story" className="text-neutral-300 hover:text-[#E5C378] transition-colors">
                  316L Stainless Steel
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/account" className="text-neutral-300 hover:text-[#E5C378] transition-colors">
                  My Account
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Information */}
          <div className="flex flex-col gap-3" id="contact-info">
            <h4 className="font-display text-xs uppercase tracking-[0.25em] font-bold text-[#E5C378] mb-2 flex items-center gap-1.5">
              <span>Contact Information</span>
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <span className="text-neutral-400 block text-[11px]">Email Us</span>
                <a
                  href="mailto:contact@tamzen.shop"
                  className="text-neutral-200 hover:text-[#E5C378] transition-colors font-medium text-xs"
                >
                  contact@tamzen.shop
                </a>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  Orders, product questions &amp; support
                </span>
              </li>
              <li className="pt-1">
                <span className="text-neutral-400 block text-[11px]">Support Hours</span>
                <span className="text-neutral-200 block font-medium text-xs">Monday &ndash; Friday</span>
                <span className="text-[10px] text-neutral-400 block">9:00 &ndash; 18:00 CET</span>
              </li>
              <li className="pt-1">
                <span className="text-neutral-400 block text-[11px]">Shipping Worldwide</span>
                <span className="text-neutral-200 block font-medium text-xs">France &bull; Europe &bull; Worldwide</span>
                <span className="text-[10px] text-neutral-400 block">Delivering to customers around the world</span>
              </li>
              <li className="pt-1">
                <LocalizedClientLink href="/contact" className="text-[#E5C378] hover:underline transition-colors text-xs font-medium inline-flex items-center gap-1">
                  <span>Contact Form &amp; Atelier</span>
                  <span>&rarr;</span>
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400 font-sans">
          <p>
            &copy; {new Date().getFullYear()} TamZen. All rights reserved. &bull; More Than Jewellery
          </p>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <span className="hover:text-[#E5C378] transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span>&bull;</span>
            <span className="hover:text-[#E5C378] transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span>&bull;</span>
            <span className="hover:text-[#E5C378] transition-colors cursor-pointer">
              Shipping Policy
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
