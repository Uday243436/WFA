import React from 'react';
import type { SkillGap } from '../../models/DashboardModels';

interface SkillAnalyticsProps {
  skills: SkillGap[];
  loading?: boolean;
}

const SkillAnalytics: React.FC<SkillAnalyticsProps> = ({ skills, loading = false }) => {
  if (loading) {
    return <div className="chart-placeholder">Loading skill analytics...</div>;
  }

  if (skills.length === 0) {
    return <div className="chart-placeholder">No skill gap analytics available.</div>;
  }

  return (
    <section className="skill-analytics-card glass-panel">
      <div className="skill-analytics-header">
        <h3>Skill Gap Analytics</h3>
      </div>
      <div className="skill-analytics-list">
        {skills.map((skill) => (
          <div className="skill-row" key={skill.skill}>
            <div>
              <div className="skill-name">{skill.skill}</div>
              <div className="skill-detail">{skill.employees} employees</div>
            </div>
            <span className="skill-gap-pill">{skill.gap}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(SkillAnalytics);
