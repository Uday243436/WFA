import { useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../store';
import {
  setDepartmentFilter,
  setRoleFilter,
  setSearchQuery,
  setStatusFilter,
  setRiskLevelFilter,
  setLocationFilter,
  setDateRange,
  resetFilters,
  addEmployee,
  deleteEmployee,
  setEmployees,
  setDashboardError,
  setDashboardLoading,
} from '../store/dashboardSlice';
import type { NewEmployeeInput } from '../types/employee';
import { fetchDashboardData } from '../services/dashboardService';
import { createKpiCardsFromStats } from '../utils/dataTransformers';

export const useDashboard = () => {
  const dispatch = useAppDispatch();

  const employees = useAppSelector((state) => state.dashboard.employees);
  const filteredEmployees = useAppSelector((state) => state.dashboard.filteredEmployees);
  const filters = useAppSelector((state) => state.dashboard.filters);
  const stats = useAppSelector((state) => state.dashboard.stats);
  const loading = useAppSelector((state) => state.dashboard.loading);
  const error = useAppSelector((state) => state.dashboard.error);

  const dashboardQuery = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => fetchDashboardData(),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 2,
  });

  useEffect(() => {
    if (dashboardQuery.data) {
      dispatch(setEmployees(dashboardQuery.data.employees));
      dispatch(setDashboardError(null));
    }
  }, [dashboardQuery.data, dispatch]);

  useEffect(() => {
    dispatch(setDashboardLoading(dashboardQuery.isLoading || dashboardQuery.isFetching));
  }, [dashboardQuery.isFetching, dashboardQuery.isLoading, dispatch]);

  useEffect(() => {
    if (dashboardQuery.error) {
      dispatch(setDashboardError(dashboardQuery.error.message));
    }
  }, [dashboardQuery.error, dispatch]);

  const loadData = useCallback(() => {
    void dashboardQuery.refetch();
  }, [dashboardQuery]);

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

  const changeRiskLevel = useCallback(
    (riskLevel: 'All' | 'Low' | 'Medium' | 'High') => {
      dispatch(setRiskLevelFilter(riskLevel));
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
    (employeeData: NewEmployeeInput) => {
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

  return {
    employees,
    filteredEmployees,
    filters,
    stats,
    kpis: createKpiCardsFromStats(stats),
    skillGaps: dashboardQuery.data?.skills ?? [],
    lastUpdated: dashboardQuery.data?.lastUpdated,
    dataSource: dashboardQuery.data?.source,
    loading,
    error,
    isFetching: dashboardQuery.isFetching,
    isEmpty: !loading && filteredEmployees.length === 0,
    loadData,
    changeDepartment,
    changeRole,
    changeLocation,
    changeSearchQuery,
    changeStatus,
    changeRiskLevel,
    changeDateRange,
    resetAllFilters,
    addNewEmployee,
    removeEmployee,
  };
};
