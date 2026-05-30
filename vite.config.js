import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' keeps asset URLs relative so the build works when served from a
// GitHub Pages project subpath (gh-pages branch) as well as from the root.
export default defineConfig({
  base: './',
  plugins: [react()],
})
