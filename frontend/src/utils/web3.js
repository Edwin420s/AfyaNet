import { ethers } from 'ethers';
import { PatientRecordsABI } from '../contracts/PatientRecordsABI';

export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error('No Ethereum provider found');
  }
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  
  // Initialize contract
  const contract = new ethers.Contract(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    PatientRecordsABI,
    signer
  );
  
  return { provider, signer, address, contract };
};

export const formatAddress = (address) => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const getBlockchainTimestamp = async (provider) => {
  const block = await provider.getBlock('latest');
  return block.timestamp;
};