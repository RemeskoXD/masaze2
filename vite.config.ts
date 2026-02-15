import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Povolí přístup přes síť (např. pro testování na mobilu)
    open: true, // Automaticky otevře prohlížeč po spuštění
  },
});