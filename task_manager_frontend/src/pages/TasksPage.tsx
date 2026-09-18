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

  const { tasks, statusFilter, loading, error, changeFilter, refresh } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = async (payload: TaskPayload) => {
    if (editingTask) {
      await updateTask(editingTask.id, payload);
    } else {
      await createTask(payload);
    }

    closeModal();
    await refresh();
  };

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

  const displayedError = actionError ?? error;

  return (
    <div className="app">
      <Navbar />

      <main className="container page">
        <div className="page__header">
          <div>
            <h1 className="page__title">Mes tâches</h1>

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

      {modalOpen && <TaskFormModal task={editingTask} onClose={closeModal} onSubmit={handleSubmit} />}
    </div>
  );
}
