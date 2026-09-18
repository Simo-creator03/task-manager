import type { Task } from '../types';
import { TaskItem } from './TaskItem';

interface TasksSectionProps {

  tasks: Task[];

  loading: boolean;

  onCreateClick: () => void;

  onEdit: (task: Task) => void;

  onDelete: (task: Task) => void;
}

export function TasksSection({ tasks, loading, onCreateClick, onEdit, onDelete }: TasksSectionProps) {

  if (loading) {
    return <p className="state">Chargement de vos tâches...</p>;
  }

  if (tasks.length === 0) {
    return (
      <div className="state state--empty">
        <p>Aucune tâche pour le moment.</p>
        <button type="button" className="btn btn--primary" onClick={onCreateClick}>
          Créer ma première tâche
        </button>
      </div>
    );
  }

  return (
    <div className="tasks">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
