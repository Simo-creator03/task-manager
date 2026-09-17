/**
 * ZONE DES TÂCHES
 *
 * Affiche trois cas différents :
 *   1. les données sont en cours de chargement ;
 *   2. il n'y a aucune tâche à afficher ;
 *   3. il y a des tâches, on affiche la liste.
 *
 * Astuce de lisibilité : on utilise des "retours anticipés"
 * (if ... return ...) au lieu d'un ternaire imbriqué sur trois niveaux.
 */
import type { Task } from '../types';
import { TaskItem } from './TaskItem';

interface TasksSectionProps {
  /** La liste des tâches à afficher. */
  tasks: Task[];
  /** Vrai pendant un chargement. */
  loading: boolean;
  /** Appelée au clic sur "Créer ma première tâche". */
  onCreateClick: () => void;
  /** Appelée au clic sur "Modifier" d'une tâche. */
  onEdit: (task: Task) => void;
  /** Appelée au clic sur "Supprimer" d'une tâche. */
  onDelete: (task: Task) => void;
}

export function TasksSection({ tasks, loading, onCreateClick, onEdit, onDelete }: TasksSectionProps) {
  // Cas 1 : chargement en cours.
  if (loading) {
    return <p className="state">Chargement de vos tâches...</p>;
  }

  // Cas 2 : aucune tâche.
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

  // Cas 3 : affichage de la liste.
  // "key={task.id}" est obligatoire dans un .map() : c'est l'équivalent
  // du trackBy d'Angular, il permet à React d'identifier chaque élément.
  return (
    <div className="tasks">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
