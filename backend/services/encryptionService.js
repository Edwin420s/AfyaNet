import crypto from 'crypto';
import { promisify } from 'util';
import { storeRecord } from './ipfsService';

const scrypt = promisify(crypto.scrypt);
const randomBytes = promisify(crypto.randomBytes);

export const generateKeyFromSignature = async (signature, salt) => {
  const key = await scrypt(signature, salt, 32);
  return key.toString('hex');
};

export const encryptAndStoreRecord = async (fileBuffer, fileName, encryptionKey) => {
  try {
    // Generate random initialization vector
    const iv = await randomBytes(16);
    
    // Create cipher
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(encryptionKey, 'hex'),
      iv
    );
    
    // Encrypt data
    let encrypted = cipher.update(fileBuffer);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    // Store encrypted data on IPFS
    const cid = await storeRecord(encrypted, fileName);
    
    return {
      cid,
      iv: iv.toString('hex'),
      encrypted: true
    };
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt and store record');
  }
};

export const decryptRecordData = async (encryptedData, encryptionKey, iv) => {
  try {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(encryptionKey, 'hex'),
      Buffer.from(iv, 'hex')
    );
    
    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt record');
  }
};