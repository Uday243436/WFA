import type { DashboardFilters, Employee } from '../models/DashboardModels';
import { mockEmployees } from '../models/DashboardModels';
import type { ApiListResponse } from '../types/api.types';
import { filterEmployees } from '../utils/dataTransformers';
import apiClient, { shouldUseMockFallback } from './apiClient';

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

export async function fetchEmployees(filters?: DashboardFilters): Promise<Employee[]> {
  if (shouldUseMockFallback()) {
    return filters ? filterEmployees(mockEmployees, filters) : [...mockEmployees];
  }

  try {
    const response = await apiClient.get<ApiListResponse<Employee> | Employee[]>('/employees', {
      params: serializeFilters(filters),
    });

    return Array.isArray(response.data) ? response.data : response.data.items;
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      return filters ? filterEmployees(mockEmployees, filters) : [...mockEmployees];
    }
    throw error;
  }
}

export async function fetchEmployeeById(employeeId: string): Promise<Employee | null> {
  if (shouldUseMockFallback()) {
    return mockEmployees.find((employee) => employee.id === employeeId) ?? null;
  }

  try {
    const response = await apiClient.get<Employee>(`/employees/${employeeId}`);
    return response.data;
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      return mockEmployees.find((employee) => employee.id === employeeId) ?? null;
    }
    throw error;
  }
}
