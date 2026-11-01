import { transferableAbortController } from 'node:util';
import { cleanup, configure } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './server';

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
