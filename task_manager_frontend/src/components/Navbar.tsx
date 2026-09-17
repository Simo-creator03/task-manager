/**
 * BARRE DE NAVIGATION
 *
 * Affiche le nom de l'application, le login de l'utilisateur connecté
 * (lu depuis le contexte) et le bouton de déconnexion.
 */
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  // useAuth() lit les données partagées ; useNavigate() permet de changer de page.
  const { login, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login', { replace: true });
  };

  return (
    <header className="navbar">
      <div className="container navbar__content">
        <div className="navbar__brand">
          <span className="navbar__logo">TM</span>
          <span className="navbar__title">Task Manager</span>
        </div>
        <div className="navbar__user">
          {/*
            Le "&&" est l'équivalent de *ngIf en Angular :
            on n'affiche le login que s'il existe (pas null).
          */}
          {login && <span className="navbar__login">{login}</span>}
          <button type="button" className="btn btn--ghost btn--small" onClick={handleLogout}>
            Se déconnecter
          </button>
        </div>
      </div>
    </header>
  );
}
