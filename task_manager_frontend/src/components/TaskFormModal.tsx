/**
 * FENÊTRE MODALE DE CRÉATION / MODIFICATION D'UNE TÂCHE
 *
 * Le même composant sert pour les deux cas :
 *   - prop "task" à null  -> création ("Nouvelle tâche") ;
 *   - prop "task" remplie -> modification ("Modifier la tâche").
 *
 * Notions illustrées ici :
 *   - les "formulaires contrôlés" (la valeur vient de l'état React) ;
 *   - useEffect pour écouter la touche Échap, avec nettoyage ;
 *   - la soumission asynchrone et l'affichage des erreurs du backend.
 */
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { ApiError } from '../api/client';
import type { Task, TaskPayload, TaskStatus } from '../types';
import { STATUS_OPTIONS } from '../utils/task';

interface TaskFormModalProps {
  /** La tâche à modifier, ou null pour une création. */
  task: Task | null;
  /** Appelée pour fermer la fenêtre. */
  onClose: () => void;
  /** Appelée à la soumission ; le parent enregistre et peut lever une erreur. */
  onSubmit: (payload: TaskPayload) => Promise<void>;
}

export function TaskFormModal({ task, onClose, onSubmit }: TaskFormModalProps) {
  // Un état par champ du formulaire. "task?.title" signifie : le titre de la
  // tâche si elle existe, sinon rien (?? '' remplace null par une chaîne vide).
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'TODO');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fermer la fenêtre avec la touche Échap.
  // La fonction retournée par useEffect est le "nettoyage" : React la lance
  // quand le composant disparaît (sinon l'écouteur resterait en mémoire).
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  /** Soumission du formulaire. */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // Empêche le navigateur de recharger la page (comportement natif d'un form).
    event.preventDefault();

    // Petite validation locale avant d'appeler le serveur.
    if (title.trim() === '') {
      setError('Veuillez renseigner le titre de la tâche');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Le parent effectue l'appel API ; s'il échoue, l'erreur est attrapée ici.
      await onSubmit({ title: title.trim(), description: description.trim(), status });
    } catch (submitError) {
      if (submitError instanceof ApiError) {
        // On affiche les erreurs de validation du backend si elles existent.
        setError(submitError.errors?.join(', ') ?? submitError.message);
      } else {
        setError('Une erreur est survenue');
      }
      setSubmitting(false);
    }
  };

  return (
    // Clic sur le fond sombre : on ferme. Clic dans la boîte : stopPropagation
    // empêche la fermeture.
    <div className="modal" onMouseDown={onClose}>
      <div className="modal__dialog" onMouseDown={(event) => event.stopPropagation()}>
        <h2 className="modal__title">{task ? 'Modifier la tâche' : 'Nouvelle tâche'}</h2>

        {error && <div className="alert alert--error">{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          {/*
            Formulaire "contrôlé" : value = état React, onChange = mise à jour
            de cet état. C'est l'équivalent de [(ngModel)] en Angular.
          */}
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
              // event.target.value est une string : on la convertit en TaskStatus.
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
