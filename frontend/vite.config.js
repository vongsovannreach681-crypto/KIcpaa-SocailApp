import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    allowedHosts: ["0w805pd5-5174.asse.devtunnels.ms"],
    proxy: {
      "/api": "http://127.0.0.1:8000",
      "/storage": "http://127.0.0.1:8000",
    },
  },
})
