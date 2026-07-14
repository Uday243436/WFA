import type { DashboardFilters } from '../models/DashboardModels';
import type { KpiMetric } from '../types/api.types';
import { calculateDashboardStats, createKpiCardsFromStats, filterEmployees } from '../utils/dataTransformers';
import { mockEmployees } from '../models/DashboardModels';
import apiClient, { shouldUseMockFallback } from './apiClient';

export async function fetchKpiMetrics(filters?: DashboardFilters): Promise<KpiMetric[]> {
  if (shouldUseMockFallback()) {
    const employees = filters ? filterEmployees(mockEmployees, filters) : mockEmployees;
    return createKpiCardsFromStats(calculateDashboardStats(employees));
  }

  try {
    const response = await apiClient.get<KpiMetric[]>('/kpi-metrics');
    return response.data;
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      const employees = filters ? filterEmployees(mockEmployees, filters) : mockEmployees;
      return createKpiCardsFromStats(calculateDashboardStats(employees));
    }
    throw error;
  }
}
