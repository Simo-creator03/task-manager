/**
 * GARDE DE ROUTE
 *
 * Ce composant enveloppe une page protégée. Si l'utilisateur n'est pas
 * connecté, il est redirigé vers /login ; sinon la page s'affiche.
 *
 * Équivalent Angular : une CanActivate guard, mais ici c'est un simple
 * composant qui décide quoi afficher.
 */
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  /** La page à protéger, ex. <TasksPage />. */
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  // Pas de token : direction la page de connexion.
  // "replace" évite que la page protégée reste dans l'historique du navigateur.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Les <>...</> sont un "Fragment" : une balise invisible qui ne crée
  // aucun élément HTML supplémentaire.
  return <>{children}</>;
}
