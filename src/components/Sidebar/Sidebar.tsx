import React from 'react';
import { Menu } from '../Navigation/Menu';
import type { MenuItem } from '../Navigation/Menu';
import { Activity, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  isOpenMobile,
  onCloseMobile,
  onToggleCollapse,
}) => {
  const menuItems: MenuItem[] = [
    { name: 'Dashboard', path: '/dashboard', iconName: 'LayoutGrid' },
    { name: 'Analytics', path: '/analytics', iconName: 'BarChart3' },
    { name: 'Team Directory', path: '/team', iconName: 'Users' },
    { name: 'Settings', path: '/settings', iconName: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <div 
        className={`sidebar-overlay ${isOpenMobile ? 'active' : ''}`} 
        onClick={onCloseMobile}
      />

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${isOpenMobile ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              <Activity size={20} />
            </div>
            <div className="sidebar-text">
              <span className="sidebar-title">Workforce</span>
              <span className="sidebar-subtitle">OS</span>
            </div>
          </div>
          <button className="sidebar-toggle-btn" onClick={onToggleCollapse} aria-label="Toggle sidebar">
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Menu */}
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
