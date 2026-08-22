import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  build: {
    // Target modern browsers for smaller output
    target: 'es2020',
    
    // Inline small assets as base64 (saves HTTP requests)
    assetsInlineLimit: 4096,
    
    // Enable source maps only in dev
    sourcemap: false,
    
    // CSS code splitting for faster initial load
    cssCodeSplit: true,
    
    rollupOptions: {
      output: {
        // Smart chunk splitting - keeps initial JS load under 200KB
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // React core — needed immediately (ship together)
            if (id.includes('react-dom') || id.includes('react/') || id.includes('react-router')) {
              return 'vendor-react';
            }
            // Three.js ecosystem — very heavy, lazy loaded via Suspense
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-three';
            }
            // Framer Motion — separate, deferred
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            // Charts — admin only, very large
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'vendor-charts';
            }
            // Icons — small but shared
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // Swiper — lazy loaded for carousel
            if (id.includes('swiper')) {
              return 'vendor-swiper';
            }
            // Everything else
            return 'vendor';
          }
        },
        
        // Consistent file naming for better CDN caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    },
  },
  
  server: {
    hmr: { overlay: false },    // Disable error overlay (less visual noise)
  }
})
