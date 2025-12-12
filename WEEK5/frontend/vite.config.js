import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss(),],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: ["hv18"],
    hmr: {
      host: 'hv18',     
      protocol: 'wss',  
      port: 443         
    },
    proxy: {
      '/api': {
        target: 'http://nginx',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
