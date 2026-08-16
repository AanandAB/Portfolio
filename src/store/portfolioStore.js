import { create } from 'zustand'

export const usePortfolioStore = create((set, get) => ({
  // Scroll progress through space (0 = start, 1 = final planet)
  scrollDepth: 0,
  setScrollDepth: (depth) => set({ scrollDepth: depth }),

  // Legacy — kept for component compatibility
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),

  // Which project clip is active (0-9)
  activeProjectIdx: 0,
  setActiveProjectIdx: (idx) => set({ activeProjectIdx: idx }),
}))
