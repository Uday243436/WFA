import React from 'react';
import * as Icons from 'lucide-react';
import type { KpiCardModel } from '../../models/KpiCardModel';

interface KpiCardProps {
  data: KpiCardModel;
}

export const KpiCard: React.FC<KpiCardProps> = ({ data }) => {
  const { title, value, changePercentage, changeDirection, timeframe, iconName, colorTheme } = data;

  // Dynamically resolve icon from Lucide
  const IconComponent = (Icons[iconName] as React.ComponentType<{ size?: number; className?: string }>) || Icons.HelpCircle;

  // Decide trend icon
  let TrendIcon = Icons.Minus;
  if (changeDirection === 'up') {
    TrendIcon = Icons.ArrowUpRight;
  } else if (changeDirection === 'down') {
    TrendIcon = Icons.ArrowDownRight;
  }

  // Generate dynamic variables if colorTheme is provided
  const cardStyle = colorTheme
    ? ({
        '--primary-accent': colorTheme,
        '--primary-accent-glow': `${colorTheme}20`,
      } as React.CSSProperties)
    : undefined;

  return (
    <div className="kpi-card glass-panel" style={cardStyle}>
      <div className="kpi-card-header">
        <h3 className="kpi-card-title">{title}</h3>
        <div className="kpi-card-icon-container">
          <IconComponent size={20} />
        </div>
      </div>
      
      <div className="kpi-card-body">
        <div className="kpi-card-value">{value}</div>
      </div>
      
      <div className="kpi-card-footer">
        <div className={`kpi-card-trend ${changeDirection}`}>
          <TrendIcon size={14} />
          <span>{changePercentage}</span>
        </div>
        <span className="kpi-card-timeframe">{timeframe}</span>
      </div>
    </div>
  );
};

export default React.memo(KpiCard);
