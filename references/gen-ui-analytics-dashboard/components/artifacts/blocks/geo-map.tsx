"use client"

import { useState } from "react"
import { Plus, Minus, X } from "lucide-react"

interface GeoMapProps {
  type: "map"
  bubbles: Array<{
    id: string
    name: string
    lat: number
    lng: number
    value: number
    label: string
    sublabel?: string
  }>
}

export function GeoMap({ bubbles }: GeoMapProps) {
  const [zoom, setZoom] = useState(1)
  const [selectedBubble, setSelectedBubble] = useState<string | null>(null)

  // Map projection helpers (simplified Mercator)
  const projectLng = (lng: number) => ((lng + 180) / 360) * 100
  const projectLat = (lat: number) => {
    const latRad = (lat * Math.PI) / 180
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2))
    return 50 - (mercN * 100) / (2 * Math.PI)
  }

  const selected = bubbles.find((b) => b.id === selectedBubble)

  return (
    <div className="relative overflow-hidden rounded-lg border border-border">
      {/* Map Controls */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
          className="rounded bg-card p-1.5 shadow-sm transition-colors hover:bg-muted"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
          className="rounded bg-card p-1.5 shadow-sm transition-colors hover:bg-muted"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>

      {/* Map Container */}
      <div
        className="relative h-80 w-full bg-[#f8f4f0]"
        style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
      >
        {/* Simplified world map background */}
        <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
          {/* Ocean/background */}
          <rect fill="#e8e4e0" width="100" height="60" />

          {/* Simplified continents */}
          <path d="M20,25 L30,20 L35,25 L30,35 L25,40 L20,35 Z" fill="#f0ece8" stroke="#d8d4d0" strokeWidth="0.2" />
          <path
            d="M45,15 L70,12 L75,20 L72,35 L65,40 L55,38 L48,30 L45,20 Z"
            fill="#f0ece8"
            stroke="#d8d4d0"
            strokeWidth="0.2"
          />
          <path d="M52,42 L60,40 L68,45 L58,50 L52,48 Z" fill="#f0ece8" stroke="#d8d4d0" strokeWidth="0.2" />
          <path d="M75,15 L90,18 L88,30 L78,28 L75,20 Z" fill="#f0ece8" stroke="#d8d4d0" strokeWidth="0.2" />
          <path d="M78,35 L90,38 L88,50 L75,48 Z" fill="#f0ece8" stroke="#d8d4d0" strokeWidth="0.2" />
        </svg>

        {/* Data Bubbles */}
        {bubbles.map((bubble) => {
          const x = projectLng(bubble.lng)
          const y = projectLat(bubble.lat)
          const size = Math.sqrt(bubble.value / 1000000) * 3 + 2

          return (
            <button
              key={bubble.id}
              onClick={() => setSelectedBubble(bubble.id)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
            >
              <div
                className="rounded-full bg-accent/70 border-2 border-accent"
                style={{
                  width: `${size * 8}px`,
                  height: `${size * 8}px`,
                }}
              />
            </button>
          )
        })}
      </div>

      {/* Tooltip */}
      {selected && (
        <div className="absolute right-4 top-4 z-20 rounded-lg bg-card p-3 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-foreground">{selected.name}</p>
              <p className="text-sm text-muted-foreground">{selected.label}</p>
              {selected.sublabel && <p className="text-sm text-muted-foreground">{selected.sublabel}</p>}
            </div>
            <button onClick={() => setSelectedBubble(null)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Attribution */}
      <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground">© OpenStreetMap contributors</div>
    </div>
  )
}
