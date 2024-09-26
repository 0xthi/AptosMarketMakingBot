import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: [
      'chunk-WXTH2UMW.js',
      'chunk-ZMB5PWZ4.js'
    ]
  }
})
