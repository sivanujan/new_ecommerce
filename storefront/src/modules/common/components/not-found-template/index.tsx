import { listProducts } from "@lib/data/products"
import { retrieveCart } from "@lib/data/cart"
import { getRegion } from "@lib/data/regions"
import { convertToLocale } from "@lib/util/money"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const FALLBACK_PRODUCTS = [
  {
    id: "prod_mysore",
    title: "Sari en Soie Mysore Émeraude",
    handle: "sari-mysore-emeraude",
    thumbnail: "https://picsum.photos/seed/sari-mysore-emeraude-1/900/1100",
    price: 280,
    category: "Signature Silk",
  },
  {
    id: "prod_chain",
    title: "Chaîne Maille Vénitienne Or 18k",
    handle: "chaine-maille-venitienne",
    thumbnail: "https://picsum.photos/seed/chaine-maille-venitienne-1/900/1100",
    price: 490,
    category: "Gold Chains",
  },
  {
    id: "prod_pendant",
    title: "Pendentif Carte Tamil Eelam Or 18k",
    handle: "pendentif-carte-tamil-eelam",
    thumbnail: "https://picsum.photos/seed/pendentif-carte-tamil-eelam-1/900/1100",
    price: 380,
    category: "Heritage Pendants",
  },
  {
    id: "prod_bague",
    title: "Bague Gravure Tamoule Or 18k",
    handle: "bague-gravure-tamoule",
    thumbnail: "https://picsum.photos/seed/bague-gravure-tamoule-1/900/1100",
    price: 320,
    category: "Special Editions",
  },
]

export default async function NotFoundTemplate({
  countryCode = "fr",
}: {
  countryCode?: string
}) {
  const cart = await retrieveCart().catch(() => null)
  const cartItems = cart?.items || []
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  const region = await getRegion(countryCode).catch(() => null)
  const currencyCode = region?.currency_code || cart?.currency_code || "EUR"

  const productsData = await listProducts({
    countryCode,
    queryParams: { limit: 4 },
  }).catch(() => null)

  const fetchedProducts = productsData?.response?.products || []
  const hasFetchedProducts = fetchedProducts.length > 0

  return (
    <div className="w-full bg-[#0B0B0C] min-h-[calc(100vh-64px)] text-white font-sans py-12 sm:py-20 overflow-hidden relative selection:bg-[#E5C378]/30 selection:text-[#F3D798]">
      {/* Luxury Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-b from-[#E5C378]/15 via-[#B88728]/5 to-transparent blur-[140px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#E5C378]/5 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 left-10 w-72 h-72 rounded-full bg-[#E5C378]/5 blur-[100px]" />

      <div className="content-container max-w-5xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">
        {/* ============================================================ */}
        {/* HERO BADGE */}
        {/* ============================================================ */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.03] border border-[#E5C378]/30 mb-6 backdrop-blur-md shadow-[0_0_25px_rgba(229,195,120,0.12)]">
          <span className="w-2 h-2 rounded-full bg-[#E5C378] animate-pulse" />
          <span className="text-[11px] uppercase tracking-[0.22em] font-mono font-bold text-[#E5C378]">
            404 • Lost in the Royal Vault
          </span>
        </div>

        {/* Big Stylized 404 Emblem */}
        <div className="relative my-2 select-none">
          <span className="font-display font-serif text-8xl sm:text-9xl md:text-[11.5rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#FFF2CC] via-[#E5C378] to-[#695228] leading-none drop-shadow-[0_12px_40px_rgba(229,195,120,0.3)]">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.35em] uppercase text-[#E5C378] border-y border-[#E5C378]/40 py-1 px-5 bg-[#0B0B0C]/90 backdrop-blur-md shadow-lg">
              Page Not Found
            </span>
          </div>
        </div>

        {/* Serif Heading */}
        <h1 className="font-display font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#FDFBF7] tracking-tight mt-3 mb-2">
          Even Our Master Jewelers Couldn&apos;t Find This Piece
        </h1>

        {/* Tamil Motto & Funny Subtitle */}
        <p className="text-xs sm:text-sm font-serif italic text-[#E5C378]/90 tracking-wide mb-3">
          வழி தவறிவிட்டீர்களா? • எங்கள் பொக்கிஷங்கள் இங்கே உள்ளன
        </p>
        <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed mb-8">
          It looks like this link slipped through the cracks of our jewelry vault, or perhaps one of our artisans polished it so clean that it became completely invisible. Don&apos;t worry — real treasures await below.
        </p>

        {/* ============================================================ */}
        {/* PLAYFUL SHOPPING BAG / CART CHECK BANNER */}
        {/* ============================================================ */}
        <div className="w-full max-w-2xl mb-12 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#1A1A20]/95 via-[#141418]/95 to-[#101014]/95 border border-[#E5C378]/35 shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-md relative overflow-hidden group hover:border-[#E5C378]/60 transition-all duration-300">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-[#E5C378]/10 blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-left">
            {/* Bag Icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F3D798]/20 via-[#E5C378]/10 to-transparent border border-[#E5C378]/40 flex items-center justify-center text-[#E5C378] shrink-0 shadow-[0_0_25px_rgba(229,195,120,0.2)]">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5 flex-wrap">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#E5C378]/20 text-[#E5C378] border border-[#E5C378]/30">
                  {cartCount > 0 ? `🛒 ${cartCount} Piece${cartCount === 1 ? "" : "s"} Waiting in Cart` : "🧺 Atelier Bag Check"}
                </span>
                <span className="text-xs text-neutral-500 font-mono hidden sm:inline">•</span>
                <span className="text-[11px] text-neutral-400 font-serif italic hidden sm:inline">
                  TamZen Vault
                </span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-200 leading-snug">
                {cartCount > 0 ? (
                  <>
                    <strong className="text-[#F3D798]">Wait a second... Is this your lost loot?</strong> You&apos;re wandering through empty hallways, but you left items sitting all alone in your shopping cart! Go rescue them before our jewelers pack them back into the vault.
                  </>
                ) : (
                  <>
                    <strong className="text-[#F3D798]">Tragically Empty!</strong> You got lost <em className="text-white">and</em> your shopping bag is holding nothing but thin air. Why not wrap yourself in gold or Mysore silk before you leave?
                  </>
                )}
              </p>

              {/* Show actual items in the cart if any! */}
              {cartItems.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
                  <span className="text-[10px] uppercase font-mono text-neutral-400 shrink-0">In Cart:</span>
                  {cartItems.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-xl px-2.5 py-1.5 shrink-0 hover:border-[#E5C378]/40 transition-colors"
                    >
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-neutral-900 border border-white/10 shrink-0">
                        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt={item.title || "Item"}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-[#E5C378]">
                            TZ
                          </div>
                        )}
                      </div>
                      <div className="text-left text-xs max-w-[130px]">
                        <p className="font-semibold text-white truncate text-[11px] leading-tight">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-[#E5C378] font-mono">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                  {cartItems.length > 3 && (
                    <span className="text-[10px] text-[#E5C378] font-mono shrink-0 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                      +{cartItems.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            <LocalizedClientLink
              href="/cart"
              className="w-full sm:w-auto shrink-0 self-center inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-[0_2px_18px_rgba(229,195,120,0.35)] hover:brightness-110 active:scale-95 transition-all"
            >
              <span>{cartCount > 0 ? "Review My Cart" : "Check Cart"}</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </LocalizedClientLink>
          </div>
        </div>

        {/* ============================================================ */}
        {/* MAIN NAVIGATION BUTTONS */}
        {/* ============================================================ */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto mb-16">
          <LocalizedClientLink
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 font-bold text-xs uppercase tracking-[0.16em] shadow-[0_4px_25px_rgba(229,195,120,0.35)] hover:shadow-[0_6px_30px_rgba(229,195,120,0.5)] hover:brightness-105 active:scale-[0.99] transition-all"
          >
            <span>Return to Atelier</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/store"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-neutral-200 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all"
          >
            <span>Explore All Collections</span>
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-transparent hover:bg-white/5 text-neutral-400 hover:text-[#E5C378] text-xs font-medium uppercase tracking-wider transition-all"
          >
            <span>Contact Concierge</span>
          </LocalizedClientLink>
        </div>

        {/* ============================================================ */}
        {/* SIGNATURE CREATIONS SHOWCASE */}
        {/* ============================================================ */}
        <div className="w-full pt-10 border-t border-white/10">
          <div className="flex flex-col items-center mb-8">
            <span className="text-[11px] uppercase tracking-[0.25em] font-mono font-semibold text-[#E5C378] mb-1">
              Curated For You
            </span>
            <h2 className="font-display font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Feast Your Eyes on These Instead
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-lg text-center">
              Since you took an unexpected detour, discover our most coveted Tamil heritage creations.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full text-left">
            {hasFetchedProducts
              ? fetchedProducts.map((p) => {
                  const minPrice = p.variants?.[0]?.calculated_price?.calculated_amount
                  const formattedPrice = minPrice
                    ? convertToLocale({ amount: minPrice, currency_code: currencyCode })
                    : "Discover"

                  return (
                    <LocalizedClientLink
                      key={p.id}
                      href={`/products/${p.handle}`}
                      className="group flex flex-col rounded-2xl bg-[#121215] border border-white/10 hover:border-[#E5C378]/50 p-3 sm:p-4 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(229,195,120,0.15)]"
                    >
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-900 border border-white/5 mb-3">
                        {p.thumbnail ? (
                          <Image
                            src={p.thumbnail}
                            alt={p.title || "TamZen Jewelry"}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-600">
                            TamZen
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col flex-1 justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-[#E5C378] uppercase tracking-wider block mb-1">
                            {p.collection?.title || "Signature"}
                          </span>
                          <h3 className="font-display font-bold text-xs sm:text-sm text-white line-clamp-2 group-hover:text-[#E5C378] transition-colors">
                            {p.title}
                          </h3>
                        </div>

                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="font-mono text-xs sm:text-sm font-semibold text-[#F3D798]">
                            {formattedPrice}
                          </span>
                          <span className="text-[10px] text-neutral-400 group-hover:text-white uppercase tracking-wider font-semibold flex items-center gap-1 transition-colors">
                            View &rarr;
                          </span>
                        </div>
                      </div>
                    </LocalizedClientLink>
                  )
                })
              : FALLBACK_PRODUCTS.map((p) => (
                  <LocalizedClientLink
                    key={p.id}
                    href={`/products/${p.handle}`}
                    className="group flex flex-col rounded-2xl bg-[#121215] border border-white/10 hover:border-[#E5C378]/50 p-3 sm:p-4 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(229,195,120,0.15)]"
                  >
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-900 border border-white/5 mb-3">
                      <Image
                        src={p.thumbnail}
                        alt={p.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex flex-col flex-1 justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-[#E5C378] uppercase tracking-wider block mb-1">
                          {p.category}
                        </span>
                        <h3 className="font-display font-bold text-xs sm:text-sm text-white line-clamp-2 group-hover:text-[#E5C378] transition-colors">
                          {p.title}
                        </h3>
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="font-mono text-xs sm:text-sm font-semibold text-[#F3D798]">
                          {convertToLocale({ amount: p.price, currency_code: "EUR" })}
                        </span>
                        <span className="text-[10px] text-neutral-400 group-hover:text-white uppercase tracking-wider font-semibold flex items-center gap-1 transition-colors">
                          View &rarr;
                        </span>
                      </div>
                    </div>
                  </LocalizedClientLink>
                ))}
          </div>
        </div>

        {/* Footer Motto */}
        <div className="mt-14 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-neutral-500 font-mono tracking-wider">
            TAMZEN • எங்கள் வேர் எங்கள் அடையாளம் • Wear Your Roots
          </p>
        </div>
      </div>
    </div>
  )
}
