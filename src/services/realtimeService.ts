import { fetchDashboardData } from './dashboardService';
import { createMockRealtimePayload } from '../mocks/realtimeData';
import type {
  RealtimeEvent,
  RealtimeServiceCallbacks,
  RealtimeServiceOptions,
  RealtimeSnapshot,
  RealtimeWorkforcePayload,
} from '../types/realtime.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isRealtimePayload(value: unknown): value is RealtimeWorkforcePayload {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.eventId === 'string' &&
    typeof value.timestamp === 'string' &&
    Array.isArray(value.kpis) &&
    Array.isArray(value.employees) &&
    Array.isArray(value.departmentDistribution) &&
    Array.isArray(value.skillDistribution) &&
    Array.isArray(value.monthlyHiringTrend)
  );
}

function parseRealtimeEvent(rawData: string): RealtimeEvent | null {
  try {
    const parsed: unknown = JSON.parse(rawData);
    if (!isRecord(parsed) || parsed.type !== 'workforce:update' || !isRealtimePayload(parsed.payload)) {
      return null;
    }

    return {
      type: 'workforce:update',
      payload: parsed.payload,
    };
  } catch {
    return null;
  }
}

export async function fetchRealtimeSnapshot(): Promise<RealtimeSnapshot> {
  const dashboard = await fetchDashboardData();
  return {
    source: dashboard.source === 'api' ? 'polling' : 'mock',
    data: {
      eventId: `polling-${dashboard.lastUpdated}`,
      timestamp: dashboard.lastUpdated,
      kpis: dashboard.kpis,
      employees: dashboard.employees,
      departmentDistribution: dashboard.stats.departmentDistribution,
      skillDistribution: dashboard.stats.roleDistribution,
      monthlyHiringTrend: dashboard.stats.monthlyHiringTrend,
    },
  };
}

export class WorkforceRealtimeService {
  private socket: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private mockTimer: ReturnType<typeof setInterval> | null = null;
  private callbacks: RealtimeServiceCallbacks | null = null;
  private options: Required<RealtimeServiceOptions>;
  private reconnectAttempt = 0;
  private seenEventIds = new Set<string>();
  private shouldReconnect = true;

  constructor(options: RealtimeServiceOptions = {}) {
    this.options = {
      url: options.url ?? import.meta.env.VITE_WS_URL ?? '',
      mockIntervalMs: options.mockIntervalMs ?? Number(import.meta.env.VITE_REALTIME_MOCK_INTERVAL_MS || 5000),
      reconnectBaseDelayMs: options.reconnectBaseDelayMs ?? 1500,
      reconnectMaxDelayMs: options.reconnectMaxDelayMs ?? 15000,
    };
  }

  connect(callbacks: RealtimeServiceCallbacks): void {
    this.callbacks = callbacks;
    this.shouldReconnect = true;

    if (!this.options.url) {
      this.startMockStream();
      return;
    }

    this.openSocket();
  }

  disconnect(): void {
    this.shouldReconnect = false;
    this.clearReconnectTimer();
    this.stopMockStream();

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.callbacks?.onStatusChange('disconnected');
  }

  private openSocket(): void {
    this.callbacks?.onStatusChange(this.reconnectAttempt > 0 ? 'reconnecting' : 'disconnected');

    try {
      this.socket = new WebSocket(this.options.url);
    } catch (error) {
      this.handleError(error instanceof Error ? error : new Error('Unable to create WebSocket connection'));
      this.scheduleReconnect();
      return;
    }

    this.socket.onopen = () => {
      this.reconnectAttempt = 0;
      this.callbacks?.onStatusChange('connected');
    };

    this.socket.onmessage = (event: MessageEvent<string>) => {
      const realtimeEvent = parseRealtimeEvent(event.data);
      if (!realtimeEvent || this.seenEventIds.has(realtimeEvent.payload.eventId)) {
        return;
      }

      this.seenEventIds.add(realtimeEvent.payload.eventId);
      this.callbacks?.onMessage(realtimeEvent.payload);
    };

    this.socket.onerror = () => {
      this.handleError(new Error('Realtime WebSocket error'));
    };

    this.socket.onclose = () => {
      this.socket = null;
      if (this.shouldReconnect) {
        this.scheduleReconnect();
      } else {
        this.callbacks?.onStatusChange('disconnected');
      }
    };
  }

  private scheduleReconnect(): void {
    this.callbacks?.onStatusChange('reconnecting');
    this.clearReconnectTimer();

    const delay = Math.min(
      this.options.reconnectMaxDelayMs,
      this.options.reconnectBaseDelayMs * 2 ** this.reconnectAttempt,
    );
    this.reconnectAttempt += 1;

    this.reconnectTimer = setTimeout(() => {
      if (this.shouldReconnect) {
        this.openSocket();
      }
    }, delay);
  }

  private startMockStream(): void {
    this.callbacks?.onStatusChange('connected');
    this.callbacks?.onMessage(createMockRealtimePayload());
    this.stopMockStream();

    this.mockTimer = setInterval(() => {
      this.callbacks?.onMessage(createMockRealtimePayload());
    }, this.options.mockIntervalMs);
  }

  private stopMockStream(): void {
    if (this.mockTimer) {
      clearInterval(this.mockTimer);
      this.mockTimer = null;
    }
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private handleError(error: Error): void {
    this.callbacks?.onError(error);
  }
}
