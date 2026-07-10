import React from 'react';

interface HeadCountCardProps {
  title: string;
  value: number;
  description?: string;
  loading?: boolean;
}

export function HeadCountCard({
  title,
  value,
  description,
  loading = false,
}: HeadCountCardProps) {
  if (loading) {
    return (
      <div className="dashboard-card headcount-card">
        Loading...
      </div>
    );
  }

  return (
    <div className="dashboard-card headcount-card">
      <p className="card-title">
        {title}
      </p>
      <h2 className="card-value">
        {value.toLocaleString()}
      </h2>
      {description && (
        <p className="card-description">
          {description}
        </p>
      )}
    </div>
  );
}

export default React.memo(HeadCountCard);
