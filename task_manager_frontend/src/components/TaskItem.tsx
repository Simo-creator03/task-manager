import type { Task } from '../types';
import { formatDateTime } from '../utils/task';
import { StatusBadge } from './StatusBadge';

interface TaskItemProps {

  task: Task;

  onEdit: (task: Task) => void;

  onDelete: (task: Task) => void;
}

export function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {

  const articleClassName = `task ${task.status === 'DONE' ? 'task--done' : ''}`;

  return (
    <article className={articleClassName}>
      <div className="task__header">
        <h3 className="task__title">{task.title}</h3>
        <StatusBadge status={task.status} />
      </div>

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
