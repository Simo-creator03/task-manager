import type { TaskStatus } from '../types';
import { STATUS_OPTIONS } from '../utils/task';

interface TaskFiltersProps {

  value: TaskStatus | '';

  onChange: (value: TaskStatus | '') => void;
}

export function TaskFilters({ value, onChange }: TaskFiltersProps) {

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

          className={`filter ${value === filter.value ? 'filter--active' : ''}`}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
