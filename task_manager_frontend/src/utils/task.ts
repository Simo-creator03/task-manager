/**
 * UTILITAIRES D'AFFICHAGE DES TÂCHES
 *
 * Fonctions pures (même entrée = même sortie, aucun effet de bord).
 * Équivalent Angular : des pipes comme | status ou | date.
 */
import type { TaskStatus } from '../types';

/** Options affichées dans les filtres et dans la liste déroulante du formulaire. */
export const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'TODO', label: 'À faire' },
  { value: 'IN_PROGRESS', label: 'En cours' },
  { value: 'DONE', label: 'Terminée' },
];

/** Correspondance entre la valeur technique du statut et son libellé en français. */
const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'À faire',
  IN_PROGRESS: 'En cours',
  DONE: 'Terminée',
};

/** Retourne le libellé français d'un statut (ex. "IN_PROGRESS" -> "En cours"). */
export function statusLabel(status: TaskStatus): string {
  return STATUS_LABELS[status];
}

/** Libellé du filtre sélectionné ('Toutes' pour aucune sélection). */
export function filterLabel(status: TaskStatus | ''): string {
  return status === '' ? 'Toutes' : statusLabel(status);
}

/**
 * Transforme une date ISO en texte lisible en français.
 * Exemple : "2026-09-17T10:25:00" -> "17 sept. 2026, 10:25".
 */
export function formatDateTime(isoDate: string): string {
  return new Date(isoDate).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
