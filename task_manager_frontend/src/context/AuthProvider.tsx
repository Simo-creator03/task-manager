import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { clearAuth, getStoredLogin, getStoredToken, storeAuth } from '../api/client';
import { AuthContext } from './AuthContext';
import type { AuthContextValue } from './AuthContext';

interface AuthProviderProps {

  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {

  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [login, setLogin] = useState<string | null>(() => getStoredLogin());

  const signIn = useCallback((newToken: string, newLogin: string) => {
    storeAuth(newToken, newLogin);
    setToken(newToken);
    setLogin(newLogin);
  }, []);

  const signOut = useCallback(() => {
    clearAuth();
    setToken(null);
    setLogin(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      login,
      isAuthenticated: token !== null,
      signIn,
      signOut,
    }),
    [login, token, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
