import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getContractStatus } from '../services/contractMonitor';
import LoadingSpinner from '../components/LoadingSpinner';

const SystemHealth = () => {
  const { address } = useAccount();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/system/health');
        const data = await response.json();
        
        if (response.ok) {
          setStatus(data);
        } else {
          setError(data.error || 'Failed to fetch system status');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  if (!address || !status) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          {loading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              {error || 'System status unavailable'}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">System Health</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Contract Status</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <p className={`font-medium ${status.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                {status.status.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Owner</p>
              <p className="font-mono dark:text-white">{status.owner}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Registered Hospitals</p>
              <p className="dark:text-white">{status.hospitalCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Recent Records (last 100 blocks)</p>
              <p className="dark:text-white">{status.recentRecords}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Node Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Block</p>
              <p className="dark:text-white">{status.lastBlock}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Checked</p>
              <p className="dark:text-white">
                {new Date(status.timestamp).toLocaleString()}
              </p>
            </div>
            {status.error && (
              <div className="bg-red-50 dark:bg-red-900 p-3 rounded">
                <p className="text-sm text-red-700 dark:text-red-200">
                  {status.error}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;