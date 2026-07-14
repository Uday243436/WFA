import { useQuery } from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';

interface UsePollingOptions<TData> {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
  enabled: boolean;
  intervalMs: number;
}

export function usePolling<TData>({ queryKey, queryFn, enabled, intervalMs }: UsePollingOptions<TData>) {
  return useQuery<TData, Error>({
    queryKey,
    queryFn,
    enabled,
    refetchInterval: enabled ? intervalMs : false,
    retry: 2,
  });
}
