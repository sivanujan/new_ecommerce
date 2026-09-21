import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="w-full bg-[#0B0B0C] min-h-screen text-white flex flex-col py-10 sm:py-16">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="flex flex-col gap-8">
            {/* Page Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-6 border-b border-white/10">
              <div>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold text-[#E5C378] font-sans">
                  Atelier Shopping Bag
                </span>
                <h1 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight mt-1">
                  Your Cart
                </h1>
              </div>

              <div className="inline-flex items-center gap-2">
                <span className="h-[1px] w-6 bg-[#E5C378]/50" />
                <span className="text-xs font-semibold text-[#F3D798] tracking-wider font-sans">
                  எங்கள் வேர் எங்கள் அடையாளம்
                </span>
                <span className="h-[1px] w-6 bg-[#E5C378]/50" />
              </div>
            </div>

            {/* 2-Column Luxury Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
              {/* Left Column (8 cols): Items List */}
              <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
                {!customer && <SignInPrompt />}
                <div className="bg-[#121215] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
                  <ItemsTemplate cart={cart} />
                </div>
              </div>

              {/* Right Column (4 cols): Sticky Summary */}
              <div className="lg:col-span-5 xl:col-span-4 w-full">
                <div className="bg-[#121215] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl lg:sticky lg:top-28">
                  <Summary cart={cart as any} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyCartMessage />
        )}
      </div>
    </div>
  )
}

export default CartTemplate
