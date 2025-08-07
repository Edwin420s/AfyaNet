import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Shield, 
  Bell, 
  Share2, 
  Download, 
  Plus,
  Calendar,
  Activity,
  Users,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { DashboardHeader } from './shared/DashboardHeader';
import { StatsCards } from './shared/StatsCards';
import { TabNavigation } from './shared/TabNavigation';
import { DashboardProps, MedicalRecord, AccessGrant, Alert } from './shared/types';
import { supabase } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';

export function PatientDashboard({ user, onSignOut }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('timeline');
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [accessGrants, setAccessGrants] = useState<AccessGrant[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatientData();
  }, []);

  const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const loadPatientData = async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0345afcc/patient/records`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRecords(data.medicalTimeline || []);
        setAccessGrants(data.accessGrants || []);
        setAlerts(data.alerts || []);
      }
    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const seedDemoData = async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0345afcc/seed-demo-data`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        await loadPatientData();
      }
    } catch (error) {
      console.error('Error seeding demo data:', error);
    }
  };

  const handleAccessResponse = async (alertId: string, response: 'approve' | 'deny') => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: response === 'approve' ? 'approved' : 'denied' }
        : alert
    ));
  };

  const unreadAlerts = alerts.filter(alert => 
    alert.status === 'unread' || alert.status === 'pending'
  ).length;

  const statsCards = [
    { icon: FileText, label: 'Medical Records', value: records.length, color: 'blue' },
    { icon: Users, label: 'Authorized Providers', value: accessGrants.length, color: 'green' },
    { icon: Bell, label: 'Active Alerts', value: unreadAlerts, color: 'yellow' },
    { icon: Activity, label: 'Health Score', value: '85', color: 'purple' }
  ];

  const tabs = [
    { id: 'timeline', label: 'Medical Timeline', icon: Calendar },
    { id: 'access', label: 'Access Control', icon: Shield },
    { id: 'alerts', label: 'Alerts & Notifications', icon: Bell },
    { id: 'sharing', label: 'Data Sharing', icon: Share2 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader
        user={user}
        onSignOut={onSignOut}
        icon={Shield}
        title="AfyaNet"
        subtitle="Patient Portal"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsCards stats={statsCards} />
        
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          badges={{ alerts: unreadAlerts }}
        />

        {/* Tab Content */}
        {activeTab === 'timeline' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">Medical Timeline</h2>
              <div className="flex space-x-3">
                {records.length === 0 && (
                  <Button onClick={seedDemoData} variant="outline">Load Demo Data</Button>
                )}
                <Button><Plus className="w-4 h-4 mr-2" />Add Record</Button>
              </div>
            </div>

            {records.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No Medical Records</h3>
                <p className="text-slate-600 mb-4">
                  Start building your health timeline by adding medical records, lab results, and prescriptions.
                </p>
                <Button onClick={seedDemoData}>Load Demo Data</Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {records.map((record) => (
                  <Card key={record.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant={
                            record.type === 'Consultation' ? 'default' :
                            record.type === 'Lab Results' ? 'secondary' : 'outline'
                          }>
                            {record.type}
                          </Badge>
                          <span className="text-sm text-slate-500">{record.date}</span>
                        </div>
                        <h3 className="font-medium text-slate-900 mb-1">{record.provider}</h3>
                        <p className="text-slate-600 mb-3">{record.summary}</p>
                        {record.documents.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              {record.documents.length} document(s)
                            </span>
                          </div>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />View
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Alerts & Notifications</h2>
            {alerts.length === 0 ? (
              <Card className="p-12 text-center">
                <Bell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No Alerts</h3>
                <p className="text-slate-600">You're all caught up! No new notifications.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <Card key={alert.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-blue-500 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-900 mb-1">
                            {alert.type === 'access_request' ? `Access Request from ${alert.from}` : 'Health Reminder'}
                          </h3>
                          <p className="text-slate-600 mb-2">{alert.message || alert.reason}</p>
                          <p className="text-sm text-slate-500">
                            {new Date(alert.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      {alert.type === 'access_request' && alert.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleAccessResponse(alert.id, 'approve')}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAccessResponse(alert.id, 'deny')}
                          >
                            Deny
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {(activeTab === 'access' || activeTab === 'sharing') && (
          <Card className="p-12 text-center">
            <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {activeTab === 'access' ? 'Access Control' : 'Data Sharing'}
            </h3>
            <p className="text-slate-600">
              {activeTab === 'access' 
                ? 'Manage who can access your health information.' 
                : 'View your data sharing activity and logs.'
              }
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}