import { useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { PatientRecordsABI } from '../contracts/PatientRecordsABI';
import { FaFilePdf, FaFileImage, FaFileMedical, FaLock, FaUnlock } from 'react-icons/fa';
import { format } from 'date-fns';

const RecordCard = ({ record, index }) => {
  const { address } = useAccount();
  const [showDetails, setShowDetails] = useState(false);
  
  const { data: permissions } = useContractRead({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: PatientRecordsABI,
    functionName: 'getAccessPermissions',
    args: [address],
    enabled: !!address
  });

  const getIcon = () => {
    if (record.recordType.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (record.recordType.startsWith('image/')) return <FaFileImage className="text-blue-500" />;
    return <FaFileMedical className="text-green-500" />;
  };

  const getAccessList = () => {
    if (!permissions) return [];
    return permissions.filter(p => p.recordId === index && p.isActive);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center space-x-3">
          <div className="text-xl">{getIcon()}</div>
          <div>
            <h3 className="font-medium">
              {record.recordType.split('/')[1] || 'Medical Record'}
            </h3>
            <p className="text-sm text-gray-500">
              {format(new Date(record.timestamp * 1000), 'MMM dd, yyyy HH:mm')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {record.isEncrypted ? (
            <Flock className="text-yellow-500" title="Encrypted" />
          ) : (
            <FaUnlock className="text-gray-400" title="Not Encrypted" />
          )}
          <span className={`px-2 py-1 text-xs rounded-full ${showDetails ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
            {getAccessList().length} access
          </span>
        </div>
      </div>
      
      {showDetails && (
        <div className="border-t p-4 bg-gray-50 dark:bg-gray-700">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">IPFS CID</h4>
              <p className="truncate font-mono text-sm">{record.ipfsCID}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Uploaded By</h4>
              <p className="truncate text-sm">{record.uploadedBy}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <a
              href={`/record/${record.ipfsCID}`}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
            >
              View Record
            </a>
            <button className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-sm">
              Share Access
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordCard;