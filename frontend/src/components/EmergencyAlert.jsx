import { useEffect, useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { EmergencyAccessABI } from '../contracts/EmergencyAccessABI';
import { notifyWarning } from '../utils/notifications';

const EmergencyAlert = () => {
  const { address } = useAccount();
  const [activeAlerts, setActiveAlerts] = useState([]);
  
  const { data: emergencies } = useContractRead({
    address: import.meta.env.VITE_EMERGENCY_ACCESS_ADDRESS,
    abi: EmergencyAccessABI,
    functionName: 'getActiveEmergencies',
    args: [address],
    enabled: !!address,
    watch: true
  });

  useEffect(() => {
    if (emergencies && emergencies.length > 0) {
      setActiveAlerts(emergencies);
      emergencies.forEach(emergency => {
        notifyWarning(
          `Emergency access requested by ${emergency.requester}`,
          { autoClose: false }
        );
      });
    } else {
      setActiveAlerts([]);
    }
  }, [emergencies]);

  if (activeAlerts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {activeAlerts.map((alert, index) => (
        <div 
          key={index}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg"
          role="alert"
        >
          <div className="flex items-center">
            <div className="py-1">
              <svg className="h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Emergency Access Request</p>
              <p className="text-sm">From: {alert.requester}</p>
              <p className="text-sm">Expires: {new Date(alert.expiry * 1000).toLocaleString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmergencyAlert;