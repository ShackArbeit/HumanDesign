import { transferableAbortController } from 'node:util';
import { cleanup, configure } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { server } from './server';

// 單元測試不連線真正的 Firebase。CI 上沒有 .env.local，不 mock 的話會因為缺少 API key 失敗。
// 個別測試檔需要模擬登入狀態時，可以再用自己的 vi.mock 覆蓋。
vi.mock('../lib/firebase', () => ({
  getFirebaseAuth: () => ({ currentUser: null }),
}));

// jsdom replaces AbortController with a class Node's fetch rejects, so restore Node's own.
const nativeController = transferableAbortController();
globalThis.AbortController = nativeController.constructor;
globalThis.AbortSignal = nativeController.signal.constructor;

// The first import of a lazy route is transformed on demand and can exceed the 1s default.
configure({ asyncUtilTimeout: 10000 });

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
