import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Exclure les tests Playwright (fichiers .spec.ts dans e2e/)
    exclude: ['**/e2e/**', '**/*.spec.ts', '**/node_modules/**'],
    // Inclure uniquement nos tests
    include: ['src/__tests__/**/*.test.ts'],
    // Alias pour @/ vers src/
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
