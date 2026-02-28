export const APP_CONFIG = {
  name: "SafarX",
  description: "Map your journey. Preserve your memories.",
  url: "https://safarx.com",
  version: "1.0.0",
} as const

export const MAP_CONFIG = {
  defaultCenter: { lat: 40.7128, lng: -74.0060 }, // New York City
  defaultZoom: 10,
  maxZoom: 18,
  minZoom: 2,
  styles: {
    standard: "roadmap",
    satellite: "satellite",
    terrain: "terrain",
  },
} as const

export const ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  memories: "/memories",
  journeys: "/journeys",
  profile: "/profile",
  settings: "/settings",
} as const

export const STORAGE_KEYS = {
  user: "safarx_user",
  memories: "safarx_memories",
  preferences: "safarx_preferences",
  journeys: "safarx_journeys",
} as const

export const API_ENDPOINTS = {
  memories: "/api/memories",
  journeys: "/api/journeys",
  upload: "/api/upload",
  user: "/api/user",
} as const