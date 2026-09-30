const SkeletonCartTotals = ({ header = true }: { header?: boolean }) => {
  return (
    <div className="flex flex-col gap-y-3 font-sans">
      {header && <div className="w-32 h-5 bg-white/15 rounded animate-pulse mb-3" />}
      <div className="flex items-center justify-between">
        <div className="w-28 h-3.5 bg-white/10 rounded animate-pulse" />
        <div className="w-16 h-3.5 bg-white/15 rounded animate-pulse" />
      </div>

      <div className="flex items-center justify-between">
        <div className="w-20 h-3.5 bg-white/10 rounded animate-pulse" />
        <div className="w-24 h-3.5 bg-white/15 rounded animate-pulse" />
      </div>

      <div className="flex items-center justify-between">
        <div className="w-16 h-3.5 bg-white/10 rounded animate-pulse" />
        <div className="w-14 h-3.5 bg-white/15 rounded animate-pulse" />
      </div>

      <div className="w-full border-b border-white/10 my-2" />

      <div className="flex items-center justify-between pt-1">
        <div className="w-20 h-5 bg-white/20 rounded animate-pulse" />
        <div className="w-24 h-6 bg-[#E5C378]/30 rounded animate-pulse" />
      </div>
    </div>
  )
}

export default SkeletonCartTotals
