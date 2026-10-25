/*
 * BEGINNER GUIDE: vite.config.js
 * This file handles the this module.
 * Syllabus topics visible here: props / component composition.
 * The code below keeps the original behaviour; comments explain the main jobs.
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Forward /api/... to the Express + MySQL backend (npm run server).
    proxy: {
      '/api': 'http://127.0.0.1:5000',
    },
  },
})
