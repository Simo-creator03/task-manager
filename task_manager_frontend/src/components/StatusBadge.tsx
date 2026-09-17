/**
 * PASTILLE DE STATUT
 *
 * Composant d'affichage pur : il reçoit un statut en "prop" (paramètre)
 * et retourne du JSX. Il ne possède ni état ni logique.
 *
 * Exemple d'utilisation : <StatusBadge status="DONE" />
 * Équivalent Angular : @Input() status + template HTML.
 */
import type { TaskStatus } from '../types';
import { statusLabel } from '../utils/task';

interface StatusBadgeProps {
  /** Le statut à afficher (TODO, IN_PROGRESS ou DONE). */
  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  // "todo", "in_progress", "done" : utilisé par le CSS pour la couleur.
  return <span className={`badge badge--${status.toLowerCase()}`}>{statusLabel(status)}</span>;
}
