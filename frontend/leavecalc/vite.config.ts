import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import flowbiteReact from 'flowbite-react/plugin/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact(), tsconfigPaths()],
  server: {
    port: 3000,
    proxy: {
      '/v1': {
        target: 'https://api.lawding.net',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
