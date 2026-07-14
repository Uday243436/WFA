import { useEffect, useMemo, useState } from 'react';
import { WorkforceRealtimeService, fetchRealtimeSnapshot } from '../services/realtimeService';
import type { RealtimeConnectionStatus, RealtimeWorkforcePayload } from '../types/realtime.types';
import { usePolling } from './usePolling';

interface UseRealtimeWorkforceResult {
  data: RealtimeWorkforcePayload | null;
  status: RealtimeConnectionStatus;
  lastUpdated: string | null;
  error: string | null;
  isPollingFallback: boolean;
}

export function useRealtimeWorkforce(): UseRealtimeWorkforceResult {
  const [data, setData] = useState<RealtimeWorkforcePayload | null>(null);
  const [status, setStatus] = useState<RealtimeConnectionStatus>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const service = useMemo(() => new WorkforceRealtimeService(), []);
  const shouldPoll = status !== 'connected';

  const pollingQuery = usePolling({
    queryKey: ['realtime-workforce-polling'],
    queryFn: fetchRealtimeSnapshot,
    enabled: shouldPoll,
    intervalMs: 15_000,
  });

  useEffect(() => {
    service.connect({
      onStatusChange: setStatus,
      onMessage: (payload) => {
        setData(payload);
        setError(null);
      },
      onError: (realtimeError) => {
        setError(realtimeError.message);
      },
    });

    return () => service.disconnect();
  }, [service]);

  useEffect(() => {
    if (pollingQuery.data?.data) {
      setData(pollingQuery.data.data);
    }
  }, [pollingQuery.data]);

  useEffect(() => {
    if (pollingQuery.error) {
      setError(pollingQuery.error.message);
    }
  }, [pollingQuery.error]);

  return {
    data,
    status,
    lastUpdated: data?.timestamp ?? null,
    error,
    isPollingFallback: shouldPoll && pollingQuery.isFetching,
  };
}
