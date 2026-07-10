import type { Employee } from '../models/DashboardModels';
import { fetchDashboardEmployees } from './dashboardService';

export interface RealtimePoller {
  stop: () => void;
}

export function startRealtimePolling(
  onUpdate: (employees: Employee[]) => void,
  intervalMs = 30000,
): RealtimePoller {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let isStopped = false;

  const poll = async () => {
    if (isStopped) {
      return;
    }

    try {
      const employees = await fetchDashboardEmployees();
      onUpdate(employees);
    } catch (error) {
      console.error('Realtime polling failed:', error);
    } finally {
      if (!isStopped) {
        timerId = setTimeout(poll, intervalMs);
      }
    }
  };

  timerId = setTimeout(poll, intervalMs);

  return {
    stop: () => {
      isStopped = true;
      if (timerId) {
        clearTimeout(timerId);
      }
    },
  };
}
