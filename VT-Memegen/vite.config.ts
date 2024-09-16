import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'




export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    build: {
      outDir: 'dist', // default is 'dist'
    },
      define: {
          'process.env.VITE_OPENAI_API_KEY': JSON.stringify(env.VITE_OPENAI_API_KEY),
          // If you want to exposes all env variables, which is not recommended
          'process.env': env
      },
      server: {
        proxy: {
          '/api/explain-image': {
            target: 'http://localhost:5000',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
          }
        }
      }
  };
});