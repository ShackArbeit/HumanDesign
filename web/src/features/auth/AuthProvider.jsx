// 用 Context 提供全站的登入狀態
import { useQueryClient } from '@tanstack/react-query';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { getFirebaseAuth } from '../../lib/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Firebase 登入狀態改變時，更新畫面上的 user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signOut() {
    await firebaseSignOut(getFirebaseAuth());
    // 清掉快取的會員資料，避免下一位使用者看到
    queryClient.clear();
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut }}>{children}</AuthContext.Provider>
  );
};

// 讓任何元件都能用 useAuth() 取得登入狀態
// eslint-disable-next-line react-refresh/only-export-components -- Hook belongs with its provider.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
