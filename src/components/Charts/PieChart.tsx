import React from 'react';
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import type { ChartSegment } from '../../models/DashboardModels';
import { COLORS } from '../../constants/ChartConfig';

interface PieChartProps {
  data: ChartSegment[];
  loading?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return <div className="chart-placeholder">Loading pie chart...</div>;
  }

  if (data.length === 0) {
    return <div className="chart-placeholder">No workforce distribution data available.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RePieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
          {data.map((entry, index) => (
            <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RePieChart>
    </ResponsiveContainer>
  );
};

export default React.memo(PieChart);
