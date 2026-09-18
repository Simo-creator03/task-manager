export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: number;

  title: string;

  description: string | null;
  status: TaskStatus;

  createdAt: string;
}

export interface TaskPayload {
  title: string;
  description: string;
  status: TaskStatus;
}

export interface Credentials {
  login: string;
  password: string;
}

export interface UserPayload {
  nom: string;
  login: string;
  password: string;
  email: string;
  telephone: string;
}

export interface AuthenticationResponse {

  accessToken: string;

  message: string;
}

export interface MessageNotification {
  statut: string;
  message: string;
  id: number | null;
}
