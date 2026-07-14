export type EmployeeId = string;
export type ISODateString = string;

export type EmployeeStatus = 'Active' | 'Inactive';
export type EmployeeRiskLevel = 'Low' | 'Medium' | 'High';

export type DepartmentName = string;
export type RoleName = string;
export type WorkLocation = string;

export interface Employee {
  id: EmployeeId;
  name: string;
  email: string;
  department: DepartmentName;
  role: RoleName;
  status: EmployeeStatus;
  riskLevel: EmployeeRiskLevel;
  joinedDate: ISODateString;
  avatar: string;
  location: WorkLocation;
}

export type NewEmployeeInput = Omit<Employee, 'id' | 'avatar'>;

export interface EmployeeSummaryMetrics {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  highRiskEmployees: number;
}
