import ResponsiveGrid from '../Layout/ResponsiveGrid';
import KpiCard from '../KpiCard/KpiCard';
import KpiCardSkeleton from '../KpiCard/KpiCardSkeleton';
import type { KpiMetric } from '../../types/api.types';
import { toRealtimeKpis } from '../../utils/dataTransformers';

interface RealtimeKPICardsProps {
  kpis: KpiMetric[];
  loading?: boolean;
}

export function RealtimeKPICards({ kpis, loading = false }: RealtimeKPICardsProps) {
  if (loading) {
    return (
      <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <KpiCardSkeleton key={index} />
        ))}
      </ResponsiveGrid>
    );
  }

  if (kpis.length === 0) {
    return <div className="chart-placeholder">No real-time KPI data available.</div>;
  }

  return (
    <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }}>
      {toRealtimeKpis(kpis).map((kpi) => (
        <KpiCard key={kpi.id} data={kpi} />
      ))}
    </ResponsiveGrid>
  );
}

export default RealtimeKPICards;
