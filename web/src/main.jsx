import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

const MAX_RETRIES = 2;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // A 4xx will not fix itself, so only retry network and server failures.
      retry: (failureCount, error) =>
        failureCount < MAX_RETRIES && !(error.status >= 400 && error.status < 500),
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
