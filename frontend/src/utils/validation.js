import { ethers } from 'ethers';

export const validateAddress = (address) => {
  try {
    ethers.utils.getAddress(address);
    return true;
  } catch {
    return false;
  }
};

export const validateCID = (cid) => {
  // Basic IPFS CID validation (v0 or v1)
  return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(cid) || 
         /^bafy[1-9A-HJ-NP-Za-km-z]{39}$/.test(cid);
};

export const validateMedicalRecord = (record) => {
  if (!record || typeof record !== 'object') return false;
  
  const requiredFields = ['ipfsCID', 'recordType', 'timestamp'];
  return requiredFields.every(field => record[field] !== undefined);
};