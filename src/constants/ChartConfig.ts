import type { ChartSegment, LineChartData, SkillGap } from '../models/DashboardModels';

export const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const baselineEmployeeTrend: LineChartData[] = [
  { month: 'Jan', count: 18 },
  { month: 'Feb', count: 22 },
  { month: 'Mar', count: 26 },
  { month: 'Apr', count: 32 },
  { month: 'May', count: 36 },
  { month: 'Jun', count: 42 },
];

export const departmentPerformanceData: ChartSegment[] = [
  { name: 'Engineering', value: 24 },
  { name: 'Design', value: 14 },
  { name: 'Product', value: 18 },
  { name: 'Marketing', value: 11 },
  { name: 'Sales', value: 16 },
];

export const workforceDistributionData: ChartSegment[] = [
  { name: 'Engineering', value: 42 },
  { name: 'Design', value: 18 },
  { name: 'Product', value: 14 },
  { name: 'HR', value: 8 },
  { name: 'Sales', value: 12 },
];

export const skillDistributionData: ChartSegment[] = [
  { name: 'React', value: 18 },
  { name: 'Node.js', value: 14 },
  { name: 'UI/UX', value: 10 },
  { name: 'Product', value: 8 },
  { name: 'Data', value: 6 },
];

export const skillGapData: SkillGap[] = [
  { skill: 'React', employees: 18, gap: 'Moderate' },
  { skill: 'Node.js', employees: 14, gap: 'High' },
  { skill: 'UI/UX', employees: 10, gap: 'Low' },
  { skill: 'Product', employees: 8, gap: 'Moderate' },
  { skill: 'Data', employees: 6, gap: 'High' },
];
