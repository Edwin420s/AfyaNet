import React, { useState } from 'react';
import { 
  FlaskConical, 
  Database, 
  Shield, 
  Download,
  Search,
  Filter,
  Plus,
  TrendingUp,
  Users,
  FileText,
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

interface ResearcherDashboardProps {
  user: User;
  onSignOut: () => void;
}

const demoDatasets = [
  {
    id: 'DS-001',
    title: 'Cardiovascular Health Dataset',
    description: 'Anonymized data from 10,000 patients with heart conditions',
    records: 10000,
    price: 2500,
    category: 'Cardiology',
    anonymization: 'Zero-knowledge proofs'
  },
  {
    id: 'DS-002',
    title: 'Diabetes Management Cohort',
    description: 'Longitudinal study data on Type 2 diabetes treatments',
    records: 5500,
    price: 1800,
    category: 'Endocrinology',
    anonymization: 'Differential privacy'
  }
];

const demoRequests = [
  {
    id: 'REQ-001',
    dataset: 'Cardiovascular Health Dataset',
    status: 'approved',
    submittedDate: '2024-07-30',
    price: 2500
  },
  {
    id: 'REQ-002',
    dataset: 'Cancer Genomics Database',
    status: 'pending',
    submittedDate: '2024-08-01',
    price: 5000
  }
];

export function ResearcherDashboard({ user, onSignOut }: ResearcherDashboardProps) {
  const [activeTab, setActiveTab] = useState('datasets');
  const [searchQuery, setSearchQuery] = useState('');

  const statsCards = [
    { icon: Database, label: 'Available Datasets', value: demoDatasets.length, color: 'blue' },
    { icon: Shield, label: 'ZK-Anonymous Records', value: '23.7K', color: 'green' },
    { icon: FileText, label: 'Active Requests', value: demoRequests.length, color: 'purple' },
    { icon: TrendingUp, label: 'Research Score', value: '92', color: 'orange' }
  ];

  const tabs = [
    { id: 'datasets', label: 'Available Datasets', icon: Database },
    { id: 'requests', label: 'My Requests', icon: FileText },
    { id: 'purchased', label: 'Purchased Data', icon: Download },
    { id: 'analytics', label: 'Research Analytics', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">AfyaNet</h1>
                <p className="text-sm text-slate-600">Research Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium text-slate-900">{user.name}</p>
                <p className="text-sm text-slate-500">Researcher</p>
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
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-slate-600">{stat.label}</p>
                    <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
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
        {activeTab === 'datasets' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">Available Datasets</h2>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search datasets..."
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

            <div className="space-y-6">
              {demoDatasets.map((dataset) => (
                <Card key={dataset.id} className="p-6">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-slate-900">{dataset.title}</h3>
                        <Badge variant="outline">{dataset.category}</Badge>
                      </div>
                      <p className="text-slate-600 mb-3">{dataset.description}</p>
                      <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-500">
                        <div><span className="font-medium">Records:</span> {dataset.records.toLocaleString()}</div>
                        <div><span className="font-medium">Anonymization:</span> {dataset.anonymization}</div>
                        <div><span className="font-medium">Category:</span> {dataset.category}</div>
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <p className="text-2xl font-semibold text-slate-900 mb-2">
                        ${dataset.price.toLocaleString()}
                      </p>
                      <div className="space-y-2">
                        <Button className="w-full">Request Access</Button>
                        <Button variant="outline" className="w-full">View Sample</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">My Data Requests</h2>
              <Button><Plus className="w-4 h-4 mr-2" />New Request</Button>
            </div>
            <div className="space-y-4">
              {demoRequests.map((request) => (
                <Card key={request.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-slate-900">{request.id}</h3>
                        <Badge variant={request.status === 'approved' ? 'default' : 'secondary'}>
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-slate-600">{request.dataset}</p>
                      <p className="text-sm text-slate-500">Submitted: {request.submittedDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-semibold text-slate-900 mb-2">
                        ${request.price.toLocaleString()}
                      </p>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'purchased' || activeTab === 'analytics') && (
          <Card className="p-12 text-center">
            <Download className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {activeTab === 'purchased' ? 'No Purchased Data' : 'Analytics Coming Soon'}
            </h3>
            <p className="text-slate-600 mb-4">
              {activeTab === 'purchased' 
                ? 'Once you purchase datasets, they will appear here for download and analysis.'
                : 'Advanced research analytics and insights will be available soon.'
              }
            </p>
            <Button>Browse Available Datasets</Button>
          </Card>
        )}
      </div>
    </div>
  );
}