import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {

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
          { }
          {login && <span className="navbar__login">{login}</span>}
          <button type="button" className="btn btn--ghost btn--small" onClick={handleLogout}>
            Se déconnecter
          </button>
        </div>
      </div>
    </header>
  );
}
