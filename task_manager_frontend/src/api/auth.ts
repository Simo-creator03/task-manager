import type { AuthenticationResponse, Credentials, UserPayload } from '../types';
import { api } from './client';

export function login(credentials: Credentials): Promise<AuthenticationResponse> {
  return api.post<AuthenticationResponse>('/api/auth/login', credentials);
}

export function register(payload: UserPayload): Promise<AuthenticationResponse> {
  return api.post<AuthenticationResponse>('/api/auth/register', payload);
}
