import { useState } from 'react';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { PatientRecordsABI } from '../contracts/PatientRecordsABI';
import { formatAddress } from '../utils/web3';
import { notifySuccess, notifyError } from '../utils/notifications';

const ConsentManager = () => {
  const { address } = useAccount();
  const [newConsentAddress, setNewConsentAddress] = useState('');
  const [consentDuration, setConsentDuration] = useState(86400); // 1 day in seconds

  const { data: consentList = [], isLoading } = useContractRead({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: PatientRecordsABI,
    functionName: 'getConsentList',
    args: [address],
    enabled: !!address,
    watch: true
  });

  const { write: grantConsent } = useContractWrite({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: PatientRecordsABI,
    functionName: 'grantConsent',
    onSuccess: () => {
      notifySuccess('Consent granted successfully');
      setNewConsentAddress('');
    },
    onError: (error) => notifyError(error.message)
  });

  const { write: revokeConsent } = useContractWrite({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: PatientRecordsABI,
    functionName: 'revokeConsent',
    onSuccess: () => notifySuccess('Consent revoked successfully'),
    onError: (error) => notifyError(error.message)
  });

  const handleGrantConsent = () => {
    if (!newConsentAddress || !consentDuration) return;
    grantConsent({
      args: [newConsentAddress, consentDuration]
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Consent Management</h2>
      
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <input
              type="text"
              value={newConsentAddress}
              onChange={(e) => setNewConsentAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Duration (seconds)
            </label>
            <input
              type="number"
              value={consentDuration}
              onChange={(e) => setConsentDuration(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGrantConsent}
              disabled={!newConsentAddress}
              className={`px-4 py-2 rounded-lg ${newConsentAddress ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300'} text-white`}
            >
              Grant Consent
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2 dark:text-white">Active Consents</h3>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : consentList.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No active consents</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {consentList.map((consent, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatAddress(consent.grantee)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(consent.expiry * 1000).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <button
                        onClick={() => revokeConsent({ args: [index] })}
                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsentManager;