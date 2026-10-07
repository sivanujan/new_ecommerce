"use client"

import { useState } from "react"
import { TrendingUp } from "lucide-react"

interface SalesPoint {
  date: string
  label: string
  amount: number
  count: number
}

export default function SalesChart({ data }: { data: SalesPoint[] }) {
  const [hoveredPoint, setHoveredPoint] = useState<SalesPoint | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const maxAmount = Math.max(...data.map((d) => d.amount), 500)
  const totalPeriodRevenue = data.reduce((acc, d) => acc + d.amount, 0)
  const totalPeriodOrders = data.reduce((acc, d) => acc + d.count, 0)

  const chartHeight = 160
  const chartWidth = 700
  const paddingX = 20
  const paddingY = 20
  const usableWidth = chartWidth - paddingX * 2
  const usableHeight = chartHeight - paddingY * 2

  const points = data.map((d, i) => {
    const x = paddingX + (i / Math.max(data.length - 1, 1)) * usableWidth
    const y = paddingY + usableHeight - (d.amount / maxAmount) * usableHeight
    return { x, y, ...d }
  })

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`
  }, "")

  const areaD = `${pathD} L ${paddingX + usableWidth} ${chartHeight - paddingY} L ${paddingX} ${chartHeight - paddingY} Z`

  return (
    <div className="bg-[#121217] rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#D4AF37]" />
            <h3 className="font-serif font-bold text-lg text-[#F5F0E8]">
              Sales Activity
            </h3>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Revenue trajectory over the past 30 days
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-[#9CA3AF] block font-semibold">
              30-Day Total
            </span>
            <span className="font-serif font-bold text-base text-[#D4AF37]">
              €{totalPeriodRevenue.toFixed(2)}
            </span>
          </div>

          <div className="h-7 w-[1px] bg-white/10" />

          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-[#9CA3AF] block font-semibold">
              Orders Placed
            </span>
            <span className="font-bold text-base text-[#F5F0E8]">
              {totalPeriodOrders}
            </span>
          </div>
        </div>
      </div>

      <div className="min-h-[28px] flex items-center justify-between text-xs px-2">
        {hoveredPoint ? (
          <div className="flex items-center gap-4 animate-in fade-in duration-150">
            <span className="font-mono text-[#D4AF37] font-semibold">
              {hoveredPoint.label}:
            </span>
            <span className="text-[#F5F0E8] font-bold">
              €{hoveredPoint.amount.toFixed(2)} EUR
            </span>
            <span className="text-[#9CA3AF]">
              ({hoveredPoint.count} order{hoveredPoint.count === 1 ? "" : "s"})
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-[#9CA3AF]/60 italic">
            Hover over the timeline to inspect daily revenue
          </span>
        )}
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-44 overflow-visible"
        >
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingY + usableHeight * (1 - ratio)
            return (
              <line
                key={ratio}
                x1={paddingX}
                y1={y}
                x2={chartWidth - paddingX}
                y2={y}
                stroke="rgba(255,255,255,0.05)"
                strokeDasharray="4 4"
              />
            )
          })}

          <path d={areaD} fill="url(#goldGradient)" />

          <path
            d={pathD}
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((p, idx) => (
            <g
              key={p.date}
              className="cursor-pointer group"
              onMouseEnter={() => {
                setHoveredPoint(p)
                setActiveIndex(idx)
              }}
              onMouseLeave={() => {
                setHoveredPoint(null)
                setActiveIndex(null)
              }}
            >
              <circle cx={p.x} cy={p.y} r="10" fill="transparent" />
              <circle
                cx={p.x}
                cy={p.y}
                r={activeIndex === idx ? "5" : p.amount > 0 ? "3" : "1.5"}
                fill={activeIndex === idx ? "#F5F0E8" : "#D4AF37"}
                stroke="#121217"
                strokeWidth="2"
                className="transition-all duration-150"
              />
            </g>
          ))}
        </svg>

        <div className="flex items-center justify-between text-[10px] text-[#9CA3AF]/60 font-mono pt-2 px-2 border-t border-white/5">
          <span>{data[0]?.label}</span>
          <span>{data[Math.floor(data.length / 2)]?.label}</span>
          <span>{data[data.length - 1]?.label}</span>
        </div>
      </div>
    </div>
  )
}
