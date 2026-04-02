import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          vendor: ['react', 'react-dom'],
          // UI libraries
          ui: ['lucide-react', 'framer-motion', 'react-hot-toast'],
          // State management
          store: ['zustand'],
          // Forms and validation
          forms: ['react-hook-form', '@hookform/resolvers'],
          // Utilities
          utils: ['date-fns', 'clsx', 'tailwind-merge'],
        },
      },
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 300,
    // Enable compression and optimization
    minify: 'esbuild',
    target: 'esnext',
    // Enable source maps for better debugging
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom', 
      'zustand',
      'framer-motion',
      'lucide-react'
    ],
    exclude: ['@tailwindcss/vite']
  },
  // Performance optimizations
  server: {
    hmr: {
      overlay: false
    }
  },
  // Enable advanced compression
  esbuild: {
    drop: ['console', 'debugger'],
  },
})
