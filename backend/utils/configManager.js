import { createClient } from 'redis';
import { encryptData, decryptData } from './encryption';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

const CONFIG_KEY_PREFIX = 'config:';
const ENCRYPTION_KEY = process.env.CONFIG_ENCRYPTION_KEY;

export const getConfig = async (key, defaultValue = null) => {
  try {
    const encryptedValue = await redisClient.get(`${CONFIG_KEY_PREFIX}${key}`);
    if (!encryptedValue) return defaultValue;
    
    const decrypted = await decryptData(encryptedValue, ENCRYPTION_KEY);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error(`Failed to get config ${key}:`, error);
    return defaultValue;
  }
};

export const setConfig = async (key, value) => {
  try {
    const encrypted = await encryptData(JSON.stringify(value), ENCRYPTION_KEY);
    await redisClient.set(`${CONFIG_KEY_PREFIX}${key}`, encrypted);
    return true;
  } catch (error) {
    console.error(`Failed to set config ${key}:`, error);
    return false;
  }
};

export const getSystemConfig = async () => {
  const configKeys = [
    'ipfs_gateway',
    'default_record_expiry',
    'emergency_access_duration',
    'max_file_size'
  ];
  
  const config = {};
  for (const key of configKeys) {
    config[key] = await getConfig(key);
  }
  
  return config;
};

export const initializeDefaultConfig = async () => {
  const defaults = {
    'ipfs_gateway': 'https://ipfs.io/ipfs/',
    'default_record_expiry': 2592000, // 30 days
    'emergency_access_duration': 86400, // 24 hours
    'max_file_size': 10485760 // 10MB
  };
  
  for (const [key, value] of Object.entries(defaults)) {
    const existing = await getConfig(key);
    if (existing === null) {
      await setConfig(key, value);
    }
  }
  
  console.log('Default configuration initialized');
};