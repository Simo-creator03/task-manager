/**
 * PAGE D'INSCRIPTION (/register)
 *
 * Même structure que LoginPage, avec deux différences :
 *   - cinq champs au lieu de deux ;
 *   - une validation locale complète avant l'appel au serveur.
 */
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { register as registerRequest } from '../api/auth';
import { ApiError } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { isValidCameroonPhone, isValidEmail } from '../utils/validation';

export function RegisterPage() {
  // Un état par champ du formulaire.
  const [nom, setNom] = useState('');
  const [loginValue, setLoginValue] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  // Ici l'état est un TABLEAU d'erreurs (le backend peut en renvoyer plusieurs).
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, signIn } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/tasks" replace />;
  }

  /**
   * Vérifie les champs AVANT d'envoyer au serveur.
   * Retourne la liste des problèmes trouvés (vide si tout est bon).
   */
  const validate = (): string[] => {
    const validationErrors: string[] = [];

    if (nom.trim() === '') {
      validationErrors.push('Veuillez renseigner votre nom');
    }
    if (loginValue.trim() === '') {
      validationErrors.push('Veuillez renseigner votre login');
    }
    if (!isValidEmail(email.trim())) {
      validationErrors.push("L'email entré n'est pas valide");
    }
    if (!isValidCameroonPhone(telephone.trim())) {
      validationErrors.push("Le numéro entré n'est pas un numéro valide au Cameroun");
    }
    if (password === '') {
      validationErrors.push('Veuillez renseigner votre mot de passe');
    }

    return validationErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 1) Validation locale.
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors([]);

    // 2) Appel du backend. Il revalide tout de son côté (sécurité).
    try {
      const response = await registerRequest({
        nom: nom.trim(),
        login: loginValue.trim(),
        password,
        email: email.trim(),
        telephone: telephone.trim(),
      });
      // Inscription réussie : l'utilisateur est connecté directement.
      signIn(response.accessToken, loginValue.trim());
      navigate('/tasks', { replace: true });
    } catch (registerError) {
      // Erreurs du backend : ex. "Ce login est déjà utilisé".
      if (registerError instanceof ApiError) {
        setErrors(registerError.errors ?? [registerError.message]);
      } else {
        setErrors(['Une erreur est survenue']);
      }
      setLoading(false);
    }
  };

  return (
    <main className="auth">
      <div className="auth__card">
        <div className="auth__header">
          <span className="auth__logo">TM</span>
          <h1 className="auth__title">Inscription</h1>
          <p className="auth__subtitle">Créez votre compte pour gérer vos tâches</p>
        </div>

        {/* On n'affiche le bloc d'erreurs que s'il y en a. */}
        {errors.length > 0 && (
          <div className="alert alert--error">
            <ul>
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="nom">Nom</label>
            <input
              id="nom"
              type="text"
              value={nom}
              placeholder="Votre nom"
              onChange={(event) => setNom(event.target.value)}
              autoFocus
            />
          </div>

          <div className="field">
            <label htmlFor="login">Login</label>
            <input
              id="login"
              type="text"
              value={loginValue}
              placeholder="Votre login"
              onChange={(event) => setLoginValue(event.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder="exemple@mail.com"
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label htmlFor="telephone">Téléphone</label>
            <input
              id="telephone"
              type="tel"
              value={telephone}
              placeholder="6XXXXXXXX"
              onChange={(event) => setTelephone(event.target.value)}
              autoComplete="tel"
            />
            <span className="field__hint">Numéro camerounais : 6XXXXXXXX ou +2376XXXXXXXX</span>
          </div>

          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="Votre mot de passe"
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>

        <p className="auth__footer">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </main>
  );
}
