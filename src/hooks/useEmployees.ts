import { useQuery } from '@tanstack/react-query';
import type { DashboardFilters, Employee } from '../models/DashboardModels';
import { fetchEmployees } from '../services/employeeService';

export function useEmployees(filters?: DashboardFilters) {
  return useQuery<Employee[], Error>({
    queryKey: ['employees', filters],
    queryFn: () => fetchEmployees(filters),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 2,
  });
}
