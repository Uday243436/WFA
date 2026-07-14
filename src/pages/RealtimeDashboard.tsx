import ChartContainer from '../components/Charts/ChartContainer';
import LineChart from '../components/Charts/LineChart';
import BarChart from '../components/Charts/BarChart';
import DonutChart from '../components/Charts/DonutChart';
import ConnectionStatus from '../components/realtime/ConnectionStatus';
import RealtimeKPICards from '../components/realtime/RealtimeKPICards';
import { useRealtimeWorkforce } from '../hooks/useRealtimeWorkforce';

export function RealtimeDashboard() {
  const { data, status, lastUpdated, error, isPollingFallback } = useRealtimeWorkforce();
  const loading = !data;

  return (
    <div className="dashboard-page realtime-dashboard">
      <div className="dashboard-section-header">
        <div>
          <h1 className="page-title">Real-Time Workforce Dashboard</h1>
          <p className="page-subtitle">Live headcount, workforce distribution, and skill movement.</p>
        </div>
      </div>

      <ConnectionStatus
        status={status}
        lastUpdated={lastUpdated}
        error={error}
        isPollingFallback={isPollingFallback}
      />

      <RealtimeKPICards kpis={data?.kpis ?? []} loading={loading} />

      <div className="chart-grid realtime-chart-grid">
        <ChartContainer title="Live Hiring Trend">
          <LineChart data={data?.monthlyHiringTrend ?? []} loading={loading} />
        </ChartContainer>
        <ChartContainer title="Live Department Distribution">
          <BarChart data={data?.departmentDistribution ?? []} loading={loading} />
        </ChartContainer>
      </div>

      <div className="chart-grid realtime-chart-grid">
        <ChartContainer title="Live Skill Distribution">
          <DonutChart data={data?.skillDistribution ?? []} loading={loading} />
        </ChartContainer>
        <section className="widget-card realtime-events-card">
          <h2>Automatic Updates</h2>
          <div className="widget-row">
            <span>Employees in stream</span>
            <strong>{data?.employees.length ?? 0}</strong>
          </div>
          <div className="widget-row">
            <span>Event ID</span>
            <strong>{data?.eventId ?? 'Pending'}</strong>
          </div>
          <div className="widget-row">
            <span>Refresh mode</span>
            <strong>{isPollingFallback ? 'Polling' : 'Socket'}</strong>
          </div>
        </section>
      </div>
    </div>
  );
}

export default RealtimeDashboard;
