import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccount, useContractRead } from 'wagmi';
import { PatientRecordsABI } from '../contracts/PatientRecordsABI';
import { retrieveFromIPFS, decryptFile } from '../utils/ipfs';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaFilePdf, FaFileImage, FaFileAlt, FaLock } from 'react-icons/fa';

const ViewRecord = () => {
  const { cid } = useParams();
  const { address } = useAccount();
  const navigate = useNavigate();
  const [recordContent, setRecordContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decryptionKey, setDecryptionKey] = useState('');

  const { data: records = [] } = useContractRead({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: PatientRecordsABI,
    functionName: 'getRecords',
    args: [address],
  });

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setIsLoading(true);
        const record = records.find(r => r.ipfsCID === cid);
        
        if (!record) {
          throw new Error('Record not found in your account');
        }

        const encryptedData = await retrieveFromIPFS(cid);
        
        if (record.isEncrypted) {
          if (!decryptionKey) {
            return; // Wait for user to enter key
          }
          const decrypted = decryptFile(encryptedData, decryptionKey);
          setRecordContent(decrypted);
        } else {
          setRecordContent(encryptedData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (records.length > 0) {
      fetchRecord();
    }
  }, [cid, records, decryptionKey]);

  const getFileIcon = () => {
    if (!recordContent) return null;
    if (recordContent.type?.includes('pdf')) return <FaFilePdf className="text-red-500 text-4xl" />;
    if (recordContent.type?.includes('image')) return <FaFileImage className="text-blue-500 text-4xl" />;
    return <FaFileAlt className="text-gray-500 text-4xl" />;
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Error Loading Record</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold dark:text-white">Medical Record</h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              CID: {cid}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">Loading record...</p>
          </div>
        ) : recordContent ? (
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              {getFileIcon()}
              <div>
                <h2 className="text-lg font-medium dark:text-white">
                  {recordContent.name || 'Medical Record'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Uploaded: {new Date(recordContent.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
              {recordContent.type?.includes('image') ? (
                <img 
                  src={`data:${recordContent.type};base64,${recordContent.data}`} 
                  alt="Medical record" 
                  className="max-w-full h-auto mx-auto"
                />
              ) : recordContent.type?.includes('pdf') ? (
                <iframe 
                  src={`data:${recordContent.type};base64,${recordContent.data}`}
                  className="w-full h-96 border-0"
                  title="PDF Viewer"
                />
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-sm p-4 bg-white dark:bg-gray-800 rounded">
                  {recordContent.data}
                </pre>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900 dark:border-yellow-600">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Flock className="h-5 w-5 text-yellow-400 dark:text-yellow-300" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Encrypted Record
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-200 mt-2">
                    This record is encrypted. Please enter your decryption key to view it.
                  </p>
                  <div className="mt-4">
                    <input
                      type="password"
                      value={decryptionKey}
                      onChange={(e) => setDecryptionKey(e.target.value)}
                      placeholder="Enter decryption key"
                      className="px-3 py-2 border rounded-lg w-full max-w-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRecord;