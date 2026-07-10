import { Users } from 'lucide-react';

const TeamPage = () => (
  <div className="glass-panel" style={{ padding: '32px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
      <Users size={24} style={{ color: 'var(--primary-accent)' }} />
      <h1 className="page-title" style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
        Employee Table
      </h1>
    </div>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
            <th style={{ padding: '12px 8px', fontWeight: 600 }}>Employee</th>
            <th style={{ padding: '12px 8px', fontWeight: 600 }}>Department</th>
            <th style={{ padding: '12px 8px', fontWeight: 600 }}>Status</th>
            <th style={{ padding: '12px 8px', fontWeight: 600 }}>Join Date</th>
          </tr>
        </thead>
        <tbody>
          {[
            { name: 'PREMKUMAR', dept: 'Engineering', status: 'Active', date: 'Jul 2026' },
            { name: 'bhuvanesh', dept: 'Design', status: 'Onboarding', date: 'Jul 2026' },
            { name: 'HEMAVARSHINI', dept: 'Sales', status: 'Active', date: 'Jun 2026' },
          ].map((row, i) => (
            <tr key={i} style={{ borderBottom: i < 2 ? '1px solid var(--border-color)' : 'none' }}>
              <td style={{ padding: '12px 8px', fontWeight: 500 }}>{row.name}</td>
              <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{row.dept}</td>
              <td style={{ padding: '12px 8px' }}>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: row.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: row.status === 'Active' ? 'var(--status-up)' : '#f59e0b',
                  }}
                >
                  {row.status}
                </span>
              </td>
              <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TeamPage;
