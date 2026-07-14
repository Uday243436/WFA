import type * as Icons from 'lucide-react';
import type { Employee } from './employee';
import type { DashboardFilters } from './filters';

export type DashboardDataSource = 'api' | 'mock';
export type KpiChangeDirection = 'up' | 'down' | 'neutral';
export type KpiIconName = keyof typeof Icons;

export interface ChartSegment {
  name: string;
  value: number;
}

export interface LineChartData {
  month: string;
  count: number;
}

export interface SkillGap {
  skill: string;
  employees: number;
  gap: string;
}

export interface Department {
  id: string;
  name: string;
  employeeCount: number;
}

export interface DepartmentSummary {
  id: number;
  department: string;
  employees: number;
}

export interface Role {
  id: string;
  title: string;
  department: string;
  employeeCount: number;
}

export interface RoleSummary {
  id: number;
  role: string;
  employees: number;
}

export interface DashboardStats {
  totalHeadcount: number;
  activeCount: number;
  newHires: number;
  attritionRate: number;
  highRiskCount: number;
  skillCoverage: number;
  trainingCompletion: number;
  departmentDistribution: ChartSegment[];
  roleDistribution: ChartSegment[];
  riskDistribution: ChartSegment[];
  monthlyHiringTrend: LineChartData[];
}

export interface DashboardState {
  employees: Employee[];
  filteredEmployees: Employee[];
  filters: DashboardFilters;
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
}

export interface KpiCardModel {
  id: string;
  title: string;
  value: string | number;
  changePercentage: string;
  changeDirection: KpiChangeDirection;
  timeframe: string;
  iconName: KpiIconName;
  colorTheme?: string;
}
