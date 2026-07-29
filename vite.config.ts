/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src/ui/store.ts', 'src/scene/math.ts', 'src/data/**', 'src/config.ts'],
    },
  },
});
