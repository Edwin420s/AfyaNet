import { MedicalRecord, AccessGrant, Alert } from './types';

export const demoPatientRecords: MedicalRecord[] = [
  {
    id: '1',
    date: '2024-01-15',
    type: 'Consultation',
    provider: 'Dr. Sarah Johnson',
    summary: 'Annual checkup - all vitals normal',
    documents: ['checkup-report.pdf']
  },
  {
    id: '2',
    date: '2024-02-20',
    type: 'Lab Results',
    provider: 'City Medical Lab',
    summary: 'Blood work - cholesterol slightly elevated',
    documents: ['lab-results-feb.pdf']
  },
  {
    id: '3',
    date: '2024-03-10',
    type: 'Prescription',
    provider: 'Dr. Sarah Johnson',
    summary: 'Prescribed statins for cholesterol management',
    documents: ['prescription-march.pdf']
  }
];

export const demoAccessGrants: AccessGrant[] = [
  {
    id: '1',
    doctorId: 'demo-doctor-1',
    doctorName: 'Dr. Sarah Johnson',
    accessType: 'full',
    duration: '6 months',
    grantedAt: '2024-01-15T10:00:00Z',
    status: 'active'
  }
];

export const demoAlerts: Alert[] = [
  {
    id: '1',
    type: 'reminder',
    message: 'Time for your 6-month cholesterol follow-up',
    createdAt: '2024-08-01T09:00:00Z',
    status: 'unread'
  }
];

export const demoPatients = [
  {
    id: '1',
    name: 'John Smith',
    age: 45,
    lastVisit: '2024-07-15',
    condition: 'Hypertension',
    status: 'stable'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    age: 32,
    lastVisit: '2024-07-20',
    condition: 'Diabetes Type 2',
    status: 'monitoring'
  },
  {
    id: '3',
    name: 'David Chen',
    age: 28,
    lastVisit: '2024-07-25',
    condition: 'Annual Checkup',
    status: 'healthy'
  }
];

export const demoAppointments = [
  {
    id: '1',
    patient: 'Sarah Wilson',
    time: '09:00 AM',
    type: 'Follow-up',
    status: 'confirmed'
  },
  {
    id: '2',
    patient: 'Michael Brown',
    time: '10:30 AM',
    type: 'Consultation',
    status: 'pending'
  },
  {
    id: '3',
    patient: 'Emily Davis',
    time: '02:00 PM',
    type: 'Check-up',
    status: 'confirmed'
  }
];

export const demoHospitalStaff = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    role: 'Cardiologist',
    department: 'Cardiology',
    status: 'active',
    license: 'MD12345'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    role: 'Emergency Physician',
    department: 'Emergency',
    status: 'active',
    license: 'MD67890'
  },
  {
    id: '3',
    name: 'Dr. Emily Wilson',
    role: 'Pediatrician',
    department: 'Pediatrics',
    status: 'pending_verification',
    license: 'MD54321'
  }
];

export const demoInsuranceClaims = [
  {
    id: 'CLM-001',
    patient: 'John Smith',
    provider: 'City General Hospital',
    amount: 2500,
    date: '2024-08-01',
    status: 'approved',
    type: 'Emergency Visit'
  },
  {
    id: 'CLM-002',
    patient: 'Maria Garcia',
    provider: 'Dr. Sarah Johnson',
    amount: 450,
    date: '2024-08-03',
    status: 'pending',
    type: 'Consultation'
  },
  {
    id: 'CLM-003',
    patient: 'David Chen',
    provider: 'MediLab Diagnostics',
    amount: 320,
    date: '2024-08-04',
    status: 'under_review',
    type: 'Lab Tests'
  }
];