import { useQueryClient } from '@tanstack/react-query';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getFirebaseAuth } from '../../lib/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [state, setState] = useState({ user: null, isLoading: true });

  useEffect(
    () =>
      onAuthStateChanged(getFirebaseAuth(), (user) => {
        setState({ user, isLoading: false });
      }),
    [],
  );

  const value = useMemo(
    () => ({
      ...state,
      signOut: async () => {
        await firebaseSignOut(getFirebaseAuth());
        // Cached member data must not survive into the next session on this browser.
        queryClient.clear();
      },
    }),
    [state, queryClient],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components -- Hook belongs with its provider.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
