/**
 * HOOK PERSONNALISÉ : useTasks
 *
 * Un "hook personnalisé" est une fonction qui commence par "use" et qui
 * regroupe de la logique React réutilisable. Celui-ci centralise TOUT ce qui
 * concerne les tâches : liste, chargement, erreur et filtre.
 *
 * Avantages pour la lisibilité :
 *   - TasksPage ne contient plus que l'affichage ;
 *   - la logique des appels API est isolée à un seul endroit.
 *
 * Équivalent Angular : un service + un composant, mais réunis en une entité.
 */
import { useEffect, useState } from 'react';
import { getTasks } from '../api/tasks';
import type { Task, TaskStatus } from '../types';
import { getErrorMessage } from '../utils/error';

export function useTasks() {
  // --- États gérés par le hook ---
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Chargement automatique ---
  // Ce useEffect se relance à chaque changement de "statusFilter".
  // Le tableau [statusFilter] en fin d'appel s'appelle "liste des dépendances".
  useEffect(() => {
    // Si le filtre change pendant qu'une requête est en cours, on ignore
    // la réponse de l'ancienne requête grâce à ce drapeau.
    let cancelled = false;

    getTasks(statusFilter)
      .then((data) => {
        if (cancelled) return;
        setTasks(data);
        setError(null);
      })
      .catch((loadError: unknown) => {
        if (cancelled) return;
        setError(getErrorMessage(loadError));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // Fonction de nettoyage exécutée par React avant le prochain effet
    // (équivalent de ngOnDestroy en Angular).
    return () => {
      cancelled = true;
    };
  }, [statusFilter]);

  /**
   * Recharge la liste depuis le serveur (après création, modification
   * ou suppression par exemple). Appelée depuis un gestionnaire d'événement.
   */
  const refresh = async () => {
    setLoading(true);

    try {
      setTasks(await getTasks(statusFilter));
      setError(null);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  };

  /** Change le filtre de statut (appelé au clic sur un bouton de filtre). */
  const changeFilter = (value: TaskStatus | '') => {
    if (value === statusFilter) {
      return;
    }

    setStatusFilter(value);
    setLoading(true);
    setError(null);
  };

  // Tout ce que la page a le droit d'utiliser.
  return { tasks, statusFilter, loading, error, changeFilter, refresh };
}
