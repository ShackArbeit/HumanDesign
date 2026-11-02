import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  });

  afterEach(() => {
    cleanup();
  });

  it('renders a human design page from its English slug', async () => {
    renderAt('/human/types');
    expect(await screen.findByText('知悉天賦比努力更重要 !')).toBeTruthy();
    expect(await screen.findByText('天生實幹的生產者')).toBeTruthy();
  });

  it('links the index to English routes', async () => {
    renderAt('/human');
    const title = await screen.findByText('類型 = 你的天職');
    expect(title.closest('a').getAttribute('href')).toBe('/human/types');
  });

  it('renders the static timeline and videos', async () => {
    renderAt('/jerome');
    expect(await screen.findByText('改變開始')).toBeTruthy();
    cleanup();
    renderAt('/feedback');
    const links = await screen.findAllByText('觀看影片');
    expect(links[0].getAttribute('href')).toBe('https://youtu.be/rkgEqVzYbzY');
  });

  it('redirects guests away from my bookings', async () => {
    renderAt('/my-bookings');
    expect(await screen.findByLabelText(/密碼/)).toBeTruthy();
    expect(window.location.pathname).toBe('/signin');
  });

  it('opens the mobile menu accessibly and closes it with Escape', async () => {
    const user = userEvent.setup();
    renderAt('/signin');
    const toggle = await screen.findByRole('button', { name: '開啟選單' });
    await user.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    await user.keyboard('{Escape}');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('shows the member menu when signed in', async () => {
    authState.user = { uid: 'u1' };
    renderAt('/signin');
    expect(await screen.findByText('我的預約')).toBeTruthy();
    expect(screen.queryByText('會員登入')).toBeNull();
  });
});
