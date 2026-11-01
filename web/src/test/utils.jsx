import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

export const setViewport = (width) => {
  vi.stubGlobal('matchMedia', (query) => {
    const min = query.match(/min-width:\s*([\d.]+)px/)?.[1];
    const max = query.match(/max-width:\s*([\d.]+)px/)?.[1];
    const matches = (!min || width >= Number(min)) && (!max || width <= Number(max));
    return {
      matches,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
    };
  });
};

export const renderWithClient = (ui) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
};
