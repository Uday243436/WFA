import React from 'react';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ title, children }) => (
  <section className="chart-card glass-panel">
    <div className="chart-card-header">
      <h3>{title}</h3>
    </div>
    <div className="chart-card-body">{children}</div>
  </section>
);

export default React.memo(ChartContainer);
