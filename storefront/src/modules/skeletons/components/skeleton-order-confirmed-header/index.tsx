const SkeletonOrderConfirmedHeader = () => {
  return (
    <div className="flex flex-col items-center gap-y-3 pb-8 text-center animate-pulse font-sans">
      <div className="w-16 h-16 rounded-full bg-white/10 border border-white/10 mb-2" />
      <div className="w-48 h-4 bg-white/10 rounded" />
      <div className="w-64 h-8 bg-white/20 rounded-lg" />
      <div className="flex gap-x-4 mt-2">
        <div className="w-24 h-4 bg-white/10 rounded" />
        <div className="w-20 h-4 bg-white/10 rounded" />
      </div>
    </div>
  )
}

export default SkeletonOrderConfirmedHeader
