import type { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { usePolling } from './usePolling';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('usePolling', () => {
  it('fetches data when enabled', async () => {
    const queryFn = vi.fn<() => Promise<{ total: number }>>().mockResolvedValue({ total: 3 });

    const { result } = renderHook(
      () =>
        usePolling({
          queryKey: ['polling-test'],
          queryFn,
          enabled: true,
          intervalMs: 1000,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.data).toEqual({ total: 3 }));
    expect(queryFn).toHaveBeenCalledTimes(1);
  });
});
