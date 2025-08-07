import { useState, useEffect } from 'react';
import { Web3Storage } from 'web3.storage';

const IPFSStatus = () => {
  const [status, setStatus] = useState('checking');
  const [peers, setPeers] = useState(0);

  useEffect(() => {
    const checkIPFS = async () => {
      try {
        const client = new Web3Storage({ token: import.meta.env.VITE_WEB3_STORAGE_TOKEN });
        const status = await client.status();
        
        if (status) {
          setStatus('connected');
          setPeers(status.deals?.length || 0);
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('IPFS check failed:', error);
        setStatus('error');
      }
    };

    checkIPFS();
    const interval = setInterval(checkIPFS, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return `Connected (${peers} peers)`;
      case 'error': return 'Connection Error';
      default: return 'Checking Status...';
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center space-x-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className={`h-2 w-2 rounded-full ${getStatusColor()}`}></div>
      <span className="text-sm font-medium dark:text-white">IPFS: {getStatusText()}</span>
    </div>
  );
};

export default IPFSStatus;