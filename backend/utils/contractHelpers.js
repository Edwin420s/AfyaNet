import { ethers } from 'ethers';
import PatientRecordsABI from '../../frontend/src/contracts/PatientRecordsABI.js';

export const getContract = () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
  return new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    PatientRecordsABI,
    wallet
  );
};

export const verifyHospitalSignature = async (address, signature, message) => {
  try {
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
};

export const isHospitalRegistered = async (address) => {
  const contract = getContract();
  return await contract.registeredHospitals(address);
};