import { Web3Storage } from 'web3.storage';
import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

const web3Storage = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN });

export const storeRecord = async (fileBuffer, fileName) => {
  try {
    const file = new File([fileBuffer], fileName);
    const cid = await web3Storage.put([file], { name: fileName });
    
    // Cache metadata
    await redisClient.setEx(
      `metadata:${cid}`,
      86400,
      JSON.stringify({
        name: fileName,
        uploadedAt: new Date().toISOString(),
        size: fileBuffer.length
      })
    );
    
    return cid;
  } catch (error) {
    console.error('IPFS storage error:', error);
    throw new Error('Failed to store record on IPFS');
  }
};

export const retrieveRecord = async (cid) => {
  try {
    // Check cache first
    const cached = await redisClient.get(`record:${cid}`);
    if (cached) return JSON.parse(cached);
    
    // Fetch from IPFS
    const res = await web3Storage.get(cid);
    if (!res.ok) throw new Error(`IPFS record not found: ${cid}`);
    
    const files = await res.files();
    const fileData = await files[0].text();
    
    // Cache for 24 hours
    await redisClient.setEx(
      `record:${cid}`,
      86400,
      JSON.stringify({ data: fileData })
    );
    
    return { data: fileData };
  } catch (error) {
    console.error('IPFS retrieval error:', error);
    throw new Error('Failed to retrieve record from IPFS');
  }
};

export const getRecordMetadata = async (cid) => {
  const metadata = await redisClient.get(`metadata:${cid}`);
  return metadata ? JSON.parse(metadata) : null;
};