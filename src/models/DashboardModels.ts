export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'Active' | 'Inactive';
  joinedDate: string;
  avatar: string;
  location: string;
}

export interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

export interface DashboardFilters {
  department: string;
  role: string;
  location: string;
  searchQuery: string;
  status: 'All' | 'Active' | 'Inactive';
  dateRange: DateRange;
}

export interface DashboardStats {
  totalHeadcount: number;
  activeCount: number;
  newHires: number;
  attritionRate: number;
  skillCoverage: number;
  trainingCompletion: number;
  departmentDistribution: { name: string; value: number }[];
  roleDistribution: { name: string; value: number }[];
  monthlyHiringTrend: { month: string; count: number }[];
}

export interface DashboardState {
  employees: Employee[];
  filteredEmployees: Employee[];
  filters: DashboardFilters;
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
}

export interface ChartSegment {
  name: string;
  value: number;
}

export interface LineChartData {
  month: string;
  count: number;
}

export interface SkillGap {
  skill: string;
  employees: number;
  gap: string;
}

export const mockEmployees: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Sanjay Kumar',
    email: 'sanjay.kumar@example.com',
    department: 'Engineering',
    role: 'Frontend Engineer',
    status: 'Active',
    joinedDate: '2025-01-15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sanjay',
    location: 'Chennai',
  },
  {
    id: 'EMP-002',
    name: 'Rohith Sharma',
    email: 'rohith.sharma@example.com',
    department: 'Engineering',
    role: 'Backend Engineer',
    status: 'Active',
    joinedDate: '2024-03-12',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohith',
    location: 'Bangalore',
  },
  {
    id: 'EMP-003',
    name: 'Dhoni Singh',
    email: 'dhoni.singh@example.com',
    department: 'Engineering',
    role: 'Fullstack Engineer',
    status: 'Active',
    joinedDate: '2024-08-20',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dhoni',
    location: 'Hyderabad',
  },
  {
    id: 'EMP-004',
    name: 'Virat Patel',
    email: 'virat.patel@example.com',
    department: 'Design',
    role: 'Product Designer',
    status: 'Active',
    joinedDate: '2025-05-10',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Virat',
    location: 'Pune',
  },
  {
    id: 'EMP-005',
    name: 'Hardik Rao',
    email: 'hardik.rao@example.com',
    department: 'Product',
    role: 'Product Manager',
    status: 'Active',
    joinedDate: '2023-11-01',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hardik',
    location: 'Bangalore',
  },
];
