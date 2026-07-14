import { mockEmployees } from '../models/DashboardModels';
import { skillDistributionData } from '../constants/ChartConfig';
import type { Employee } from '../models/DashboardModels';
import type { RealtimeWorkforcePayload } from '../types/realtime.types';
import { calculateDashboardStats, createKpiCardsFromStats } from '../utils/dataTransformers';

let sequence = 0;

function rotateEmployeeStatus(employees: Employee[]): Employee[] {
  sequence += 1;
  return employees.map((employee, index) => {
    if ((index + sequence) % 7 !== 0) {
      return employee;
    }

    return {
      ...employee,
      status: employee.status === 'Active' ? 'Inactive' : 'Active',
    };
  });
}

export function createMockRealtimePayload(): RealtimeWorkforcePayload {
  const employees = rotateEmployeeStatus(mockEmployees);
  const stats = calculateDashboardStats(employees);
  const offset = sequence % 4;

  return {
    eventId: `mock-workforce-${sequence}`,
    timestamp: new Date().toISOString(),
    kpis: createKpiCardsFromStats(stats),
    employees,
    departmentDistribution: stats.departmentDistribution,
    skillDistribution: skillDistributionData.map((segment, index) => ({
      ...segment,
      value: Math.max(1, segment.value + ((index + offset) % 3) - 1),
    })),
    monthlyHiringTrend: stats.monthlyHiringTrend,
  };
}
