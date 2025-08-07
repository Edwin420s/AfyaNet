import { useAccount, useContractRead } from 'wagmi';
import { PatientRecordsABI } from '../contracts/PatientRecordsABI';
import { formatAddress } from '../utils/web3';
import { ENSName } from './ENSName';

const PatientProfile = () => {
  const { address } = useAccount();

  const { data: profile } = useContractRead({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: PatientRecordsABI,
    functionName: 'getPatientProfile',
    args: [address],
    enabled: !!address,
    watch: true
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Your Profile</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-2 dark:text-white">Basic Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Wallet Address</p>
              <p className="dark:text-white">
                <ENSName address={address} />
              </p>
            </div>
            {profile && (
              <>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="dark:text-white">
                    {profile.name || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                  <p className="dark:text-white">
                    {profile.dob || 'Not specified'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2 dark:text-white">Medical Summary</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Blood Type</p>
              <p className="dark:text-white">
                {profile?.bloodType || 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Allergies</p>
              <p className="dark:text-white">
                {profile?.allergies || 'None recorded'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Chronic Conditions</p>
              <p className="dark:text-white">
                {profile?.conditions || 'None recorded'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;