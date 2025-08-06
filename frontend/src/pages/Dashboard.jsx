import { useState, useEffect } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { PatientRecordsABI } from '../contracts/PatientRecordsABI';
import { encryptFile } from '../utils/encryption';
import { storeOnIPFS } from '../utils/ipfs';
import RecordCard from '../components/RecordCard';
import AccessPermissions from '../components/AccessPermissions';

const Dashboard = () => {
  const { address } = useAccount();
  const [records, setRecords] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch patient records
  const { data: patientRecords } = useContractRead({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: PatientRecordsABI,
    functionName: 'getRecords',
    args: [address],
    enabled: !!address,
    watch: true
  });
  
  // Fetch access permissions
  const { data: accessPermissions } = useContractRead({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: PatientRecordsABI,
    functionName: 'getAccessPermissions',
    args: [address],
    enabled: !!address,
    watch: true
  });
  
  const handleUpload = async (file) => {
    setIsLoading(true);
    try {
      // Encrypt file before upload
      const secretKey = 'patient-secret-key'; // In prod, derive from wallet signature
      const encryptedFile = await encryptFile(file, secretKey);
      
      // Store on IPFS
      const cid = await storeOnIPFS(encryptedFile, file.name);
      
      // Add record to blockchain
      await window.contract.addRecord(cid, file.type, true);
      
      // Refresh records
      setRecords([...records, {
        ipfsCID: cid,
        recordType: file.type,
        timestamp: Date.now(),
        isEncrypted: true
      }]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (patientRecords) {
      setRecords(patientRecords);
    }
    if (accessPermissions) {
      setPermissions(accessPermissions);
    }
  }, [patientRecords, accessPermissions]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Health Records</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Medical Records</h2>
            {records.length === 0 ? (
              <p className="text-gray-500">No records found</p>
            ) : (
              <div className="space-y-4">
                {records.map((record, index) => (
                  <RecordCard 
                    key={index} 
                    record={record} 
                    index={index}
                    address={address}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Upload New Record</h2>
            <FileUpload onUpload={handleUpload} isLoading={isLoading} />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Access Permissions</h2>
            <AccessPermissions 
              permissions={permissions} 
              address={address} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;