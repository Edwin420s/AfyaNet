import { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { HospitalRegistryABI } from '../contracts/HospitalRegistryABI';
import { formatAddress } from '../utils/web3';

const HospitalProfile = () => {
  const { address } = useAccount();
  const [hospitalInfo, setHospitalInfo] = useState({
    name: '',
    physicalAddress: '',
    accreditationId: '',
    publicKey: ''
  });

  const { data: hospitalData } = useContractRead({
    address: import.meta.env.VITE_HOSPITAL_REGISTRY_ADDRESS,
    abi: HospitalRegistryABI,
    functionName: 'hospitals',
    args: [address],
    enabled: !!address,
    watch: true
  });

  const { write: updateHospital } = useContractWrite({
    address: import.meta.env.VITE_HOSPITAL_REGISTRY_ADDRESS,
    abi: HospitalRegistryABI,
    functionName: 'updateHospitalInfo'
  });

  useEffect(() => {
    if (hospitalData) {
      setHospitalInfo({
        name: hospitalData.name,
        physicalAddress: hospitalData.physicalAddress,
        accreditationId: hospitalData.accreditationId,
        publicKey: hospitalData.publicKey
      });
    }
  }, [hospitalData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateHospital({
      args: [
        address,
        'name',
        hospitalInfo.name
      ]
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Hospital Profile</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-2 dark:text-white">Hospital Information</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hospital Name
              </label>
              <input
                type="text"
                value={hospitalInfo.name}
                onChange={(e) => setHospitalInfo({...hospitalInfo, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Physical Address
              </label>
              <input
                type="text"
                value={hospitalInfo.physicalAddress}
                onChange={(e) => setHospitalInfo({...hospitalInfo, physicalAddress: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Accreditation ID
              </label>
              <input
                type="text"
                value={hospitalInfo.accreditationId}
                readOnly
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Public Key
              </label>
              <textarea
                value={hospitalInfo.publicKey}
                onChange={(e) => setHospitalInfo({...hospitalInfo, publicKey: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Update Profile
            </button>
          </form>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2 dark:text-white">Hospital Details</h3>
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Wallet Address</p>
                <p className="font-mono dark:text-white">{formatAddress(address)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Registration Status</p>
                <p className="dark:text-white">
                  {hospitalData?.isActive ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-red-600">Inactive</span>
                  )}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Accreditation ID</p>
                <p className="dark:text-white">{hospitalInfo.accreditationId}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Physical Address</p>
                <p className="dark:text-white">{hospitalInfo.physicalAddress}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalProfile;