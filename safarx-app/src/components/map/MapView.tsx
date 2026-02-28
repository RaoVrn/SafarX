import { TravelMemory } from "@/types"
import { MAP_CONFIG } from "@/constants"

interface MapViewProps {
  memories: TravelMemory[]
  center?: { lat: number; lng: number }
  zoom?: number
  onMemoryClick?: (memory: TravelMemory) => void
}

export function MapView({ 
  memories, 
  center = MAP_CONFIG.defaultCenter, 
  zoom = MAP_CONFIG.defaultZoom,
  onMemoryClick 
}: MapViewProps) {
  return (
    <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700">
      <div className="text-center text-gray-400">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">Interactive Map</h3>
        <p className="text-sm">
          Map component will be integrated here
          <br />
          Showing {memories.length} memories
        </p>
      </div>
    </div>
  )
}