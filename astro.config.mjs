import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.instantetrips.com',
  base: '/mexico',

  vite: {
    plugins: [tailwindcss()],
  },
});