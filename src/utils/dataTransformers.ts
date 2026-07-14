import dayjs from 'dayjs';
import type {
  ChartSegment,
  DashboardFilters,
  DashboardStats,
  Employee,
  LineChartData,
  SkillGap,
} from '../models/DashboardModels';
import type { KpiCardModel } from '../models/KpiCardModel';
import type { DashboardApiResponse, KpiMetric, SkillAnalyticsResponse } from '../types/api.types';

export const defaultDashboardFilters: DashboardFilters = {
  department: 'All',
  role: 'All',
  location: 'All',
  searchQuery: '',
  status: 'All',
  riskLevel: 'All',
  dateRange: {
    startDate: null,
    endDate: null,
  },
};

export const emptyDashboardStats: DashboardStats = {
  totalHeadcount: 0,
  activeCount: 0,
  newHires: 0,
  attritionRate: 0,
  highRiskCount: 0,
  skillCoverage: 0,
  trainingCompletion: 0,
  departmentDistribution: [],
  roleDistribution: [],
  riskDistribution: [],
  monthlyHiringTrend: [],
};

export function filterEmployees(employees: Employee[], filters: DashboardFilters): Employee[] {
  const { department, role, location, searchQuery, status, riskLevel, dateRange } = filters;
  let filtered = [...employees];

  if (department !== 'All') {
    filtered = filtered.filter((employee) => employee.department.toLowerCase() === department.toLowerCase());
  }

  if (role !== 'All') {
    filtered = filtered.filter((employee) => employee.role.toLowerCase() === role.toLowerCase());
  }

  if (location !== 'All') {
    filtered = filtered.filter((employee) => employee.location.toLowerCase() === location.toLowerCase());
  }

  if (status !== 'All') {
    filtered = filtered.filter((employee) => employee.status === status);
  }

  if (riskLevel !== 'All') {
    filtered = filtered.filter((employee) => employee.riskLevel === riskLevel);
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (employee) =>
        employee.name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.id.toLowerCase().includes(query) ||
        employee.role.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query),
    );
  }

  if (dateRange.startDate) {
    filtered = filtered.filter((employee) => employee.joinedDate >= dateRange.startDate!);
  }

  if (dateRange.endDate) {
    filtered = filtered.filter((employee) => employee.joinedDate <= dateRange.endDate!);
  }

  return filtered;
}

function countBy(employees: Employee[], getKey: (employee: Employee) => string): ChartSegment[] {
  const counts = employees.reduce<Record<string, number>>((accumulator, employee) => {
    const key = getKey(employee);
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export function calculateDashboardStats(employees: Employee[]): DashboardStats {
  if (employees.length === 0) {
    return emptyDashboardStats;
  }

  const activeCount = employees.filter((employee) => employee.status === 'Active').length;
  const inactiveCount = employees.length - activeCount;
  const highRiskCount = employees.filter((employee) => employee.riskLevel === 'High').length;
  const currentDate = dayjs();
  const ninetyDaysAgo = currentDate.subtract(90, 'day');

  const newHires = employees.filter((employee) => {
    const joinedDate = dayjs(employee.joinedDate);
    return joinedDate.isAfter(ninetyDaysAgo) && joinedDate.isBefore(currentDate.add(1, 'day'));
  }).length;

  const monthlyHiringTrend: LineChartData[] = [];
  for (let monthOffset = 5; monthOffset >= 0; monthOffset -= 1) {
    const month = currentDate.subtract(monthOffset, 'month');
    const start = month.startOf('month');
    const end = month.endOf('month');
    const count = employees.filter((employee) => {
      const joinedDate = dayjs(employee.joinedDate);
      return (joinedDate.isSame(start) || joinedDate.isAfter(start)) && (joinedDate.isSame(end) || joinedDate.isBefore(end));
    }).length;

    monthlyHiringTrend.push({ month: month.format('MMM YY'), count });
  }

  return {
    totalHeadcount: employees.length,
    activeCount,
    newHires,
    attritionRate: Math.round((inactiveCount / employees.length) * 100),
    highRiskCount,
    skillCoverage: Math.min(100, Math.max(55, Math.round((activeCount / employees.length) * 100 + 10))),
    trainingCompletion: Math.min(100, Math.max(50, Math.round((newHires / employees.length) * 100 + 20))),
    departmentDistribution: countBy(employees, (employee) => employee.department),
    roleDistribution: countBy(employees, (employee) => employee.role),
    riskDistribution: countBy(employees, (employee) => employee.riskLevel),
    monthlyHiringTrend,
  };
}

export function createKpiCardsFromStats(stats: DashboardStats): KpiCardModel[] {
  return [
    {
      id: 'headcount',
      title: 'Total Headcount',
      value: stats.totalHeadcount.toLocaleString(),
      changePercentage: '+4.2%',
      changeDirection: 'up',
      timeframe: 'vs last month',
      iconName: 'Users',
      colorTheme: '#6366f1',
    },
    {
      id: 'active-roles',
      title: 'Active Count',
      value: stats.activeCount.toLocaleString(),
      changePercentage: '+12.5%',
      changeDirection: 'up',
      timeframe: 'vs last month',
      iconName: 'Activity',
      colorTheme: '#10b981',
    },
    {
      id: 'new-hires',
      title: 'New Hires (90 Days)',
      value: stats.newHires.toLocaleString(),
      changePercentage: '+3.1%',
      changeDirection: 'up',
      timeframe: 'vs last quarter',
      iconName: 'UserPlus',
      colorTheme: '#3b82f6',
    },
    {
      id: 'attrition',
      title: 'Attrition Rate',
      value: `${stats.attritionRate}%`,
      changePercentage: stats.attritionRate > 0 ? '-0.4%' : '0.0%',
      changeDirection: stats.attritionRate > 0 ? 'down' : 'neutral',
      timeframe: 'vs last month',
      iconName: 'TrendingDown',
      colorTheme: '#f59e0b',
    },
    {
      id: 'risk-alerts',
      title: 'High Risk Employees',
      value: stats.highRiskCount.toLocaleString(),
      changePercentage: stats.highRiskCount > 0 ? '-1.2%' : '0.0%',
      changeDirection: stats.highRiskCount > 0 ? 'down' : 'neutral',
      timeframe: 'risk watchlist',
      iconName: 'ShieldAlert',
      colorTheme: '#ef4444',
    },
    {
      id: 'skill-coverage',
      title: 'Skill Coverage',
      value: `${stats.skillCoverage}%`,
      changePercentage: '+2.7%',
      changeDirection: 'up',
      timeframe: 'vs last month',
      iconName: 'Award',
      colorTheme: '#8b5cf6',
    },
    {
      id: 'training-completion',
      title: 'Training Completion',
      value: `${stats.trainingCompletion}%`,
      changePercentage: '+8.9%',
      changeDirection: 'up',
      timeframe: 'vs last quarter',
      iconName: 'BookOpen',
      colorTheme: '#14b8a6',
    },
  ];
}

export function createDashboardResponse(
  employees: Employee[],
  skills: SkillGap[],
  source: DashboardApiResponse['source'],
): DashboardApiResponse {
  const stats = calculateDashboardStats(employees);
  return {
    employees,
    stats,
    kpis: createKpiCardsFromStats(stats),
    skills,
    lastUpdated: new Date().toISOString(),
    source,
  };
}

export function createSkillAnalyticsResponse(
  skills: SkillGap[],
  distribution: ChartSegment[],
  source: SkillAnalyticsResponse['source'],
): SkillAnalyticsResponse {
  return {
    skills,
    distribution,
    lastUpdated: new Date().toISOString(),
    source,
  };
}

export function toRealtimeKpis(metrics: KpiMetric[]): KpiCardModel[] {
  return metrics.map((metric) => ({
    id: metric.id,
    title: metric.title,
    value: metric.value,
    changePercentage: metric.changePercentage,
    changeDirection: metric.changeDirection,
    timeframe: metric.timeframe,
    iconName: metric.iconName,
    colorTheme: metric.colorTheme,
  }));
}
