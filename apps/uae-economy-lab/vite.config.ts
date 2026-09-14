import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  base: '/uae-economy-lab/',
  server: { port: 5177, strictPort: true },
  build: { outDir: '../../assets/apps/uae-economy-lab', emptyOutDir: true },
});
