/**
 * CLIENT API CENTRALISÉ
 *
 * Ce fichier est le seul endroit de l'application qui parle directement au
 * réseau. Toutes les requêtes HTTP passent par la fonction "request".
 *
 * Il remplit trois rôles :
 *   1. construire l'URL complète (http://localhost:8081 + /api/...).
 *   2. ajouter automatiquement le token JWT (comme un intercepteur Angular).
 *   3. transformer les erreurs du serveur en objet ApiError lisible.
 */

// Adresse du backend : modifiable via un fichier .env (VITE_API_URL).
const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8081';

// Clés utilisées pour stocker le token et le login dans le navigateur.
const TOKEN_KEY = 'tm_token';
const LOGIN_KEY = 'tm_login';

/**
 * Erreur personnalisée qui transport le message et les éventuelles erreurs
 * de validation renvoyés par le backend.
 */
export class ApiError extends Error {
  /** Liste de détails renvoyée par le backend, ex. ["Ce login est déjà utilisé"]. */
  readonly errors?: string[];

  constructor(message: string, errors?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.errors = errors;
  }
}

/** Lit le token stocké dans le navigateur (null si absent). */
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Lit le login stocké dans le navigateur (null si absent). */
export function getStoredLogin(): string | null {
  return localStorage.getItem(LOGIN_KEY);
}

/** Enregistre le token et le login après une connexion réussie. */
export function storeAuth(token: string, login: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(LOGIN_KEY, login);
}

/** Efface les informations d'authentification (déconnexion). */
export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LOGIN_KEY);
}

/** Forme du corps JSON renvoyé par le backend en cas d'erreur. */
interface ErrorBody {
  message?: string;
  errors?: string[];
}

/** Transforme une réponse HTTP en erreur (400, 404, 403...). */
async function parseError(response: Response): Promise<ApiError> {
  let message = `Erreur ${response.status}`;
  let errors: string[] | undefined;

  try {
    const body = (await response.json()) as ErrorBody;
    if (body.message) {
      message = body.message;
    }
    errors = body.errors;
  } catch {
    // corps non JSON : on garde le message par défaut
  }

  // Message plus clair quand le token est absent ou expiré.
  if ((response.status === 401 || response.status === 403) && message === `Erreur ${response.status}`) {
    message = 'Votre session a expiré, veuillez vous reconnecter';
  }

  return new ApiError(message, errors);
}

/**
 * Fonction centrale qui exécute une requête HTTP.
 *
 * Le "<T>" est un générique TypeScript : on précise le type de la réponse
 * attendue, par exemple request<Task[]> pour une liste de tâches.
 */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);

  // S'il y a un corps de requête, on indique qu'il est au format JSON.
  if (init.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  // Ajout automatique du token : c'est le rôle de l'"intercepteur".
  const token = getStoredToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  } catch {
    // fetch échoue uniquement si le serveur est injoignable (pas de réponse).
    throw new ApiError('Impossible de contacter le serveur. Vérifiez que le backend est démarré.');
  }

  // Toute réponse HTTP en erreur devient une ApiError.
  if (!response.ok) {
    throw await parseError(response);
  }

  // 204 = succès sans contenu à renvoyer.
  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/**
 * Petit objet pratique utilisé par les services (auth.ts, tasks.ts).
 * Exemple : api.get<Task[]>('/api/tasks').
 */
export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
