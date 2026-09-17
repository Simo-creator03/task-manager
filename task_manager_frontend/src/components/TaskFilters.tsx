/**
 * BOUTONS DE FILTRE
 *
 * Composant "de présentation" : il n'a aucun état interne, il affiche
 * simplement ce qu'on lui donne et prévient le parent au clic.
 *
 * C'est l'exemple parfait de la communication enfant -> parent en React :
 * le parent passe une fonction (onChange), l'enfant l'appelle.
 * (Équivalent Angular : @Output() + EventEmitter, mais sans classe.)
 */
import type { TaskStatus } from '../types';
import { STATUS_OPTIONS } from '../utils/task';

interface TaskFiltersProps {
  /** Filtre actuellement sélectionné ('' = toutes les tâches). */
  value: TaskStatus | '';
  /** Appelée quand l'utilisateur clique sur un filtre. */
  onChange: (value: TaskStatus | '') => void;
}

export function TaskFilters({ value, onChange }: TaskFiltersProps) {
  // '' pour "Toutes" puis les trois statuts.
  const filters: { value: TaskStatus | ''; label: string }[] = [
    { value: '', label: 'Toutes' },
    ...STATUS_OPTIONS,
  ];

  return (
    <div className="filters">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          // La classe "filter--active" colore le bouton sélectionné.
          className={`filter ${value === filter.value ? 'filter--active' : ''}`}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
