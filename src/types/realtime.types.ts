import type { Employee } from './employee';
import type { ChartSegment, LineChartData } from './dashboard';
import type { KpiMetric } from './api.types';

export type RealtimeConnectionStatus = 'connected' | 'reconnecting' | 'disconnected';

export interface RealtimeWorkforcePayload {
  eventId: string;
  timestamp: string;
  kpis: KpiMetric[];
  employees: Employee[];
  departmentDistribution: ChartSegment[];
  skillDistribution: ChartSegment[];
  monthlyHiringTrend: LineChartData[];
}

export interface RealtimeEvent {
  type: 'workforce:update';
  payload: RealtimeWorkforcePayload;
}

export interface RealtimeServiceOptions {
  url?: string;
  mockIntervalMs?: number;
  reconnectBaseDelayMs?: number;
  reconnectMaxDelayMs?: number;
}

export interface RealtimeServiceCallbacks {
  onStatusChange: (status: RealtimeConnectionStatus) => void;
  onMessage: (payload: RealtimeWorkforcePayload) => void;
  onError: (error: Error) => void;
}

export interface RealtimeSnapshot {
  data: RealtimeWorkforcePayload;
  source: 'websocket' | 'polling' | 'mock';
}
