import { useEffect, useState } from 'react';
import { getTasks } from '../api/tasks';
import type { Task, TaskStatus } from '../types';
import { getErrorMessage } from '../utils/error';

export function useTasks() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

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

    return () => {
      cancelled = true;
    };
  }, [statusFilter]);

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

  const changeFilter = (value: TaskStatus | '') => {
    if (value === statusFilter) {
      return;
    }

    setStatusFilter(value);
    setLoading(true);
    setError(null);
  };

  return { tasks, statusFilter, loading, error, changeFilter, refresh };
}
