import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// base './' lets the build run from any sub-path (static hosting, preview links).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
