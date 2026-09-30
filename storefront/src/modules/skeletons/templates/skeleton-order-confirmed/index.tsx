import SkeletonOrderConfirmedHeader from "@modules/skeletons/components/skeleton-order-confirmed-header"
import SkeletonOrderInformation from "@modules/skeletons/components/skeleton-order-information"
import SkeletonOrderItems from "@modules/skeletons/components/skeleton-order-items"

const SkeletonOrderConfirmed = () => {
  return (
    <div className="bg-[#0B0B0C] min-h-[calc(100vh-64px)] py-8 sm:py-14 text-white font-sans">
      <div className="content-container max-w-4xl mx-auto px-4 sm:px-6 flex flex-col gap-y-8">
        <div className="bg-[#121215] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <SkeletonOrderConfirmedHeader />
          <div className="my-8 border-t border-white/10 pt-6">
            <SkeletonOrderItems />
          </div>
          <div className="border-t border-white/10 pt-6">
            <SkeletonOrderInformation />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonOrderConfirmed
