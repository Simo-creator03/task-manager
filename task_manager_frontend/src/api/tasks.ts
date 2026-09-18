import type { MessageNotification, Task, TaskPayload, TaskStatus } from '../types';
import { api } from './client';

export function getTasks(status?: TaskStatus | ''): Promise<Task[]> {
  const query = status ? `?status=${status}` : '';
  return api.get<Task[]>(`/api/tasks${query}`);
}

export function createTask(payload: TaskPayload): Promise<Task> {
  return api.post<Task>('/api/tasks', payload);
}

export function updateTask(id: number, payload: TaskPayload): Promise<Task> {
  return api.put<Task>(`/api/tasks/${id}`, payload);
}

export function removeTask(id: number): Promise<MessageNotification> {
  return api.delete<MessageNotification>(`/api/tasks/${id}`);
}
