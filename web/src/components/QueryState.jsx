import { ErrorState } from './ErrorState';
import { LoadingSkeleton } from './LoadingSkeleton';

// Renders the loading and error screens shared by every read-only content query.
export const QueryState = ({ query, children }) => {
  if (query.isLoading) return <LoadingSkeleton />;
  if (query.isError) return <ErrorState onRetry={query.refetch} />;
  return children(query.data);
};
