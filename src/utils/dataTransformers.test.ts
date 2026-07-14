import { describe, expect, it } from 'vitest';
import { mockEmployees } from '../models/DashboardModels';
import { calculateDashboardStats, defaultDashboardFilters, filterEmployees } from './dataTransformers';

describe('dataTransformers', () => {
  it('filters employees by department and status', () => {
    const filtered = filterEmployees(mockEmployees, {
      ...defaultDashboardFilters,
      department: 'Engineering',
      status: 'Active',
      riskLevel: 'High',
    });

    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((employee) => employee.department === 'Engineering')).toBe(true);
    expect(filtered.every((employee) => employee.status === 'Active')).toBe(true);
    expect(filtered.every((employee) => employee.riskLevel === 'High')).toBe(true);
  });

  it('calculates dashboard stats for chart and KPI consumers', () => {
    const stats = calculateDashboardStats(mockEmployees);

    expect(stats.totalHeadcount).toBe(mockEmployees.length);
    expect(stats.departmentDistribution.length).toBeGreaterThan(0);
    expect(stats.roleDistribution.length).toBeGreaterThan(0);
    expect(stats.riskDistribution.length).toBeGreaterThan(0);
    expect(stats.monthlyHiringTrend).toHaveLength(6);
  });
});
