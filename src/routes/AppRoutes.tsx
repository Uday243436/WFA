import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardPage from '../pages/Dashboard/DashboardPage';

const AnalyticsPage = React.lazy(() => import('../pages/AnalyticsPage'));
const TeamPage = React.lazy(() => import('../pages/TeamPage'));
const SettingsPage = React.lazy(() => import('../pages/SettingsPage'));
const RealtimeDashboard = React.lazy(() => import('../pages/RealtimeDashboard'));

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route
          path="realtime"
          element={
            <React.Suspense fallback={<div style={{ padding: 32 }}>Loading real-time dashboard...</div>}>
              <RealtimeDashboard />
            </React.Suspense>
          }
        />
        <Route
          path="analytics"
          element={
            <React.Suspense fallback={<div style={{ padding: 32 }}>Loading analytics...</div>}>
              <AnalyticsPage />
            </React.Suspense>
          }
        />
        <Route
          path="team"
          element={
            <React.Suspense fallback={<div style={{ padding: 32 }}>Loading team...</div>}>
              <TeamPage />
            </React.Suspense>
          }
        />
        <Route
          path="settings"
          element={
            <React.Suspense fallback={<div style={{ padding: 32 }}>Loading settings...</div>}>
              <SettingsPage />
            </React.Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
