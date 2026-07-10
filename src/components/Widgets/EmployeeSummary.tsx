import { useMemo } from 'react';
import { useAppSelector } from '../../store';
import HeadCountCard from './HeadCountCard';

export function EmployeeSummary() {
  const employees = useAppSelector((state) => state.dashboard.employees);

  const summary = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((employee) => employee.status === 'Active').length;
    const inactiveEmployees = employees.filter((employee) => employee.status === 'Inactive').length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const newJoiners = employees.filter((employee) => {
      const joiningDate = new Date(employee.joinedDate);
      return joiningDate.getMonth() === currentMonth && joiningDate.getFullYear() === currentYear;
    }).length;

    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      newJoiners,
    };
  }, [employees]);

  return (
    <section className="employee-summary-section">
      <h2>Employee Summary</h2>
      <div className="employee-summary-grid">
        <HeadCountCard title="Total Employees" value={summary.totalEmployees} />
        <HeadCountCard title="Active Employees" value={summary.activeEmployees} />
        <HeadCountCard title="Inactive Employees" value={summary.inactiveEmployees} />
        <HeadCountCard title="New Joiners" value={summary.newJoiners} />
      </div>
    </section>
  );
}

export default EmployeeSummary;
