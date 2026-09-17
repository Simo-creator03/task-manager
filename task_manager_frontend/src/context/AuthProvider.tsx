/**
 * FOURNISSEUR D'AUTHENTIFICATION
 *
 * Ce composant enveloppe toute l'application et met à disposition
 * l'état d'authentification (token + login) via AuthContext.
 *
 * Équivalent Angular : un service "root" contenant un BehaviorSubject,
 * mais écrit en 30 lignes et sans injection de dépendances.
 */
import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { clearAuth, getStoredLogin, getStoredToken, storeAuth } from '../api/client';
import { AuthContext } from './AuthContext';
import type { AuthContextValue } from './AuthContext';

interface AuthProviderProps {
  /** Tout ce qui est placé entre <AuthProvider>...</AuthProvider>. */
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // useState : état lu au premier rendu depuis le localStorage.
  // On passe une FONCTION à useState pour que la lecture n'ait lieu qu'une fois
  // (initialisation paresseuse), comme le constructeur d'un service Angular.
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [login, setLogin] = useState<string | null>(() => getStoredLogin());

  // Connexion : on enregistre dans le navigateur PUIS on met à jour l'état React.
  // C'est la mise à jour d'état qui provoque le rafraîchissement de l'écran.
  const signIn = useCallback((newToken: string, newLogin: string) => {
    storeAuth(newToken, newLogin);
    setToken(newToken);
    setLogin(newLogin);
  }, []);

  // Déconnexion : opération inverse.
  const signOut = useCallback(() => {
    clearAuth();
    setToken(null);
    setLogin(null);
  }, []);

  // useMemo évite de recréer l'objet à chaque rendu (petite optimisation).
  const value = useMemo<AuthContextValue>(
    () => ({
      login,
      isAuthenticated: token !== null,
      signIn,
      signOut,
    }),
    [login, token, signIn, signOut],
  );

  // "value" est la boîte que tous les composants enfants pourront lire avec useAuth().
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
