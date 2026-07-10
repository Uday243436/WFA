import React from 'react';
import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { LineChartData } from '../../models/DashboardModels';

interface LineChartProps {
  data: LineChartData[];
  loading?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return <div className="chart-placeholder">Loading line chart...</div>;
  }

  if (data.length === 0) {
    return <div className="chart-placeholder">No growth trend data available.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ReLineChart data={data} margin={{ top: 20, right: 24, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </ReLineChart>
    </ResponsiveContainer>
  );
};

export default React.memo(LineChart);
