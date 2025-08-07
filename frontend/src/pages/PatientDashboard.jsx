import { useState } from 'react';
import { useAccount } from 'wagmi';
import PatientProfile from '../components/PatientProfile';
import HealthMetrics from '../components/HealthMetrics';
import ConsentManager from '../components/ConsentManager';
import SharingHistory from '../components/SharingHistory';
import EmergencyAlert from '../components/EmergencyAlert';
import IPFSStatus from '../components/IPFSStatus';

const PatientDashboard = () => {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState('profile');

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Please connect your wallet to view your dashboard</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <EmergencyAlert />
      <IPFSStatus />

      <h1 className="text-3xl font-bold mb-8 dark:text-white">Patient Dashboard</h1>
      
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'metrics' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('metrics')}
        >
          Health Metrics
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'consent' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('consent')}
        >
          Consent Management
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('history')}
        >
          Sharing History
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {activeTab === 'profile' && <PatientProfile />}
        {activeTab === 'metrics' && <HealthMetrics />}
        {activeTab === 'consent' && <ConsentManager />}
        {activeTab === 'history' && <SharingHistory />}
      </div>
    </div>
  );
};

export default PatientDashboard;