import { useState } from 'react';
import { useAccount, useContractWrite } from 'wagmi';
import { EmergencyAccessABI } from '../contracts';
import { notifySuccess, notifyError } from '../utils/notifications';

const EmergencyAccess = ({ patientAddress }) => {
  const { address } = useAccount();
  const [duration, setDuration] = useState(3600); // 1 hour in seconds
  const [reason, setReason] = useState('');

  const { write: requestEmergencyAccess } = useContractWrite({
    address: import.meta.env.VITE_EMERGENCY_ACCESS_ADDRESS,
    abi: EmergencyAccessABI,
    functionName: 'requestEmergencyAccess',
    onSuccess: () => {
      notifySuccess('Emergency access requested');
      setReason('');
    },
    onError: (error) => notifyError(error.message),
  });

  return (
    <div className="border border-red-200 bg-red-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-red-800 mb-2">Emergency Access</h3>
      <p className="text-sm text-red-600 mb-4">
        Only use in life-threatening situations. Requires patient approval.
      </p>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (seconds)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Access
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        
        <button
          onClick={() => requestEmergencyAccess({
            args: [patientAddress, duration],
          })}
          disabled={!reason}
          className={`px-4 py-2 rounded-lg ${reason ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300'} text-white`}
        >
          Request Emergency Access
        </button>
      </div>
    </div>
  );
};

export default EmergencyAccess;