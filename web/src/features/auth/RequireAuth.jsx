import { Navigate, useLocation } from 'react-router-dom';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { useAuth } from './AuthProvider';

export const RequireAuth = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingSkeleton />;
  if (!user) return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  return children;
};
