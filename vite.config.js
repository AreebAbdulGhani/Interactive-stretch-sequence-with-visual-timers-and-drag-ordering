import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Interactive-stretch-sequence-with-visual-timers-and-drag-ordering/', // GitHub Pages base path
})
