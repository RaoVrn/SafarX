export interface TravelMemory {
  id: string
  title: string
  description: string
  location: {
    lat: number
    lng: number
    address: string
    country: string
    city: string
  }
  date: Date
  images: string[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: "light" | "dark"
  mapStyle: "standard" | "satellite" | "terrain"
  defaultZoom: number
  autoLocation: boolean
}

export interface Journey {
  id: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  memories: TravelMemory[]
  isPublic: boolean
  coverImage?: string
  userId: string
}

export interface JourneyDocument {
  id: string
  userId: string
  title: string
  description: string
  coverImage?: string
  startDate?: string
  endDate?: string
  createdAt: import("firebase/firestore").Timestamp
  updatedAt: import("firebase/firestore").Timestamp
}