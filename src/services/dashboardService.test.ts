import { describe, expect, it, vi } from 'vitest';
import { fetchDashboardData } from './dashboardService';

describe('dashboardService', () => {
  it('returns mock dashboard data when no API base URL is configured', async () => {
    vi.useFakeTimers();

    const responsePromise = fetchDashboardData();
    await vi.advanceTimersByTimeAsync(350);
    const response = await responsePromise;

    expect(response.source).toBe('mock');
    expect(response.employees.length).toBeGreaterThan(0);
    expect(response.kpis.length).toBeGreaterThan(0);

    vi.useRealTimers();
  });
});
