export type UserRole = 'patient' | 'doctor' | 'hospital_admin' | 'insurance' | 'researcher';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface DashboardProps {
  user: User;
  onSignOut: () => void;
}

export interface StatCard {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
}

export interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface MedicalRecord {
  id: string;
  date: string;
  type: string;
  provider: string;
  summary: string;
  documents: string[];
}

export interface AccessGrant {
  id: string;
  doctorId: string;
  doctorName: string;
  accessType: string;
  duration: string;
  grantedAt: string;
  status: string;
}

export interface Alert {
  id: string;
  type: string;
  message?: string;
  from?: string;
  fromId?: string;
  reason?: string;
  createdAt: string;
  status: string;
}