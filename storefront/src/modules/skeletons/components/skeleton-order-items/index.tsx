const SkeletonOrderItems = () => {
  return (
    <div className="flex flex-col gap-y-4 font-sans">
      <div className="w-36 h-5 bg-white/15 rounded animate-pulse mb-2" />
      <div className="flex flex-col divide-y divide-white/10">
        {[0, 1].map((index) => (
          <div key={index} className="flex items-center justify-between gap-4 py-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/5 border border-white/10 shrink-0" />
              <div className="flex flex-col gap-2">
                <div className="w-40 sm:w-56 h-4 bg-white/15 rounded" />
                <div className="w-24 h-3 bg-white/10 rounded" />
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="w-16 h-5 bg-white/15 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkeletonOrderItems
