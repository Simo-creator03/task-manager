/**
 * CARTE D'UNE TÂCHE
 *
 * Affiche une tâche et prévient le parent via les fonctions onEdit / onDelete
 * (communication enfant -> parent, l'équivalent de @Output en Angular).
 */
import type { Task } from '../types';
import { formatDateTime } from '../utils/task';
import { StatusBadge } from './StatusBadge';

interface TaskItemProps {
  /** La tâche à afficher. */
  task: Task;
  /** Appelée avec la tâche quand on clique sur "Modifier". */
  onEdit: (task: Task) => void;
  /** Appelée avec la tâche quand on clique sur "Supprimer". */
  onDelete: (task: Task) => void;
}

export function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  // Classe conditionnelle : on ajoute "task--done" si la tâche est terminée
  // (le CSS barre alors le titre).
  const articleClassName = `task ${task.status === 'DONE' ? 'task--done' : ''}`;

  return (
    <article className={articleClassName}>
      <div className="task__header">
        <h3 className="task__title">{task.title}</h3>
        <StatusBadge status={task.status} />
      </div>

      {/* La description n'est affichée que si elle existe. */}
      {task.description && <p className="task__description">{task.description}</p>}

      <div className="task__footer">
        <span className="task__date">Créée le {formatDateTime(task.createdAt)}</span>
        <div className="task__actions">
          <button type="button" className="btn btn--ghost btn--small" onClick={() => onEdit(task)}>
            Modifier
          </button>
          <button type="button" className="btn btn--danger btn--small" onClick={() => onDelete(task)}>
            Supprimer
          </button>
        </div>
      </div>
    </article>
  );
}
