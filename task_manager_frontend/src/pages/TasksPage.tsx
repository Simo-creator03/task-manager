/**
 * PAGE PRINCIPALE : MES TÂCHES (/tasks)
 *
 * Grâce au hook useTasks, cette page ne s'occupe que de :
 *   - la fenêtre modale (ouverte/fermée, tâche en cours d'édition) ;
 *   - les actions créer / modifier / supprimer ;
 *   - l'affichage.
 *
 * Toute la logique de chargement (liste, filtre, chargement, erreur)
 * est dans src/hooks/useTasks.ts.
 */
import { useState } from 'react';
import { createTask, removeTask, updateTask } from '../api/tasks';
import { Navbar } from '../components/Navbar';
import { TaskFilters } from '../components/TaskFilters';
import { TaskFormModal } from '../components/TaskFormModal';
import { TasksSection } from '../components/TasksSection';
import { useTasks } from '../hooks/useTasks';
import type { Task, TaskPayload } from '../types';
import { getErrorMessage } from '../utils/error';
import { filterLabel } from '../utils/task';

export function TasksPage() {
  // Données et actions liées aux tâches (voir le hook pour les détails).
  const { tasks, statusFilter, loading, error, changeFilter, refresh } = useTasks();

  // État de la fenêtre modale. "editingTask" vaut null en création.
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Erreur propre aux actions (ex. suppression), affichée en plus de celle du chargement.
  const [actionError, setActionError] = useState<string | null>(null);

  /** Ouvre la modale en mode création. */
  const openCreateModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  /** Ouvre la modale en mode modification avec la tâche cliquée. */
  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  /** Ferme la modale et oublie la tâche en cours d'édition. */
  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  /**
   * Appelée par la modale à la soumission.
   * Si une erreur se produit, elle remonte à la modale qui l'affiche
   * (on ne l'attrape donc pas ici).
   */
  const handleSubmit = async (payload: TaskPayload) => {
    if (editingTask) {
      await updateTask(editingTask.id, payload);
    } else {
      await createTask(payload);
    }

    closeModal();
    await refresh();
  };

  /** Suppression avec confirmation du navigateur. */
  const handleDelete = async (task: Task) => {
    if (!window.confirm(`Supprimer la tâche « ${task.title} » ?`)) {
      return;
    }

    setActionError(null);

    try {
      await removeTask(task.id);
      await refresh();
    } catch (deleteError) {
      setActionError(getErrorMessage(deleteError));
    }
  };

  // Une seule erreur affichée : celle de l'action en cours, sinon celle du chargement.
  const displayedError = actionError ?? error;

  return (
    <div className="app">
      <Navbar />

      <main className="container page">
        <div className="page__header">
          <div>
            <h1 className="page__title">Mes tâches</h1>
            {/* "1 tâche" au singulier, "2 tâches" au pluriel. */}
            <p className="page__subtitle">
              {tasks.length} tâche{tasks.length > 1 ? 's' : ''}
              {statusFilter !== '' ? ` (${filterLabel(statusFilter).toLowerCase()})` : ''}
            </p>
          </div>

          <button type="button" className="btn btn--primary" onClick={openCreateModal}>
            Nouvelle tâche
          </button>
        </div>

        <TaskFilters value={statusFilter} onChange={changeFilter} />

        {displayedError && <div className="alert alert--error">{displayedError}</div>}

        <TasksSection
          tasks={tasks}
          loading={loading}
          onCreateClick={openCreateModal}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      </main>

      {/* La modale n'existe dans la page que lorsqu'elle est ouverte. */}
      {modalOpen && <TaskFormModal task={editingTask} onClose={closeModal} onSubmit={handleSubmit} />}
    </div>
  );
}
