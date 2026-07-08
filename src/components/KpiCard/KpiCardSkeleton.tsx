import React from 'react';

export const KpiCardSkeleton: React.FC = () => {
  return (
    <div className="kpi-card glass-panel" style={{ minHeight: '160px' }}>
      <div className="kpi-card-header" style={{ width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '70%' }}>
          <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '50%', height: '12px' }}></div>
        </div>
        <div className="skeleton" style={{ width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0 }}></div>
      </div>
      <div className="kpi-card-body" style={{ marginTop: '16px' }}>
        <div className="skeleton skeleton-value"></div>
      </div>
      <div className="kpi-card-footer" style={{ marginTop: '16px' }}>
        <div className="skeleton skeleton-text" style={{ width: '60%', height: '14px' }}></div>
      </div>
    </div>
  );
};

export default KpiCardSkeleton;
