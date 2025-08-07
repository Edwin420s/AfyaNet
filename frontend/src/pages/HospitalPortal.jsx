import { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { PatientRecordsABI } from '../contracts/PatientRecordsABI';
import PatientSearch from '../components/PatientSearch';
import AccessRequests from '../components/AccessRequests';

const HospitalPortal = () => {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState('search');

  const { data: isRegistered } = useContractRead({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: PatientRecordsABI,
    functionName: 'registeredHospitals',
    args: [address],
    enabled: !!address
  });

  if (!isRegistered) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Hospital Registration Required</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This address is not registered as a hospital. Please contact the system administrator to register your hospital.
          </p>
        </div>
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
      </div>
      
      {activeTab === 'search' ? <PatientSearch /> : <AccessRequests />}
    </div>
  );
};

export default HospitalPortal;