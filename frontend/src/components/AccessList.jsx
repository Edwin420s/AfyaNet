import { useContractRead } from 'wagmi';
import { PatientRecordsABI } from '../contracts/PatientRecordsABI';
import { formatAddress } from '../utils/web3';
import { formatDistanceToNow } from 'date-fns';

const AccessList = ({ permissions }) => {
  const { data: hospitals = [] } = useContractRead({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: PatientRecordsABI,
    functionName: 'getRegisteredHospitals',
  });

  const getHospitalName = (address) => {
    const hospital = hospitals.find(h => h.toLowerCase() === address.toLowerCase());
    return hospital ? formatAddress(hospital) : 'Unknown Facility';
  };

  return (
    <div className="space-y-2">
      {permissions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No active access permissions</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Hospital
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Purpose
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Expires
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {permissions.map((permission, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {getHospitalName(permission.grantee)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {permission.purpose}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(permission.expiry * 1000), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AccessList;