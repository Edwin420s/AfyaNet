import { useState } from 'react';
import { useContractRead, useContractWrite } from 'wagmi';
import { PatientRecordsABI } from '../contracts/PatientRecordsABI';
import { formatAddress } from '../utils/web3';

const PatientSearch = () => {
  const [patientAddress, setPatientAddress] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [requestPurpose, setRequestPurpose] = useState('');

  const { data: records = [] } = useContractRead({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: PatientRecordsABI,
    functionName: 'getRecords',
    args: [patientAddress],
    enabled: searchPerformed && patientAddress.startsWith('0x'),
  });

  const { write: requestAccess } = useContractWrite({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: PatientRecordsABI,
    functionName: 'grantAccess',
    args: [patientAddress, 0, 3600, requestPurpose], // Default to first record for demo
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchPerformed(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Search Patient Records</h2>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={patientAddress}
            onChange={(e) => setPatientAddress(e.target.value)}
            placeholder="Enter patient wallet address"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {searchPerformed && (
        <div>
          {records.length > 0 ? (
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium dark:text-white">
                  Records for {formatAddress(patientAddress)}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {records.length} record(s) found
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Access Request Purpose
                  </label>
                  <input
                    type="text"
                    value={requestPurpose}
                    onChange={(e) => setRequestPurpose(e.target.value)}
                    placeholder="e.g. Emergency treatment"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <button
                  onClick={() => requestAccess()}
                  disabled={!requestPurpose}
                  className={`px-4 py-2 rounded-lg ${requestPurpose ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300'} text-white transition-colors`}
                >
                  Request Access
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {patientAddress.startsWith('0x') 
                  ? 'No records found for this address'
                  : 'Please enter a valid Ethereum address'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientSearch;