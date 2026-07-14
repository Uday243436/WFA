import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import type { RealtimeConnectionStatus } from '../../types/realtime.types';

interface ConnectionStatusProps {
  status: RealtimeConnectionStatus;
  lastUpdated: string | null;
  error?: string | null;
  isPollingFallback?: boolean;
}

const statusMeta: Record<RealtimeConnectionStatus, { label: string; className: string }> = {
  connected: {
    label: 'Connected',
    className: 'connected',
  },
  reconnecting: {
    label: 'Reconnecting',
    className: 'reconnecting',
  },
  disconnected: {
    label: 'Disconnected',
    className: 'disconnected',
  },
};

export function ConnectionStatus({ status, lastUpdated, error, isPollingFallback = false }: ConnectionStatusProps) {
  const meta = statusMeta[status];
  const Icon = status === 'connected' ? Wifi : status === 'reconnecting' ? RefreshCw : WifiOff;
  const timestamp = lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Waiting for first update';

  return (
    <section className="connection-status glass-panel">
      <div className={`connection-pill ${meta.className}`}>
        <Icon size={18} className={status === 'reconnecting' ? 'animate-spin' : undefined} />
        <span>{meta.label}</span>
      </div>
      <div className="connection-copy">
        <strong>Last updated</strong>
        <span>{timestamp}</span>
      </div>
      {isPollingFallback && <span className="connection-note">Polling fallback active</span>}
      {error && <span className="connection-error">{error}</span>}
    </section>
  );
}

export default ConnectionStatus;
