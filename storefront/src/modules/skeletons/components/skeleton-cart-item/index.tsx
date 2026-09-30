const SkeletonCartItem = () => {
  return (
    <div className="flex items-start justify-between gap-4 py-5 font-sans">
      <div className="flex items-start gap-4">
        {/* Thumbnail */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white/5 border border-white/10 shrink-0 animate-pulse" />

        {/* Details */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="w-36 sm:w-48 h-4 bg-white/15 rounded animate-pulse" />
          <div className="w-24 sm:w-32 h-3 bg-white/10 rounded animate-pulse" />
          <div className="w-20 h-7 bg-white/5 rounded-lg border border-white/10 animate-pulse mt-2" />
        </div>
      </div>

      {/* Price */}
      <div className="flex flex-col items-end gap-2 pt-1">
        <div className="w-20 h-5 bg-white/15 rounded animate-pulse" />
        <div className="w-12 h-3 bg-white/10 rounded animate-pulse" />
      </div>
    </div>
  )
}

export default SkeletonCartItem
