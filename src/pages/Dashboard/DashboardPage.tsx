import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ResponsiveGrid from '../../components/Layout/ResponsiveGrid';
import KpiCard from '../../components/KpiCard/KpiCard';
import KpiCardSkeleton from '../../components/KpiCard/KpiCardSkeleton';
import DashboardFilter from '../../components/Filters/DashboardFilter';
import DepartmentWidget from '../../components/Widgets/DepartmentWidget';
import RoleWidget from '../../components/Widgets/RoleWidget';
import EmployeeSummary from '../../components/Widgets/EmployeeSummary';
import { useDashboard } from '../../hooks/useDashboard';
import ChartContainer from '../../components/Charts/ChartContainer';
import LineChart from '../../components/Charts/LineChart';
import BarChart from '../../components/Charts/BarChart';
import PieChart from '../../components/Charts/PieChart';
import DonutChart from '../../components/Charts/DonutChart';
import SkillAnalytics from '../../components/Analytics/SkillAnalytics';
import { useSkillAnalytics } from '../../hooks/useSkillAnalytics';
import { getTodayInputValue } from '../../utils/dateUtils';
import type { NewEmployeeInput } from '../../types/employee';

type FormInput = NewEmployeeInput;

const employeeSchema: yup.ObjectSchema<FormInput> = yup.object({
  name: yup.string().required('Employee name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().required('Email address is required').email('Please enter a valid email address'),
  department: yup.string().required('Department is required'),
  role: yup.string().required('Role is required'),
  location: yup.string().required('Location is required'),
  status: yup.mixed<'Active' | 'Inactive'>().required('Status is required').oneOf(['Active', 'Inactive']),
  riskLevel: yup.mixed<'Low' | 'Medium' | 'High'>().required('Risk level is required').oneOf(['Low', 'Medium', 'High']),
  joinedDate: yup.string().required('Join date is required'),
});

const departmentRoles: Record<string, string[]> = {
  Engineering: ['Frontend Engineer', 'Backend Engineer', 'Fullstack Engineer', 'Engineering Manager'],
  Product: ['Product Manager', 'Associate Product Manager'],
  Design: ['Product Designer', 'UI/UX Researcher'],
  Marketing: ['Marketing Specialist', 'Content Strategist'],
  Sales: ['Sales Executive', 'Account Manager'],
  HR: ['HR Manager', 'Talent Acquisition Specialist'],
};
const departments = Object.keys(departmentRoles);
const locations = ['Chennai', 'Bangalore', 'Hyderabad', 'Pune'];

export const DashboardPage: React.FC = () => {
  const {
    employees,
    filteredEmployees,
    stats,
    kpis,
    loading,
    error,
    isFetching,
    loadData,
    resetAllFilters,
    addNewEmployee,
    removeEmployee,
  } = useDashboard();
  const skillAnalyticsQuery = useSkillAnalytics();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(employeeSchema),
    defaultValues: {
      name: '',
      email: '',
      department: 'Engineering',
      role: departmentRoles.Engineering[0],
      location: 'Bangalore',
      status: 'Active',
      riskLevel: 'Low',
      joinedDate: getTodayInputValue(),
    },
  });

  const selectedDepartment = watch('department');
  const availableRoles = useMemo(() => departmentRoles[selectedDepartment] || [], [selectedDepartment]);
  const selectedRole = watch('role');

  useEffect(() => {
    if (availableRoles.length > 0 && !availableRoles.includes(selectedRole)) {
      setValue('role', availableRoles[0], { shouldValidate: true });
    }
  }, [availableRoles, selectedRole, setValue]);

  const onSubmit = (data: FormInput) => {
    const emailExists = employees.some((employee) => employee.email.toLowerCase() === data.email.toLowerCase());
    if (emailExists) {
      toast.error('An employee with this email already exists.');
      return;
    }

    addNewEmployee(data);
    resetAllFilters();
    setIsModalOpen(false);
    reset({
      name: '',
      email: '',
      department: 'Engineering',
      role: departmentRoles.Engineering[0],
      location: 'Bangalore',
      status: 'Active',
      riskLevel: 'Low',
      joinedDate: getTodayInputValue(),
    });
    toast.success(`Successfully added ${data.name}!`);
  };

  const departmentsData = stats.departmentDistribution.map((item, index) => ({
    id: index,
    department: item.name,
    employees: item.value,
  }));

  const rolesData = stats.roleDistribution.map((item, index) => ({
    id: index,
    role: item.name,
    employees: item.value,
  }));

  if (loading && stats.totalHeadcount === 0) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <h2 style={{ color: '#64748b' }}>Loading dashboard state...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 48, color: '#ef4444', textAlign: 'center' }}>
        <h2>Error loading dashboard: {error}</h2>
        <button className="btn-primary" style={{ marginTop: 24 }} onClick={loadData}>
          Retry
        </button>
      </div>
    );
  }

  const skillDistribution = skillAnalyticsQuery.data?.distribution ?? [];
  const skillGaps = skillAnalyticsQuery.data?.skills ?? [];
  const chartsLoading = isFetching || skillAnalyticsQuery.isFetching;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <span className="page-kicker">Stackly workforce platform</span>
          <h1 className="page-title">Workforce Analytics</h1>
          <p className="page-subtitle">Real-time workforce visibility, risk monitoring, and skill gap intelligence.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          Add Employee
        </button>
      </div>

      <DashboardFilter />

      <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }}>
        {loading
          ? Array.from({ length: 7 }).map((_, index) => <KpiCardSkeleton key={index} />)
          : kpis.map((kpi) => <KpiCard key={kpi.id} data={kpi} />)}
      </ResponsiveGrid>

      <div className="dashboard dashboard-widget-grid">
        <DepartmentWidget departments={departmentsData} />
        <RoleWidget roles={rolesData} />
      </div>

      <EmployeeSummary />

      <div className="chart-grid">
        <ChartContainer title="Workforce Trend">
          <LineChart data={stats.monthlyHiringTrend} loading={chartsLoading} />
        </ChartContainer>
        <ChartContainer title="Department Performance">
          <BarChart data={stats.departmentDistribution} loading={chartsLoading} />
        </ChartContainer>
      </div>

      <div className="chart-grid">
        <ChartContainer title="Department Distribution">
          <PieChart data={stats.departmentDistribution} loading={chartsLoading} />
        </ChartContainer>
        <ChartContainer title="Risk Distribution">
          <PieChart data={stats.riskDistribution} loading={chartsLoading} />
        </ChartContainer>
      </div>

      <div className="chart-grid">
        <ChartContainer title="Skill Distribution">
          <DonutChart data={skillDistribution} loading={skillAnalyticsQuery.isFetching} />
        </ChartContainer>
        <ChartContainer title="Role Distribution">
          <PieChart data={stats.roleDistribution} loading={chartsLoading} />
        </ChartContainer>
      </div>

      <SkillAnalytics skills={skillGaps} loading={skillAnalyticsQuery.isFetching} />

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr className="table-header">
              <th>Employee</th>
              <th>ID</th>
              <th>Department</th>
              <th>Role</th>
              <th>Status</th>
              <th>Risk</th>
              <th>Join Date</th>
              <th className="table-actions-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={8} className="table-empty-state">
                  No employees found matching the current filters.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr key={emp.id} className="table-row">
                  <td>
                    <div className="employee-name">{emp.name}</div>
                    <div className="employee-email">{emp.email}</div>
                  </td>
                  <td className="table-id-cell">{emp.id}</td>
                  <td>{emp.department}</td>
                  <td>{emp.role}</td>
                  <td>
                    <span className={`status-badge ${emp.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>
                    <span className={`risk-badge risk-${emp.riskLevel.toLowerCase()}`}>
                      {emp.riskLevel}
                    </span>
                  </td>
                  <td>{emp.joinedDate}</td>
                  <td className="table-actions-cell">
                    <button
                      className="btn-remove"
                      onClick={() => {
                        removeEmployee(emp.id);
                        toast.info(`Removed employee ${emp.name}`);
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Employee</h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>
            <form className="modal-form-scroll" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label className="form-label">Employee Name</label>
                <input type="text" className="form-input" placeholder="Enter employee name" {...register('name')} />
                {errors.name && <span className="error-text">{errors.name.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" placeholder="name@example.com" {...register('email')} />
                {errors.email && <span className="error-text">{errors.email.message}</span>}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-input" {...register('department')}>
                    {departments.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                  {errors.department && <span className="error-text">{errors.department.message}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select className="form-input" {...register('role')}>
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {errors.role && <span className="error-text">{errors.role.message}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <select className="form-input" {...register('location')}>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                {errors.location && <span className="error-text">{errors.location.message}</span>}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-input" {...register('status')}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  {errors.status && <span className="error-text">{errors.status.message}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Risk Level</label>
                  <select className="form-input" {...register('riskLevel')}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  {errors.riskLevel && <span className="error-text">{errors.riskLevel.message}</span>}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Join Date</label>
                  <input type="date" className="form-input" {...register('joinedDate')} />
                  {errors.joinedDate && <span className="error-text">{errors.joinedDate.message}</span>}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" theme="light" />
    </div>
  );
};

export default DashboardPage;
