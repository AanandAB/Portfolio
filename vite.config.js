import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    base: command === 'build' ? '/Portfolio/' : '/',
    build: {
      // Suppress the chunk size warning (Three.js is inherently large)
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            // Split Three.js + R3F into its own chunk — loaded only when 3D scene mounts
            'three-vendor': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
            // Split MUI icons into its own chunk
            'mui-icons': ['@mui/icons-material', '@mui/material', '@emotion/react', '@emotion/styled'],
            // Split animation libs
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
