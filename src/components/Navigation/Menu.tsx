import React from 'react';
import { NavLink } from 'react-router-dom';
import * as Icons from 'lucide-react';

export interface MenuItem {
  name: string;
  path: string;
  iconName: keyof typeof Icons;
}

interface MenuProps {
  items: MenuItem[];
  onItemClick?: () => void;
}

export const Menu: React.FC<MenuProps> = ({ items, onItemClick }) => {
  return (
    <nav className="sidebar-menu">
      {items.map((item) => {
        const IconComponent = (Icons[item.iconName] as React.ComponentType<{ size?: number; className?: string }>) || Icons.HelpCircle;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
            onClick={onItemClick}
          >
            <span className="menu-icon">
              <IconComponent size={20} />
            </span>
            <span className="menu-text">{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default Menu;
