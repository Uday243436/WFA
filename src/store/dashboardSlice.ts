import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { fetchDashboardEmployees } from '../services/dashboardService';
import type {
  DashboardFilters,
  DashboardState,
  DashboardStats,
  Employee,
  DateRange,
} from '../models/DashboardModels';
import { getCurrentDate } from '../utils/dateUtils';

const initialFilters: DashboardFilters = {
  department: 'All',
  role: 'All',
  location: 'All',
  searchQuery: '',
  status: 'All',
  dateRange: {
    startDate: null,
    endDate: null,
  },
};

const initialStats: DashboardStats = {
  totalHeadcount: 0,
  activeCount: 0,
  newHires: 0,
  attritionRate: 0,
  skillCoverage: 0,
  trainingCompletion: 0,
  departmentDistribution: [],
  roleDistribution: [],
  monthlyHiringTrend: [],
};

const initialState: DashboardState = {
  employees: [],
  filteredEmployees: [],
  filters: initialFilters,
  stats: initialStats,
  loading: false,
  error: null,
};

const applyFiltersAndCalculateStats = (state: DashboardState) => {
  const { department, role, location, searchQuery, status, dateRange } = state.filters;
  let filtered = [...state.employees];

  if (department && department !== 'All') {
    filtered = filtered.filter((emp) => emp.department.toLowerCase() === department.toLowerCase());
  }

  if (role && role !== 'All') {
    filtered = filtered.filter((emp) => emp.role.toLowerCase() === role.toLowerCase());
  }

  if (location && location !== 'All') {
    filtered = filtered.filter((emp) => emp.location && emp.location.toLowerCase() === location.toLowerCase());
  }

  if (status && status !== 'All') {
    filtered = filtered.filter((emp) => emp.status.toLowerCase() === status.toLowerCase());
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (emp) =>
        emp.name.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.id.toLowerCase().includes(query) ||
        emp.role.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query)
    );
  }

  if (dateRange.startDate) {
    filtered = filtered.filter((emp) => emp.joinedDate >= dateRange.startDate!);
  }

  if (dateRange.endDate) {
    filtered = filtered.filter((emp) => emp.joinedDate <= dateRange.endDate!);
  }

  state.filteredEmployees = filtered;

  const total = filtered.length;
  const active = filtered.filter((emp) => emp.status === 'Active').length;
  const inactive = total - active;

  const currentDate = getCurrentDate();
  const ninetyDaysAgo = currentDate.subtract(90, 'day');

  const newHiresCount = filtered.filter((emp) => {
    const joined = dayjs(emp.joinedDate);
    return joined.isAfter(ninetyDaysAgo) && joined.isBefore(currentDate.add(1, 'day'));
  }).length;

  const attrition = total > 0 ? Math.round((inactive / total) * 100) : 0;
  const skillCoverage = total > 0 ? Math.min(100, Math.max(55, Math.round((active / total) * 100 + 10))) : 0;
  const trainingCompletion = total > 0 ? Math.min(100, Math.max(50, Math.round((newHiresCount / total) * 100 + 20))) : 0;

  const deptMap: Record<string, number> = {};
  filtered.forEach((emp) => {
    deptMap[emp.department] = (deptMap[emp.department] || 0) + 1;
  });
  const departmentDistribution = Object.entries(deptMap).map(([name, value]) => ({ name, value }));

  const roleMap: Record<string, number> = {};
  filtered.forEach((emp) => {
    roleMap[emp.role] = (roleMap[emp.role] || 0) + 1;
  });
  const roleDistribution = Object.entries(roleMap).map(([name, value]) => ({ name, value }));

  const monthlyTrend: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i -= 1) {
    const m = currentDate.subtract(i, 'month');
    const monthLabel = m.format('MMM YY');
    const start = m.startOf('month');
    const end = m.endOf('month');

    const count = filtered.filter((emp) => {
      const joined = dayjs(emp.joinedDate);
      return (joined.isSame(start) || joined.isAfter(start)) && (joined.isSame(end) || joined.isBefore(end));
    }).length;

    monthlyTrend.push({ month: monthLabel, count });
  }

  state.stats = {
    totalHeadcount: total,
    activeCount: active,
    newHires: newHiresCount,
    attritionRate: attrition,
    skillCoverage,
    trainingCompletion,
    departmentDistribution,
    roleDistribution,
    monthlyHiringTrend: monthlyTrend,
  };
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_filters: undefined, { rejectWithValue }) => {
    try {
      const employees = await fetchDashboardEmployees();
      return employees;
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
  setLocationFilter,
  setDateRange,
  resetFilters,
  addEmployee,
  deleteEmployee,
  setEmployees,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
