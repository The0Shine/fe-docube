import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify(command === 'serve' ? 'development' : 'production'),
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        'process.env.NODE_ENV': command === 'serve' ? '"development"' : '"production"',
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))
