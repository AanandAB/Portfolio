import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    base: command === 'build' ? '/Portfolio/' : '/', // Solves local blank screen versus Github Pages deployment base mismatch!
  }
})
