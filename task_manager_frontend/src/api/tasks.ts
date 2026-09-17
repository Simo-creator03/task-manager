/**
 * SERVICE DES TÂCHES
 *
 * Une fonction par opération du backend (CRUD) :
 *   - getTasks    -> GET    /api/tasks[?status=...]
 *   - createTask  -> POST   /api/tasks
 *   - updateTask  -> PUT    /api/tasks/{id}
 *   - removeTask  -> DELETE /api/tasks/{id}
 *
 * Le token JWT est ajouté automatiquement par client.ts : rien à gérer ici.
 */
import type { MessageNotification, Task, TaskPayload, TaskStatus } from '../types';
import { api } from './client';

/**
 * Récupère les tâches de l'utilisateur connecté.
 * @param status filtre facultatif (TODO, IN_PROGRESS ou DONE).
 */
export function getTasks(status?: TaskStatus | ''): Promise<Task[]> {
  const query = status ? `?status=${status}` : '';
  return api.get<Task[]>(`/api/tasks${query}`);
}

/** Crée une nouvelle tâche pour l'utilisateur connecté. */
export function createTask(payload: TaskPayload): Promise<Task> {
  return api.post<Task>('/api/tasks', payload);
}

/** Modifie une tâche existante (elle doit appartenir à l'utilisateur connecté). */
export function updateTask(id: number, payload: TaskPayload): Promise<Task> {
  return api.put<Task>(`/api/tasks/${id}`, payload);
}

/** Supprime une tâche (elle doit appartenir à l'utilisateur connecté). */
export function removeTask(id: number): Promise<MessageNotification> {
  return api.delete<MessageNotification>(`/api/tasks/${id}`);
}
