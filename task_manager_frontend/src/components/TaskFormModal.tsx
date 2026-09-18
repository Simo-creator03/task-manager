import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { ApiError } from '../api/client';
import type { Task, TaskPayload, TaskStatus } from '../types';
import { STATUS_OPTIONS } from '../utils/task';

interface TaskFormModalProps {

  task: Task | null;

  onClose: () => void;

  onSubmit: (payload: TaskPayload) => Promise<void>;
}

export function TaskFormModal({ task, onClose, onSubmit }: TaskFormModalProps) {

  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'TODO');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    if (title.trim() === '') {
      setError('Veuillez renseigner le titre de la tâche');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {

      await onSubmit({ title: title.trim(), description: description.trim(), status });
    } catch (submitError) {
      if (submitError instanceof ApiError) {

        setError(submitError.errors?.join(', ') ?? submitError.message);
      } else {
        setError('Une erreur est survenue');
      }
      setSubmitting(false);
    }
  };

  return (

    <div className="modal" onMouseDown={onClose}>
      <div className="modal__dialog" onMouseDown={(event) => event.stopPropagation()}>
        <h2 className="modal__title">{task ? 'Modifier la tâche' : 'Nouvelle tâche'}</h2>

        {error && <div className="alert alert--error">{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          { }
          <div className="field">
            <label htmlFor="task-title">Titre</label>
            <input
              id="task-title"
              type="text"
              value={title}
              maxLength={255}
              placeholder="Ex : Préparer la réunion"
              onChange={(event) => setTitle(event.target.value)}
              autoFocus
            />
          </div>

          <div className="field">
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              value={description}
              rows={4}
              placeholder="Détails de la tâche (optionnel)"
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="task-status">Statut</label>
            <select
              id="task-status"
              value={status}

              onChange={(event) => setStatus(event.target.value as TaskStatus)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose} disabled={submitting}>
              Annuler
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? 'Enregistrement...' : task ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
