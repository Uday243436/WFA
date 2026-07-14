import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { fetchDashboardData as fetchDashboardApiData } from '../services/dashboardService';
import type {
  DashboardFilters,
  DashboardState,
  DashboardStats,
  Employee,
  DateRange,
} from '../models/DashboardModels';
import { calculateDashboardStats, defaultDashboardFilters, emptyDashboardStats, filterEmployees } from '../utils/dataTransformers';

const initialFilters: DashboardFilters = defaultDashboardFilters;

const initialStats: DashboardStats = emptyDashboardStats;

const initialState: DashboardState = {
  employees: [],
  filteredEmployees: [],
  filters: initialFilters,
  stats: initialStats,
  loading: false,
  error: null,
};

const applyFiltersAndCalculateStats = (state: DashboardState) => {
  const filteredEmployees = filterEmployees(state.employees, state.filters);
  state.filteredEmployees = filteredEmployees;
  state.stats = calculateDashboardStats(filteredEmployees);
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (filters: DashboardFilters | undefined, { rejectWithValue }) => {
    try {
      const dashboard = await fetchDashboardApiData(filters);
      return dashboard.employees;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      return rejectWithValue(message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDepartmentFilter: (state, action: PayloadAction<string>) => {
      state.filters.department = action.payload;
      applyFiltersAndCalculateStats(state);
    },
    setRoleFilter: (state, action: PayloadAction<string>) => {
      state.filters.role = action.payload;
      applyFiltersAndCalculateStats(state);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
      applyFiltersAndCalculateStats(state);
    },
    setStatusFilter: (state, action: PayloadAction<'All' | 'Active' | 'Inactive'>) => {
      state.filters.status = action.payload;
      applyFiltersAndCalculateStats(state);
    },
    setRiskLevelFilter: (state, action: PayloadAction<'All' | 'Low' | 'Medium' | 'High'>) => {
      state.filters.riskLevel = action.payload;
      applyFiltersAndCalculateStats(state);
    },
    setLocationFilter: (state, action: PayloadAction<string>) => {
      state.filters.location = action.payload;
      applyFiltersAndCalculateStats(state);
    },
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.filters.dateRange = action.payload;
      applyFiltersAndCalculateStats(state);
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
      applyFiltersAndCalculateStats(state);
    },
    addEmployee: (state, action: PayloadAction<Omit<Employee, 'id' | 'avatar'>>) => {
      const nextIdNum = state.employees.length + 1;
      const formattedId = `EMP-${String(nextIdNum).padStart(3, '0')}`;
      const newEmp: Employee = {
        ...action.payload,
        id: formattedId,
        joinedDate: action.payload.joinedDate || dayjs().format('YYYY-MM-DD'),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${action.payload.name}`,
        location: action.payload.location || 'Bangalore',
        riskLevel: action.payload.riskLevel || 'Low',
      };
      state.employees.push(newEmp);
      applyFiltersAndCalculateStats(state);
    },
    deleteEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter((emp) => emp.id !== action.payload);
      applyFiltersAndCalculateStats(state);
    },
    setEmployees: (state, action: PayloadAction<Employee[]>) => {
      state.employees = action.payload;
      applyFiltersAndCalculateStats(state);
    },
    setDashboardLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setDashboardError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action: PayloadAction<Employee[]>) => {
        state.loading = false;
        state.employees = action.payload;
        applyFiltersAndCalculateStats(state);
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'An error occurred';
      });
  },
});

export const {
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
  setDashboardLoading,
  setDashboardError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
