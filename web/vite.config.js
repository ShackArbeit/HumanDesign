import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    proxy: {
      // Same relative paths as production, where Firebase Hosting rewrites /api.
      '/api': 'http://localhost:8080',
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
      scopeBehaviour: 'local',
      generateScopedName: '[name]_[local]_[hash:5]',
      globalModulePaths: ['./componentB.module.css'],
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{js,jsx}'],
    setupFiles: ['./src/test/setup.js'],
    env: { VITE_API_BASE_URL: 'http://localhost/api/v1' },
    testTimeout: 20000,
  },
});
