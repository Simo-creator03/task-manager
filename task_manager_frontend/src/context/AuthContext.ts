/**
 * CONTEXTE D'AUTHENTIFICATION (le "canal" de partage)
 *
 * En React, il n'y a pas d'injection de dépendances comme en Angular.
 * Pour partager l'utilisateur connecté avec toute l'application, on crée
 * un "contexte" : une sorte de boîte accessible par tous les composants.
 *
 * Ce fichier contient uniquement :
 *   - la description de ce que le contexte contient (AuthContextValue) ;
 *   - le contexte lui-même (AuthContext) ;
 *   - le hook useAuth() qui permet de le lire facilement.
 *
 * Le composant qui REMPLIT ce contexte est AuthProvider.tsx.
 */
import { createContext, useContext } from 'react';

/** Ce que le contexte met à disposition de tous les composants. */
export interface AuthContextValue {
  /** Login de l'utilisateur connecté (null si personne n'est connecté). */
  login: string | null;
  /** Vrai si un token est présent. */
  isAuthenticated: boolean;
  /** À appeler après une connexion réussie. */
  signIn: (token: string, login: string) => void;
  /** À appeler pour se déconnecter. */
  signOut: () => void;
}

/**
 * Le contexte est créé avec "null" par défaut. Si un composant essaie de
 * l'utiliser sans AuthProvider au-dessus de lui, useAuth() lèvera une erreur
 * explicite (beaucoup plus simple à diagnostiquer qu'un plantage silencieux).
 */
export const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Hook à utiliser dans n'importe quel composant :
 *
 *   const { login, signOut } = useAuth();
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }

  return context;
}
