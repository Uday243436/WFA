import type { DashboardFilters, Employee } from '../models/DashboardModels';
import apiClient from './apiClient';
import { shouldUseMockFallback } from './apiClient';
import { mockEmployees } from '../models/DashboardModels';
import { skillGapData } from '../constants/ChartConfig';
import type { DashboardApiResponse } from '../types/api.types';
import { createDashboardResponse, filterEmployees } from '../utils/dataTransformers';

const MOCK_DELAY_MS = 350;

function waitForMockData(): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, MOCK_DELAY_MS);
  });
}

function serializeFilters(filters?: DashboardFilters): Record<string, string> | undefined {
  if (!filters) {
    return undefined;
  }

  return {
    department: filters.department,
    role: filters.role,
    location: filters.location,
    searchQuery: filters.searchQuery,
    status: filters.status,
    startDate: filters.dateRange.startDate ?? '',
    endDate: filters.dateRange.endDate ?? '',
  };
}

export async function fetchDashboardData(filters?: DashboardFilters): Promise<DashboardApiResponse> {
  if (shouldUseMockFallback()) {
    await waitForMockData();
    const employees = filters ? filterEmployees(mockEmployees, filters) : [...mockEmployees];
    return createDashboardResponse(employees, skillGapData, 'mock');
  }

  try {
    const response = await apiClient.get<DashboardApiResponse>('/dashboard', {
      params: serializeFilters(filters),
    });
    return response.data;
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      const employees = filters ? filterEmployees(mockEmployees, filters) : [...mockEmployees];
      return createDashboardResponse(employees, skillGapData, 'mock');
    }
    throw error;
  }
}

export async function fetchDashboardEmployees(filters?: DashboardFilters): Promise<Employee[]> {
  const dashboard = await fetchDashboardData(filters);
  return dashboard.employees;
}
