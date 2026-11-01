import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.js'],
    // All API tests share one Firestore Emulator database.
    fileParallelism: false,
    testTimeout: 20000,
  },
});
