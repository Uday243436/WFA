import React from 'react';
import { Menu } from '../Navigation/Menu';
import type { MenuItem } from '../Navigation/Menu';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenMobile,
  onCloseMobile,
}) => {
  const menuItems: MenuItem[] = [
    { name: 'Dashboard', path: '/dashboard', iconName: 'LayoutGrid' },
    { name: 'Real-Time', path: '/realtime', iconName: 'RadioTower' },
    { name: 'Analytics', path: '/analytics', iconName: 'BarChart3' },
    { name: 'Team Directory', path: '/team', iconName: 'Users' },
    { name: 'Settings', path: '/settings', iconName: 'Settings' },
  ];

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpenMobile ? 'active' : ''}`} 
        onClick={onCloseMobile}
      />

      <aside className={`sidebar ${isOpenMobile ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img className="sidebar-logo-image" src="/logo-stackly.png" alt="Stackly" />
          </div>
        </div>

        <Menu items={menuItems} onItemClick={onCloseMobile} />

        <div className="sidebar-footer">
          <div className="profile-card">
            <div className="profile-info">
              <div className="profile-name">People Analytics VP</div>
              <div className="profile-role">Sprint 1</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
