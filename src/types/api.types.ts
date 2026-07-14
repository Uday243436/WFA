import type { Employee } from './employee';
import type { DashboardFilters } from './filters';
import type { DashboardStats, KpiCardModel, SkillGap } from './dashboard';

export type { Department } from './dashboard';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiErrorResponse {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, unknown>;
  isNetworkError: boolean;
}

export interface ApiEnvelope<TData> {
  data: TData;
  message?: string;
  success?: boolean;
}

export interface ApiListResponse<TItem> {
  items: TItem[];
  total: number;
}

export interface DashboardApiResponse {
  employees: Employee[];
  stats: DashboardStats;
  kpis: KpiCardModel[];
  skills: SkillGap[];
  lastUpdated: string;
  source: 'api' | 'mock';
}

export interface KpiMetric {
  id: string;
  title: string;
  value: string | number;
  changePercentage: string;
  changeDirection: 'up' | 'down' | 'neutral';
  timeframe: string;
  iconName: KpiCardModel['iconName'];
  colorTheme?: string;
}

export interface SkillAnalyticsResponse {
  skills: SkillGap[];
  distribution: { name: string; value: number }[];
  lastUpdated: string;
  source: 'api' | 'mock';
}

export interface EmployeeQueryParams {
  filters?: DashboardFilters;
}
