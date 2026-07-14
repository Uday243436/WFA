import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu as MenuIcon } from 'lucide-react';
import Sidebar from '../components/Sidebar/Sidebar';

export const DashboardLayout: React.FC = () => {
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  const openMobileSidebar = () => setIsOpenMobile(true);
  const closeMobileSidebar = () => setIsOpenMobile(false);

  return (
    <div className="dashboard-container">
      <Sidebar
        isOpenMobile={isOpenMobile}
        onCloseMobile={closeMobileSidebar}
      />

      <div className="main-workspace">
        <button
          className="mobile-sidebar-trigger"
          onClick={openMobileSidebar}
          title="Open navigation menu"
          aria-label="Open navigation menu"
        >
          <MenuIcon size={20} />
        </button>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
