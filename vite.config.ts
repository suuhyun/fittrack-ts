/// <reference types="vitest" />
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tailwindcss from 'tailwindcss'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__mocks__/firebase.ts',
    mockReset: true,
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  resolve: {
    alias: {
      "@/": "/src/"
    }
  },
  
})
