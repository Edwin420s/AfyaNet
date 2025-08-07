import React, { useState } from 'react';
import { 
  Building, 
  Users, 
  UserCheck, 
  FileText, 
  Upload,
  Plus,
  Settings,
  TrendingUp,
  Activity,
  LogOut,
  Badge as BadgeIcon
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

interface HospitalDashboardProps {
  user: User;
  onSignOut: () => void;
}

export function HospitalDashboard({ user, onSignOut }: HospitalDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const demoStaff = [
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

  const demoReports = [
    {
      id: '1',
      patient: 'John Smith',
      type: 'Lab Results',
      department: 'Laboratory',
      date: '2024-08-05',
      status: 'completed'
    },
    {
      id: '2',
      patient: 'Maria Garcia',
      type: 'X-Ray',
      department: 'Radiology',
      date: '2024-08-04',
      status: 'pending'
    },
    {
      id: '3',
      patient: 'David Chen',
      type: 'Blood Test',
      department: 'Laboratory',
      date: '2024-08-03',
      status: 'completed'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">AfyaNet</h1>
                <p className="text-sm text-slate-600">Hospital Administration</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium text-slate-900">{user.name}</p>
                <p className="text-sm text-slate-500">Administrator</p>
              </div>
              <Button variant="outline" onClick={onSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Total Staff</p>
                <p className="text-2xl font-semibold text-slate-900">{demoStaff.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Active Doctors</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {demoStaff.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Daily Reports</p>
                <p className="text-2xl font-semibold text-slate-900">{demoReports.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">System Usage</p>
                <p className="text-2xl font-semibold text-slate-900">94%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'staff', label: 'Staff Management', icon: Users },
              { id: 'reports', label: 'Reports & Diagnostics', icon: FileText },
              { id: 'settings', label: 'System Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Hospital Overview</h2>
              
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">Dr. Sarah Johnson uploaded lab results</span>
                      <span className="text-xs text-slate-400">5 min ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">New doctor verification request</span>
                      <span className="text-xs text-slate-400">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">System backup completed</span>
                      <span className="text-xs text-slate-400">6 hours ago</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Pending Tasks</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Verify Dr. Emily Wilson</span>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Review access requests (3)</span>
                      <Badge variant="secondary">Action needed</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Monthly compliance report</span>
                      <Badge variant="outline">Due tomorrow</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Staff Management</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Staff Member
                </Button>
              </div>

              <div className="space-y-4">
                {demoStaff.map((staff) => (
                  <Card key={staff.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900">{staff.name}</h3>
                          <p className="text-slate-600">{staff.role} • {staff.department}</p>
                          <p className="text-sm text-slate-500">License: {staff.license}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={staff.status === 'active' ? 'default' : 'secondary'}>
                          {staff.status.replace('_', ' ')}
                        </Badge>
                        {staff.status === 'pending_verification' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <BadgeIcon className="w-4 h-4 mr-2" />
                            Verify
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Reports & Diagnostics</h2>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Report
                </Button>
              </div>

              <div className="space-y-4">
                {demoReports.map((report) => (
                  <Card key={report.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-slate-900">{report.type}</h3>
                        <p className="text-slate-600">Patient: {report.patient}</p>
                        <p className="text-sm text-slate-500">
                          {report.department} • {report.date}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={report.status === 'completed' ? 'default' : 'secondary'}>
                          {report.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">System Settings</h2>
              
              <div className="grid gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                        <p className="text-sm text-slate-600">Require 2FA for all staff logins</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Access Logging</p>
                        <p className="text-sm text-slate-600">Monitor all data access attempts</p>
                      </div>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Data Management</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Backup Schedule</p>
                        <p className="text-sm text-slate-600">Automatic daily backups at 2:00 AM</p>
                      </div>
                      <Button variant="outline" size="sm">Modify</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Data Retention</p>
                        <p className="text-sm text-slate-600">Keep records for 7 years as per regulations</p>
                      </div>
                      <Badge variant="default">Compliant</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}