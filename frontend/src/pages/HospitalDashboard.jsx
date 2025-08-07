import { useState } from 'react';
import { useAccount } from 'wagmi';
import PatientSearch from '../components/PatientSearch';
import AccessRequests from '../components/AccessRequests';
import TreatmentRecords from '../components/TreatmentRecords';
import HospitalProfile from '../components/HospitalProfile';

const HospitalDashboard = () => {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState('search');

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Please connect your wallet to view the hospital dashboard</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Hospital Portal</h1>
      
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'search' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('search')}
        >
          Patient Search
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'requests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('requests')}
        >
          Access Requests
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'records' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('records')}
        >
          Treatment Records
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('profile')}
        >
          Hospital Profile
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {activeTab === 'search' && <PatientSearch />}
        {activeTab === 'requests' && <AccessRequests />}
        {activeTab === 'records' && <TreatmentRecords />}
        {activeTab === 'profile' && <HospitalProfile />}
      </div>
    </div>
  );
};

export default HospitalDashboard;