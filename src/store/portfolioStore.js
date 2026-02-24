import { create } from 'zustand'

export const usePortfolioStore = create((set, get) => ({
  // Scroll
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
}))
