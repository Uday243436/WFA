import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ConnectionStatus from './ConnectionStatus';

describe('ConnectionStatus', () => {
  it('shows connected state and last updated timestamp', () => {
    render(<ConnectionStatus status="connected" lastUpdated="2026-07-11T10:00:00.000Z" />);

    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByText('Last updated')).toBeInTheDocument();
  });

  it('shows polling and error states', () => {
    render(
      <ConnectionStatus
        status="reconnecting"
        lastUpdated={null}
        error="Socket unavailable"
        isPollingFallback
      />,
    );

    expect(screen.getByText('Reconnecting')).toBeInTheDocument();
    expect(screen.getByText('Polling fallback active')).toBeInTheDocument();
    expect(screen.getByText('Socket unavailable')).toBeInTheDocument();
  });
});
