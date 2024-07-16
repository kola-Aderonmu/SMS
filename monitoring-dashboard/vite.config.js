/* eslint-disable no-undef */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import path from 'path';
import tailwindcss from "tailwindcss"
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      // plugins: [require('tailwindcss'), require('autoprefixer')],
      plugins: [tailwindcss, autoprefixer],
    },
  },
});
