import { create } from 'zustand'
import { SongType } from './types'

interface PlayerStore {
  currentSong: SongType | null
  isPlaying: boolean
  volume: number
  progress: number
  queue: SongType[]
  queueIndex: number
  setCurrentSong: (song: SongType | null) => void
  setIsPlaying: (playing: boolean) => void
  setVolume: (volume: number) => void
  setProgress: (progress: number) => void
  playSong: (song: SongType, queue?: SongType[]) => void
  nextSong: () => void
  prevSong: () => void
  togglePlay: () => void
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  volume: 0.7,
  progress: 0,
  queue: [],
  queueIndex: -1,

  setCurrentSong: (song) => set({ currentSong: song }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),

  playSong: (song, queue) => set({
    currentSong: song,
    isPlaying: true,
    progress: 0,
    queue: queue || [song],
    queueIndex: 0,
  }),

  nextSong: () => {
    const { queue, queueIndex } = get()
    if (queueIndex < queue.length - 1) {
      const nextIndex = queueIndex + 1
      set({
        currentSong: queue[nextIndex],
        queueIndex: nextIndex,
        progress: 0,
        isPlaying: true,
      })
    }
  },

  prevSong: () => {
    const { queue, queueIndex } = get()
    if (queueIndex > 0) {
      const prevIndex = queueIndex - 1
      set({
        currentSong: queue[prevIndex],
        queueIndex: prevIndex,
        progress: 0,
        isPlaying: true,
      })
    }
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
}))
