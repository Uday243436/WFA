import { mockEmployees } from '../models/DashboardModels';
import type { Department } from '../types/api.types';
import apiClient, { shouldUseMockFallback } from './apiClient';
import { fetchEmployees } from './employeeService';

function createDepartmentsFromEmployees(): Department[] {
  const counts = mockEmployees.reduce<Record<string, number>>((accumulator, employee) => {
    accumulator[employee.department] = (accumulator[employee.department] ?? 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts).map(([name, employeeCount]) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    employeeCount,
  }));
}

export async function fetchDepartments(): Promise<Department[]> {
  if (shouldUseMockFallback()) {
    return createDepartmentsFromEmployees();
  }

  try {
    const response = await apiClient.get<Department[]>('/departments');
    return response.data;
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      const employees = await fetchEmployees();
      const counts = employees.reduce<Record<string, number>>((accumulator, employee) => {
        accumulator[employee.department] = (accumulator[employee.department] ?? 0) + 1;
        return accumulator;
      }, {});

      return Object.entries(counts).map(([name, employeeCount]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        employeeCount,
      }));
    }
    throw error;
  }
}
