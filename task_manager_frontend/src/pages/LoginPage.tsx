import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/error';

export function LoginPage() {

  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, signIn } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/tasks" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loginValue.trim() === '' || password === '') {
      setError('Veuillez renseigner votre login et votre mot de passe');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await loginRequest({ login: loginValue.trim(), password });

      signIn(response.accessToken, loginValue.trim());
      navigate('/tasks', { replace: true });
    } catch (loginError) {
      setError(getErrorMessage(loginError));
      setLoading(false);
    }
  };

  return (
    <main className="auth">
      <div className="auth__card">
        <div className="auth__header">
          <span className="auth__logo">TM</span>
          <h1 className="auth__title">Connexion</h1>
          <p className="auth__subtitle">Accédez à vos tâches</p>
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="login">Login</label>
            <input
              id="login"
              type="text"
              value={loginValue}
              placeholder="Votre login"
              onChange={(event) => setLoginValue(event.target.value)}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="Votre mot de passe"
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>

          { }
          <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="auth__footer">
          Pas encore de compte ? <Link to="/register">Créer un compte</Link>
        </p>
      </div>
    </main>
  );
}
