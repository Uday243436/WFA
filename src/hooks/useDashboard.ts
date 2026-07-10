import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  setDepartmentFilter,
  setRoleFilter,
  setSearchQuery,
  setStatusFilter,
  setLocationFilter,
  setDateRange,
  resetFilters,
  fetchDashboardData,
  addEmployee,
  deleteEmployee,
  setEmployees,
} from '../store/dashboardSlice';
import { startRealtimePolling } from '../services/realtimeService';
import type { Employee } from '../models/DashboardModels';

export const useDashboard = () => {
  const dispatch = useAppDispatch();

  const filteredEmployees = useAppSelector((state) => state.dashboard.filteredEmployees);
  const filters = useAppSelector((state) => state.dashboard.filters);
  const stats = useAppSelector((state) => state.dashboard.stats);
  const loading = useAppSelector((state) => state.dashboard.loading);
  const error = useAppSelector((state) => state.dashboard.error);

  const loadData = useCallback(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const changeDepartment = useCallback(
    (department: string) => {
      dispatch(setDepartmentFilter(department));
    },
    [dispatch]
  );

  const changeRole = useCallback(
    (role: string) => {
      dispatch(setRoleFilter(role));
    },
    [dispatch]
  );

  const changeSearchQuery = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
    },
    [dispatch]
  );

  const changeStatus = useCallback(
    (status: 'All' | 'Active' | 'Inactive') => {
      dispatch(setStatusFilter(status));
    },
    [dispatch]
  );

  const changeLocation = useCallback(
    (location: string) => {
      dispatch(setLocationFilter(location));
    },
    [dispatch]
  );

  const changeDateRange = useCallback(
    (startDate: string | null, endDate: string | null) => {
      dispatch(setDateRange({ startDate, endDate }));
    },
    [dispatch]
  );

  const resetAllFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const addNewEmployee = useCallback(
    (employeeData: Omit<Employee, 'id' | 'avatar'>) => {
      dispatch(addEmployee(employeeData));
    },
    [dispatch]
  );

  const removeEmployee = useCallback(
    (id: string) => {
      dispatch(deleteEmployee(id));
    },
    [dispatch]
  );

  const startRealtimeUpdates = useCallback(() => {
    const poller = startRealtimePolling((employees: Employee[]) => {
      dispatch(setEmployees(employees));
    });
    return poller;
  }, [dispatch]);

  return {
    filteredEmployees,
    filters,
    stats,
    loading,
    error,
    loadData,
    changeDepartment,
    changeRole,
    changeLocation,
    changeSearchQuery,
    changeStatus,
    changeDateRange,
    resetAllFilters,
    addNewEmployee,
    removeEmployee,
    startRealtimeUpdates,
  };
};
