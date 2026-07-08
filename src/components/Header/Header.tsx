import React from 'react';
import { Menu as MenuIcon, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="sidebar-toggle-btn" 
          onClick={onToggleSidebar}
          title="Toggle Navigation Menu"
        >
          <MenuIcon size={20} />
        </button>
      </div>

      <div className="header-right">

        <div className="profile-section">
          <img 
            src="/profile.jpg" 
            alt="User profile" 
            className="profile-image" 
          />
          <div className="profile-info">
            <span className="profile-name">TEAM 1 A</span>
            <span className="profile-role">People Analytics VP</span>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
        </div>
      </div>
    </header>
  );
};

export default Header;
