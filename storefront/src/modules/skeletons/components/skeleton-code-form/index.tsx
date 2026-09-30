const SkeletonCodeForm = () => {
  return (
    <div className="w-full flex flex-col gap-2 font-sans">
      <div className="w-28 h-3.5 bg-white/10 rounded animate-pulse mb-1" />
      <div className="flex items-center gap-2">
        <div className="h-11 flex-1 bg-white/5 border border-white/10 rounded-xl animate-pulse" />
        <div className="h-11 w-20 bg-white/10 rounded-xl animate-pulse" />
      </div>
    </div>
  )
}

export default SkeletonCodeForm
