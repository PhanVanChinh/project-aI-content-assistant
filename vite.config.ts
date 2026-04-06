import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/react-example/', // 👈 đổi thành tên repo của bạn
  plugins: [react(), tailwindcss()],
});