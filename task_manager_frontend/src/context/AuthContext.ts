import { createContext, useContext } from 'react';

export interface AuthContextValue {

  login: string | null;

  isAuthenticated: boolean;

  signIn: (token: string, login: string) => void;

  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }

  return context;
}
