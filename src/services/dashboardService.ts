import type { Employee } from '../models/DashboardModels';
import apiClient from './apiClient';
import { mockEmployees } from '../models/DashboardModels';

export async function fetchDashboardEmployees(): Promise<Employee[]> {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  if (!apiUrl) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...mockEmployees];
  }

  const response = await apiClient.get<Employee[]>('/dashboard/employees');
  return response.data;
}
