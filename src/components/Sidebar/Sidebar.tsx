import React from 'react';
import { Menu } from '../Navigation/Menu';
import type { MenuItem } from '../Navigation/Menu';
import { Activity, Moon, Sun } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  isOpenMobile,
  onCloseMobile,
  theme,
  onToggleTheme,
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
          <div className="sidebar-logo">
            <Activity size={24} />
          </div>
          <span className="sidebar-title">Workforce OS</span>
        </div>

        {/* Navigation Menu */}
        <Menu items={menuItems} onItemClick={onCloseMobile} />

        <div className="sidebar-footer">
          <button 
            className="icon-button theme-toggle-btn" 
            onClick={onToggleTheme} 
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
