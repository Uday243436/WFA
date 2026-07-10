import { Menu as MenuIcon, Moon, Sun } from 'lucide-react';
import type { AppTheme } from '../../theme/theme';

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
  theme: AppTheme;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onToggleTheme, theme }) => {
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
        <div className="header-title-group">
          <span className="header-eyebrow">People intelligence</span>
          <strong>Workforce command center</strong>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
