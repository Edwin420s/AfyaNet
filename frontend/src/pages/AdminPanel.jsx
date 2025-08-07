import { useState } from 'react';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { PatientRecordsABI, HospitalRegistryABI } from '../contracts';
import { notifySuccess, notifyError } from '../utils/notifications';

const AdminPanel = () => {
  const { address } = useAccount();
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [activeTab, setActiveTab] = useState('hospitals');

  const { data: isAdmin } = useContractRead({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: PatientRecordsABI,
    functionName: 'owner',
  });

  const { data: hospitals = [] } = useContractRead({
    address: import.meta.env.VITE_HOSPITAL_REGISTRY_ADDRESS,
    abi: HospitalRegistryABI,
    functionName: 'getRegisteredHospitals',
  });

  const { write: registerHospital } = useContractWrite({
    address: import.meta.env.VITE_HOSPITAL_REGISTRY_ADDRESS,
    abi: HospitalRegistryABI,
    functionName: 'registerHospital',
    onSuccess: () => {
      notifySuccess('Hospital registered successfully');
      setHospitalAddress('');
      setHospitalName('');
    },
    onError: (error) => notifyError(error.message),
  });

  if (address !== isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
        <p className="text-gray-600">
          Only the contract administrator can access this panel.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'hospitals' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('hospitals')}
        >
          Hospital Management
        </button>
      </div>

      {activeTab === 'hospitals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Register New Hospital</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hospital Address
                </label>
                <input
                  type="text"
                  value={hospitalAddress}
                  onChange={(e) => setHospitalAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hospital Name
                </label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  placeholder="General Hospital"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <button
                onClick={() => registerHospital({
                  args: [hospitalAddress, hospitalName, '', 'HOSP123'],
                })}
                disabled={!hospitalAddress || !hospitalName}
                className={`px-4 py-2 rounded-lg ${hospitalAddress && hospitalName ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300'} text-white`}
              >
                Register Hospital
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Registered Hospitals</h2>
            <div className="overflow-y-auto max-h-96">
              {hospitals.length === 0 ? (
                <p className="text-gray-500">No hospitals registered</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {hospitals.map((hospital, index) => (
                    <li key={index} className="py-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {hospital}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;