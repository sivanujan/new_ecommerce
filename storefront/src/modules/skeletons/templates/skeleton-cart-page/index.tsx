import repeat from "@lib/util/repeat"
import SkeletonCartItem from "@modules/skeletons/components/skeleton-cart-item"
import SkeletonCodeForm from "@modules/skeletons/components/skeleton-code-form"
import SkeletonOrderSummary from "@modules/skeletons/components/skeleton-order-summary"

const SkeletonCartPage = () => {
  return (
    <div className="w-full bg-[#0B0B0C] min-h-screen text-white flex flex-col py-10 sm:py-16 font-sans">
      <div className="content-container">
        <div className="flex flex-col gap-8">
          {/* Page Header Banner Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-6 border-b border-white/10">
            <div>
              <div className="w-36 h-3 bg-white/10 rounded animate-pulse mb-2.5" />
              <div className="w-52 h-9 bg-white/15 rounded-lg animate-pulse" />
            </div>

            <div className="w-40 h-3 bg-white/10 rounded animate-pulse hidden sm:block" />
          </div>

          {/* 2-Column Luxury Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
            {/* Left Column (Items) */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
              <div className="bg-[#121215] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <div className="w-28 h-6 bg-white/15 rounded animate-pulse" />
                  <div className="w-16 h-4 bg-white/10 rounded animate-pulse" />
                </div>
                <div className="flex flex-col divide-y divide-white/10">
                  {repeat(3).map((index) => (
                    <SkeletonCartItem key={index} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (Summary) */}
            <div className="lg:col-span-5 xl:col-span-4 w-full">
              <div className="bg-[#121215] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col gap-y-6">
                <SkeletonOrderSummary />
                <div className="border-t border-white/10 pt-4">
                  <SkeletonCodeForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonCartPage
