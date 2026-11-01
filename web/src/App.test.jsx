import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';


const authState = { user: null };

vi.mock('./lib/firebase', () => ({
  getFirebaseAuth: () => ({ currentUser: authState.user }),
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (auth, callback) => {
    callback(authState.user);
    return () => {};
  },
  signOut: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
}));

const item = { id: 1, title: '測試標題', body: '測試內文', imagePath: null };

const responses = {
  '/api/v1/content/hd-types': [item],
  '/api/v1/content/hd-index': [{ ...item, linkPath: '/human/types' }],
  '/api/v1/about/timeline': [{ year: '2013', title: '改變開始', body: '年表內文' }],
  '/api/v1/feedback/videos': [{ id: '1', title: '影片', body: '影片內文', youtubeId: 'abc' }],
};

const renderAt = (path) => {
  window.history.pushState({}, '', path);
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>,
  );
};

describe('App routes', () => {
  beforeEach(() => {
    authState.user = null;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url) => {
        const data = responses[new URL(url).pathname];
        return data
          ? new Response(JSON.stringify({ data }), { status: 200 })
          : new Response(JSON.stringify({ error: { code: 'INTERNAL', message: 'x' } }), {
              status: 500,
            });
      }),
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders a human design page from its English slug', async () => {
    renderAt('/human/types');
    expect(await screen.findByText('知悉天賦比努力更重要 !')).toBeTruthy();
    expect(await screen.findByText('測試內文')).toBeTruthy();
  });

  it('links the index to relative routes', async () => {
    renderAt('/human');
    const title = await screen.findByText('測試標題');
    expect(title.closest('a').getAttribute('href')).toBe('/human/types');
  });

  it('maps the timeline and video fields', async () => {
    renderAt('/jerome');
    expect(await screen.findByText('年表內文')).toBeTruthy();
    cleanup();
    renderAt('/feedback');
    const link = await screen.findByText('觀看影片');
    expect(link.getAttribute('href')).toBe('https://youtu.be/abc');
  });

  it('shows a retryable error state when the API fails', async () => {
    renderAt('/human/origin');
    expect(await screen.findByRole('button', { name: '重試' })).toBeTruthy();
  });

  it('redirects guests away from my bookings', async () => {
    renderAt('/my-bookings');
    expect(await screen.findByLabelText(/密碼/)).toBeTruthy();
    expect(window.location.pathname).toBe('/signin');
  });

  it('shows the member menu when signed in', async () => {
    authState.user = { uid: 'u1' };
    renderAt('/signin');
    expect(await screen.findByText('查看預約紀錄')).toBeTruthy();
    expect(screen.queryByText('會員登入')).toBeNull();
  });
});
