import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: { host: '127.0.0.1', port: 4177, strictPort: true },
  build: {
    rolldownOptions: {
      input: Object.fromEntries(['index', 'courseinfo/index', 'phonebook/index', 'countries/index', 'brewtica-lab/index']
        .map(name => [name, resolve(import.meta.dirname, `${name}.html`)])),
    },
  },
});
