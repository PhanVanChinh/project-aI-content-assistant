import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/project-aI-content-assistant/',
  plugins: [react(), tailwindcss()],
});