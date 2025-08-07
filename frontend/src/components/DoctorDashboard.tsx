import React, { useState, useEffect } from 'react';
import { 
  Search, 
  User, 
  FileText, 
  Stethoscope, 
  Calendar, 
  Clock,
  Plus,
  Send,
  LogOut,
  Shield,
  Users,
  Activity,
  TrendingUp
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { supabase } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

interface DoctorDashboardProps {
  user: User;
  onSignOut: () => void;
}

export function DoctorDashboard({ user, onSignOut }: DoctorDashboardProps) {
  const [activeTab, setActiveTab] = useState('patients');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccessRequest, setShowAccessRequest] = useState(false);
  const [accessRequestData, setAccessRequestData] = useState({
    patientEmail: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0345afcc/doctor/request-access`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(accessRequestData),
        }
      );

      if (response.ok) {
        setMessage('Access request sent successfully!');
        setAccessRequestData({ patientEmail: '', reason: '' });
        setShowAccessRequest(false);
      } else {
        const error = await response.json();
        setMessage(error.error || 'Failed to send access request');
      }
    } catch (error) {
      console.error('Error requesting access:', error);
      setMessage('An error occurred while sending the request');
    } finally {
      setLoading(false);
    }
  };

  const demoPatients = [
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

  const demoAppointments = [
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">AfyaNet</h1>
                <p className="text-sm text-slate-600">Doctor Portal</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium text-slate-900">Dr. {user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
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
                <p className="text-sm text-slate-600">Active Patients</p>
                <p className="text-2xl font-semibold text-slate-900">{demoPatients.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Today's Appointments</p>
                <p className="text-2xl font-semibold text-slate-900">{demoAppointments.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Prescriptions</p>
                <p className="text-2xl font-semibold text-slate-900">12</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Patient Satisfaction</p>
                <p className="text-2xl font-semibold text-slate-900">98%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'patients', label: 'My Patients', icon: Users },
              { id: 'appointments', label: 'Appointments', icon: Calendar },
              { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
              { id: 'requests', label: 'Access Requests', icon: Send }
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
          {activeTab === 'patients' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">My Patients</h2>
                <div className="flex space-x-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search patients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button onClick={() => setShowAccessRequest(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Request Access
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {demoPatients
                  .filter(patient => 
                    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((patient) => (
                    <Card key={patient.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-slate-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-900">{patient.name}</h3>
                            <p className="text-slate-600">Age: {patient.age} • {patient.condition}</p>
                            <p className="text-sm text-slate-500">Last visit: {patient.lastVisit}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={
                            patient.status === 'stable' ? 'default' :
                            patient.status === 'monitoring' ? 'secondary' : 'outline'
                          }>
                            {patient.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            View Records
                          </Button>
                          <Button size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            Prescribe
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Today's Appointments</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
              </div>

              <div className="space-y-4">
                {demoAppointments.map((appointment) => (
                  <Card key={appointment.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-5 h-5 text-slate-400" />
                          <span className="font-medium text-slate-900">{appointment.time}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900">{appointment.patient}</h3>
                          <p className="text-slate-600">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                          {appointment.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Start Visit
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Recent Prescriptions</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Prescription
                </Button>
              </div>

              <Card className="p-12 text-center">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No Recent Prescriptions</h3>
                <p className="text-slate-600 mb-4">
                  Prescriptions you issue will appear here for easy tracking and management.
                </p>
                <Button>Create First Prescription</Button>
              </Card>
            </div>
          )}

          {activeTab === 'requests' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Patient Access Requests</h2>
                <Button onClick={() => setShowAccessRequest(true)}>
                  <Send className="w-4 h-4 mr-2" />
                  Request Patient Access
                </Button>
              </div>

              <Card className="p-12 text-center">
                <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No Pending Requests</h3>
                <p className="text-slate-600 mb-4">
                  Request access to patient records to provide better care and treatment.
                </p>
                <Button onClick={() => setShowAccessRequest(true)}>
                  Send Access Request
                </Button>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Access Request Modal */}
      {showAccessRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900">Request Patient Access</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowAccessRequest(false)}>
                  ×
                </Button>
              </div>

              <form onSubmit={handleRequestAccess} className="space-y-4">
                <div>
                  <Label htmlFor="patientEmail">Patient Email</Label>
                  <Input
                    id="patientEmail"
                    type="email"
                    value={accessRequestData.patientEmail}
                    onChange={(e) => setAccessRequestData(prev => ({ ...prev, patientEmail: e.target.value }))}
                    required
                    className="mt-1"
                    placeholder="patient@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="reason">Reason for Access</Label>
                  <textarea
                    id="reason"
                    value={accessRequestData.reason}
                    onChange={(e) => setAccessRequestData(prev => ({ ...prev, reason: e.target.value }))}
                    required
                    className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Explain why you need access to this patient's records..."
                  />
                </div>

                {message && (
                  <div className={`p-3 rounded-lg ${
                    message.includes('success') 
                      ? 'bg-green-50 border border-green-200 text-green-700' 
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}>
                    <p className="text-sm">{message}</p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAccessRequest(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Request'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}