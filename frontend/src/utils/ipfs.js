import { Web3Storage } from 'web3.storage';
import CryptoJS from 'crypto-js';

const client = new Web3Storage({ token: import.meta.env.VITE_WEB3_STORAGE_TOKEN });

export const encryptFile = async (file, secretKey) => {
  const fileData = await file.text();
  return CryptoJS.AES.encrypt(fileData, secretKey).toString();
};

export const decryptFile = (encryptedData, secretKey) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const storeOnIPFS = async (data, fileName) => {
  try {
    const file = new File([data], fileName);
    const cid = await client.put([file], { name: fileName });
    return cid;
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw error;
  }
};

export const retrieveFromIPFS = async (cid) => {
  try {
    const res = await client.get(cid);
    if (!res.ok) throw new Error(`Failed to get file with CID ${cid}`);
    const files = await res.files();
    return await files[0].text();
  } catch (error) {
    console.error('IPFS retrieval error:', error);
    throw error;
  }
};