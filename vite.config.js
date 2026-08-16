import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    // GitHub Pages (npm run deploy → gh-pages) serves at /Portfolio/, so the
    // build base MUST be /Portfolio/ or every asset 404s → blank white page.
    // Override for a root-domain host (e.g. Cloudflare) with: VITE_BASE=/ npm run build
    base: command === 'build' ? (process.env.VITE_BASE ?? '/Portfolio/') : '/',
    build: {
      // Suppress the chunk size warning (Three.js is inherently large)
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            'mui-icons': ['@mui/icons-material', '@mui/material', '@emotion/react', '@emotion/styled'],
            'animation': ['framer-motion', 'gsap', '@gsap/react'],
          },
        },
      },
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Minify aggressively
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,  // Remove console.log in production
          drop_debugger: true,
        },
      },
    },
    // Optimize dependency pre-bundling
    optimizeDeps: {
      include: ['react', 'react-dom', 'framer-motion', 'zustand'],
    },
  }
})
