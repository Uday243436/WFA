import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ResponsiveGrid from '../../components/Layout/ResponsiveGrid';
import type { KpiCardModel } from '../../models/KpiCardModel';
import KpiCard from '../../components/KpiCard/KpiCard';
import KpiCardSkeleton from '../../components/KpiCard/KpiCardSkeleton';
import DashboardFilter from '../../components/Filters/DashboardFilter';
import DepartmentWidget from '../../components/Widgets/DepartmentWidget';
import RoleWidget from '../../components/Widgets/RoleWidget';
import EmployeeSummary from '../../components/Widgets/EmployeeSummary';
import { useDashboard } from '../../hooks/useDashboard';

interface FormInput {
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'Active' | 'Inactive';
  joinedDate: string;
}

const employeeSchema: yup.ObjectSchema<FormInput> = yup.object({
  name: yup.string().required('Employee name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().required('Email address is required').email('Please enter a valid email address'),
  department: yup.string().required('Department is required'),
  role: yup.string().required('Role is required'),
  status: yup.mixed<'Active' | 'Inactive'>().required('Status is required').oneOf(['Active', 'Inactive']),
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

export const DashboardPage: React.FC = () => {
  const {
    filteredEmployees,
    stats,
    loading,
    error,
    loadData,
    addNewEmployee,
    removeEmployee,
  } = useDashboard();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(employeeSchema),
    defaultValues: {
      name: '',
      email: '',
      department: 'Engineering',
      role: '',
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
    },
  });

  const selectedDepartment = watch('department');
  const availableRoles = departmentRoles[selectedDepartment] || [];

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onSubmit = (data: FormInput) => {
    addNewEmployee(data);
    setIsModalOpen(false);
    reset({
      name: '',
      email: '',
      department: 'Engineering',
      role: '',
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
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
      </div>
    );
  }

  const kpiData: KpiCardModel[] = [
    {
      id: 'headcount',
      title: 'Total Headcount',
      value: stats.totalHeadcount.toLocaleString(),
      changePercentage: '+4.2%',
      changeDirection: 'up',
      timeframe: 'vs last month',
      iconName: 'Users',
      colorTheme: '#6366f1',
    },
    {
      id: 'active-roles',
      title: 'Active Count',
      value: stats.activeCount.toLocaleString(),
      changePercentage: '+12.5%',
      changeDirection: 'up',
      timeframe: 'vs last month',
      iconName: 'Activity',
      colorTheme: '#10b981',
    },
    {
      id: 'new-hires',
      title: 'New Hires (90 Days)',
      value: stats.newHires.toLocaleString(),
      changePercentage: '+3.1%',
      changeDirection: 'up',
      timeframe: 'vs last quarter',
      iconName: 'UserPlus',
      colorTheme: '#3b82f6',
    },
    {
      id: 'attrition',
      title: 'Attrition Rate',
      value: `${stats.attritionRate}%`,
      changePercentage: stats.attritionRate > 0 ? '-0.4%' : '0.0%',
      changeDirection: stats.attritionRate > 0 ? 'down' : 'neutral',
      timeframe: 'vs last month',
      iconName: 'TrendingDown',
      colorTheme: '#f59e0b',
    },
  ];

  return (
    <div style={{ padding: '0 24px 40px', width: '100%', maxWidth: 1400, margin: '0 auto' }}>
      <DashboardFilter />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center', margin: '32px 0' }}>
        <div>
          <h1 className="page-title">Workforce Analytics</h1>
          <p className="page-subtitle">Real-time metrics, filtered insights, and team trends.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          Add Employee
        </button>
      </div>

      <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }}>
        {loading
          ? Array.from({ length: 4 }).map((_, index) => <KpiCardSkeleton key={index} />)
          : kpiData.map((kpi) => <KpiCard key={kpi.id} data={kpi} />)}
      </ResponsiveGrid>

      <div className="dashboard" style={{ marginBottom: 32 }}>
        <DepartmentWidget departments={departmentsData} />
        <RoleWidget roles={rolesData} />
      </div>

      <EmployeeSummary />

      <div className="table-container">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
          <thead>
            <tr className="table-header">
              <th style={{ padding: '18px 24px', fontWeight: 700 }}>Employee</th>
              <th style={{ padding: '18px 24px', fontWeight: 700 }}>ID</th>
              <th style={{ padding: '18px 24px', fontWeight: 700 }}>Department</th>
              <th style={{ padding: '18px 24px', fontWeight: 700 }}>Role</th>
              <th style={{ padding: '18px 24px', fontWeight: 700 }}>Status</th>
              <th style={{ padding: '18px 24px', fontWeight: 700 }}>Join Date</th>
              <th style={{ padding: '18px 24px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '48px 24px', textAlign: 'center', color: '#94a3b8' }}>
                  No employees found matching the current filters.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr key={emp.id} className="table-row" style={{ color: '#334155' }}>
                  <td style={{ padding: '18px 24px' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{emp.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{emp.email}</div>
                  </td>
                  <td style={{ padding: '18px 24px', fontWeight: 500 }}>{emp.id}</td>
                  <td style={{ padding: '18px 24px' }}>{emp.department}</td>
                  <td style={{ padding: '18px 24px' }}>{emp.role}</td>
                  <td style={{ padding: '18px 24px' }}>
                    <span className={`status-badge ${emp.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td style={{ padding: '18px 24px' }}>{emp.joinedDate}</td>
                  <td style={{ padding: '18px 24px', textAlign: 'right' }}>
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
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 18, color: '#0f172a', fontWeight: 800 }}>Add New Employee</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#64748b', lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 24 }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-input" {...register('department')}>
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                  </select>
                  {errors.department && <span className="error-text">{errors.department.message}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select className="form-input" {...register('role')}>
                    <option value="">Select Role</option>
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {errors.role && <span className="error-text">{errors.role.message}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-input" {...register('status')}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  {errors.status && <span className="error-text">{errors.status.message}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Join Date</label>
                  <input type="date" className="form-input" {...register('joinedDate')} />
                  {errors.joinedDate && <span className="error-text">{errors.joinedDate.message}</span>}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '10px 18px', borderRadius: 8, border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#475569' }}
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
