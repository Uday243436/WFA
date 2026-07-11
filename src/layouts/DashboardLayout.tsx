import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';

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
        <Header onOpenSidebar={openMobileSidebar} />
        
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
