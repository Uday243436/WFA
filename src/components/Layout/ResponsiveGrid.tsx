import React from 'react';

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 4 },
}) => {
  const style = {
    '--cols-mobile': columns.mobile ?? 1,
    '--cols-tablet': columns.tablet ?? 2,
    '--cols-desktop': columns.desktop ?? 4,
  } as React.CSSProperties;

  return (
    <div className="responsive-grid" style={style}>
      {children}
    </div>
  );
};

export default React.memo(ResponsiveGrid);
