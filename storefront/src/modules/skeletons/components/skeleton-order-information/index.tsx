import SkeletonCartTotals from "@modules/skeletons/components/skeleton-cart-totals"

const SkeletonOrderInformation = () => {
  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6 border-b border-white/10">
        <div className="flex flex-col gap-2">
          <div className="w-32 h-4 bg-white/15 rounded mb-2"></div>
          <div className="w-2/6 h-3 bg-white/10 rounded"></div>
          <div className="w-3/6 h-3 bg-white/10 rounded my-1"></div>
          <div className="w-1/6 h-3 bg-white/10 rounded"></div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="w-32 h-4 bg-white/15 rounded mb-2"></div>
          <div className="w-2/6 h-3 bg-white/10 rounded"></div>
          <div className="w-3/6 h-3 bg-white/10 rounded my-1"></div>
          <div className="w-2/6 h-3 bg-white/10 rounded"></div>
        </div>
      </div>
      <div className="pt-2">
        <SkeletonCartTotals />
      </div>
    </div>
  )
}

export default SkeletonOrderInformation
