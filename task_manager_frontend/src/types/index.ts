/**
 * TYPES PARTAGÉS DE L'APPLICATION
 *
 * Ce fichier décrit la "forme" des données qui circulent entre le frontend
 * et le backend. En TypeScript, ces descriptions s'appellent des types ou
 * des interfaces. Elles n'existent qu'à la compilation : elles ne produisent
 * aucun code JavaScript.
 *
 * Équivalent Angular : les interfaces du dossier models/ ou les DTO.
 */

/**
 * Les trois statuts possibles d'une tâche.
 *
 * C'est une "union de chaînes de caractères" : une variable de type TaskStatus
 * ne peut valoir QUE l'une de ces trois valeurs. Si vous écrivez autre chose,
 * TypeScript refuse de compiler.
 */
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

/** Une tâche telle que le backend la renvoie (GET /api/tasks). */
export interface Task {
  id: number;
  /** Le titre de la tâche (obligatoire). */
  title: string;
  /** La description (facultative : le backend peut renvoyer null). */
  description: string | null;
  status: TaskStatus;
  /** Date de création au format ISO, ex. "2026-09-17T10:25:00". */
  createdAt: string;
}

/** Données envoyées au backend pour créer ou modifier une tâche. */
export interface TaskPayload {
  title: string;
  description: string;
  status: TaskStatus;
}

/** Identifiants de connexion (POST /api/auth/login). */
export interface Credentials {
  login: string;
  password: string;
}

/** Données du formulaire d'inscription (POST /api/auth/register). */
export interface UserPayload {
  nom: string;
  login: string;
  password: string;
  email: string;
  telephone: string;
}

/** Réponse du backend après une connexion ou une inscription. */
export interface AuthenticationResponse {
  /** Le token JWT à renvoyer ensuite dans l'en-tête Authorization. */
  accessToken: string;
  /** Message de confirmation renvoyé par le backend. */
  message: string;
}

/** Réponse générique du backend pour les actions (ex. suppression d'une tâche). */
export interface MessageNotification {
  statut: string;
  message: string;
  id: number | null;
}
