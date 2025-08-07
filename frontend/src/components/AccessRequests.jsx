import { useState } from 'react';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { PatientRecordsABI } from '../contracts/PatientRecordsABI';
import { formatAddress } from '../utils/web3';
import { formatDistanceToNow } from 'date-fns';
import { notifySuccess, notifyError } from '../utils/notifications';

const AccessRequests = () => {
  const { address } = useAccount();
  const [activeFilter, setActiveFilter] = useState('pending');
  
  const { data: requests = [], isLoading } = useContractRead({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: PatientRecordsABI,
    functionName: 'getAccessRequests',
    args: [address],
    enabled: !!address,
    watch: true
  });

  const { write: approveRequest } = useContractWrite({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: PatientRecordsABI,
    functionName: 'approveAccessRequest',
    onSuccess: () => notifySuccess('Access request approved'),
    onError: (error) => notifyError(error.message)
  });

  const { write: denyRequest } = useContractWrite({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: PatientRecordsABI,
    functionName: 'denyAccessRequest',
    onSuccess: () => notifySuccess('Access request denied'),
    onError: (error) => notifyError(error.message)
  });

  const filteredRequests = requests.filter(request => {
    if (activeFilter === 'pending') return !request.resolved;
    if (activeFilter === 'approved') return request.approved;
    if (activeFilter === 'denied') return request.resolved && !request.approved;
    return true;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold dark:text-white">Access Requests</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1 text-sm rounded-full ${activeFilter === 'pending' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveFilter('approved')}
            className={`px-3 py-1 text-sm rounded-full ${activeFilter === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            Approved
          </button>
          <button
            onClick={() => setActiveFilter('denied')}
            className={`px-3 py-1 text-sm rounded-full ${activeFilter === 'denied' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            Denied
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No {activeFilter} access requests found
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium dark:text-white">
                    {formatAddress(request.requester)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Requested access to record #{request.recordId.toString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(request.timestamp * 1000), { addSuffix: true })}
                  </p>
                </div>
                
                {!request.resolved ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => approveRequest({ args: [index] })}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => denyRequest({ args: [index] })}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                    >
                      Deny
                    </button>
                  </div>
                ) : request.approved ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Approved
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    Denied
                  </span>
                )}
              </div>
              
              {request.purpose && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Purpose:</span> {request.purpose}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccessRequests;