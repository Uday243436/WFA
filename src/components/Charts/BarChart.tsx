import React from 'react';
import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { ChartSegment } from '../../models/DashboardModels';

interface BarChartProps {
  data: ChartSegment[];
  loading?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return <div className="chart-placeholder">Loading bar chart...</div>;
  }

  if (data.length === 0) {
    return <div className="chart-placeholder">No department performance data available.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ReBarChart data={data} margin={{ top: 20, right: 24, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#10B981" radius={[8, 8, 0, 0]} />
      </ReBarChart>
    </ResponsiveContainer>
  );
};

export default React.memo(BarChart);
