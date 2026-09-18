import type { TaskStatus } from '../types';
import { statusLabel } from '../utils/task';

interface StatusBadgeProps {

  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {

  return <span className={`badge badge--${status.toLowerCase()}`}>{statusLabel(status)}</span>;
}
