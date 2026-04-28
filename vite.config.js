import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true,
    port: 5175,
    open: true,
    strictPort: true
  },
  // Explicitly define the project root, assuming index.html is here
  root: '.',
  // Define the directory for static assets
  publicDir: 'public',
  // Configure the build output
  build: {
    outDir: 'dist', // Output directory for production build
    rollupOptions: {
      input: './index.html' // Specify the main entry HTML file
    }
  }
})