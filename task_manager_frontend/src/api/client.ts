const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8081';

const TOKEN_KEY = 'tm_token';
const LOGIN_KEY = 'tm_login';

export class ApiError extends Error {

  readonly errors?: string[];

  constructor(message: string, errors?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.errors = errors;
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredLogin(): string | null {
  return localStorage.getItem(LOGIN_KEY);
}

export function storeAuth(token: string, login: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(LOGIN_KEY, login);
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LOGIN_KEY);
}

interface ErrorBody {
  message?: string;
  errors?: string[];
}

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

  }

  if ((response.status === 401 || response.status === 403) && message === `Erreur ${response.status}`) {
    message = 'Votre session a expiré, veuillez vous reconnecter';
  }

  return new ApiError(message, errors);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);

  if (init.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getStoredToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  } catch {

    throw new ApiError('Impossible de contacter le serveur. Vérifiez que le backend est démarré.');
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
