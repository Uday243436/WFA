import { Menu as MenuIcon } from 'lucide-react';

interface HeaderProps {
  onOpenSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="header-menu-btn" 
          onClick={onOpenSidebar}
          title="Open navigation menu"
          aria-label="Open navigation menu"
        >
          <MenuIcon size={20} />
        </button>
        <div className="header-title-group">
          <span className="header-eyebrow">People intelligence</span>
          <strong>Workforce command center</strong>
        </div>
      </div>
    </header>
  );
};

export default Header;
