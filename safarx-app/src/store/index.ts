import { TravelMemory, User, Journey } from "@/types"

interface AppState {
  user: User | null
  memories: TravelMemory[]
  journeys: Journey[]
  selectedMemory: TravelMemory | null
  selectedJourney: Journey | null
  isLoading: boolean
  error: string | null
}

interface AppActions {
  setUser: (user: User | null) => void
  addMemory: (memory: TravelMemory) => void
  updateMemory: (id: string, memory: Partial<TravelMemory>) => void
  deleteMemory: (id: string) => void
  setSelectedMemory: (memory: TravelMemory | null) => void
  addJourney: (journey: Journey) => void
  updateJourney: (id: string, journey: Partial<Journey>) => void
  deleteJourney: (id: string) => void
  setSelectedJourney: (journey: Journey | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export type AppStore = AppState & AppActions

export const initialState: AppState = {
  user: null,
  memories: [],
  journeys: [],
  selectedMemory: null,
  selectedJourney: null,
  isLoading: false,
  error: null,
}