import React, { useState } from 'react';
import { 
  CreditCard, 
  FileText, 
  DollarSign, 
  TrendingUp,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  LogOut
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

interface InsuranceDashboardProps {
  user: User;
  onSignOut: () => void;
}

export function InsuranceDashboard({ user, onSignOut }: InsuranceDashboardProps) {
  const [activeTab, setActiveTab] = useState('claims');
  const [searchQuery, setSearchQuery] = useState('');

  const demoClaims = [
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'under_review': return 'outline';
      case 'denied': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'pending': return Clock;
      case 'under_review': return AlertCircle;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">AfyaNet</h1>
                <p className="text-sm text-slate-600">Insurance Portal</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium text-slate-900">{user.name}</p>
                <p className="text-sm text-slate-500">Insurance Provider</p>
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
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Total Claims</p>
                <p className="text-2xl font-semibold text-slate-900">{demoClaims.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Approved Claims</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {demoClaims.filter(c => c.status === 'approved').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Pending Review</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {demoClaims.filter(c => c.status === 'pending' || c.status === 'under_review').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Total Value</p>
                <p className="text-2xl font-semibold text-slate-900">
                  ${demoClaims.reduce((sum, claim) => sum + claim.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'claims', label: 'Claims Management', icon: FileText },
              { id: 'validation', label: 'Smart Contract Validation', icon: CheckCircle },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'audit', label: 'Audit Trail', icon: AlertCircle }
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
          {activeTab === 'claims' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Claims Management</h2>
                <div className="flex space-x-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search claims..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {demoClaims
                  .filter(claim => 
                    claim.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    claim.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    claim.id.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((claim) => {
                    const StatusIcon = getStatusIcon(claim.status);
                    return (
                      <Card key={claim.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-slate-100 rounded-lg">
                              <StatusIcon className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-medium text-slate-900">{claim.id}</h3>
                                <Badge variant={getStatusColor(claim.status)}>
                                  {claim.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <p className="text-slate-600">
                                {claim.patient} • {claim.provider}
                              </p>
                              <p className="text-sm text-slate-500">
                                {claim.type} • {claim.date}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-semibold text-slate-900">
                              ${claim.amount.toLocaleString()}
                            </p>
                            <div className="flex space-x-2 mt-2">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                              {claim.status === 'pending' && (
                                <Button size="sm">
                                  Review
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
              </div>
            </div>
          )}

          {activeTab === 'validation' && (
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Smart Contract Validation</h2>
              
              <Card className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Blockchain Validation Active</h3>
                <p className="text-slate-600 mb-4">
                  All claims are automatically validated against smart contracts for authenticity and compliance.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-8">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-1">Valid Contracts</h4>
                    <p className="text-2xl font-semibold text-green-700">98.5%</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">Processing Time</h4>
                    <p className="text-2xl font-semibold text-blue-700">1.2s</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-1">Gas Efficiency</h4>
                    <p className="text-2xl font-semibold text-purple-700">94%</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Claims Analytics</h2>
              
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Monthly Trends</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Total Claims</span>
                      <span className="font-semibold text-slate-900">↑ 12%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Approval Rate</span>
                      <span className="font-semibold text-green-600">↑ 3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Processing Time</span>
                      <span className="font-semibold text-blue-600">↓ 15%</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Top Providers</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">City General Hospital</span>
                      <span className="font-semibold text-slate-900">$45,230</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Dr. Sarah Johnson</span>
                      <span className="font-semibold text-slate-900">$12,450</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">MediLab Diagnostics</span>
                      <span className="font-semibold text-slate-900">$8,720</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Audit Trail</h2>
              
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">Claim CLM-001 approved automatically</p>
                      <p className="text-xs text-slate-500">Smart contract validation passed • 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">Manual review initiated for CLM-003</p>
                      <p className="text-xs text-slate-500">Anomaly detected in billing amount • 4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">New claim CLM-002 submitted</p>
                      <p className="text-xs text-slate-500">Awaiting blockchain validation • 6 hours ago</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}