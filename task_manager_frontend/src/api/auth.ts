/**
 * SERVICE D'AUTHENTIFICATION
 *
 * Ces deux fonctions correspondent aux endpoints du backend :
 *   - login    -> POST /api/auth/login
 *   - register -> POST /api/auth/register
 *
 * Équivalent Angular : un service AuthService, mais ici ce sont de simples
 * fonctions exportées (pas de classe, pas de @Injectable).
 */
import type { AuthenticationResponse, Credentials, UserPayload } from '../types';
import { api } from './client';

/**
 * Connexion d'un utilisateur.
 * @returns le token JWT et un message de confirmation.
 */
export function login(credentials: Credentials): Promise<AuthenticationResponse> {
  return api.post<AuthenticationResponse>('/api/auth/login', credentials);
}

/**
 * Inscription d'un nouvel utilisateur.
 * @returns le token JWT (l'utilisateur est connecté directement) et un message.
 */
export function register(payload: UserPayload): Promise<AuthenticationResponse> {
  return api.post<AuthenticationResponse>('/api/auth/register', payload);
}
