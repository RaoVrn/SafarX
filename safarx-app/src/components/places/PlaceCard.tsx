import { TravelMemory } from "@/types"

interface PlaceCardProps {
  memory: TravelMemory
  onClick?: () => void
}

export function PlaceCard({ memory, onClick }: PlaceCardProps) {
  return (
    <div 
      className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors cursor-pointer border border-gray-700"
      onClick={onClick}
    >
      <div className="aspect-video bg-gray-700 rounded-md mb-3 overflow-hidden">
        {memory.images.length > 0 ? (
          <img 
            src={memory.images[0]} 
            alt={memory.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      
      <h3 className="font-semibold text-white mb-1">{memory.title}</h3>
      <p className="text-gray-400 text-sm mb-2 line-clamp-2">{memory.description}</p>
      
      <div className="flex items-center text-gray-500 text-xs mb-2">
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {memory.location.city}, {memory.location.country}
      </div>
      
      {memory.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {memory.tags.slice(0, 3).map((tag: string, index: number) => (
            <span 
              key={index} 
              className="inline-block bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
          {memory.tags.length > 3 && (
            <span className="text-gray-500 text-xs">+{memory.tags.length - 3} more</span>
          )}
        </div>
      )}
    </div>
  )
}