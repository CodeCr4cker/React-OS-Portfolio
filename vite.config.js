import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo.png'],
      manifest: {
        name: 'Divyanshu Pandey — DivyOS',
        short_name: 'DivyOS',
        description: 'Futuristic OS-style React portfolio by Divyanshu Pandey',
        start_url: '/',
        display: 'standalone',
        background_color: '#0a0c14',
        theme_color: '#00d4ff',
        icons: [
          { src: 'https://raw.githubusercontent.com/CodeCr4cker/Web-Storage/main/my%20all%20website%20logo%20image/logo.png', sizes: '192x192', type: 'image/png' },
          { src: 'https://raw.githubusercontent.com/CodeCr4cker/Web-Storage/main/my%20all%20website%20logo%20image/logo.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          { urlPattern: /^https:\/\/fonts\.googleapis\.com/, handler: 'CacheFirst' },
          { urlPattern: /^https:\/\/fonts\.gstatic\.com/, handler: 'CacheFirst' },
          { urlPattern: /^https:\/\/cdnjs\.cloudflare\.com/, handler: 'CacheFirst' },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-core': ['react', 'react-dom'],
          'framer': ['framer-motion'],
          'rnd': ['react-rnd'],
        },
      },
    },
  },
})
