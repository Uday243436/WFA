import type { EmployeeRiskLevel, EmployeeStatus } from './employee';

export type FilterAllOption = 'All';
export type EmployeeStatusFilter = FilterAllOption | EmployeeStatus;
export type EmployeeRiskLevelFilter = FilterAllOption | EmployeeRiskLevel;

export interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

export interface DashboardFilters {
  department: string;
  role: string;
  location: string;
  searchQuery: string;
  status: EmployeeStatusFilter;
  riskLevel: EmployeeRiskLevelFilter;
  dateRange: DateRange;
}
