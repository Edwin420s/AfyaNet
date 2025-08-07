import { ethers } from 'ethers';
import { PatientRecordsABI } from '../../frontend/src/contracts/PatientRecordsABI';
import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

const CONTRACT_STATUS_KEY = 'contract:status';

export const monitorContractHealth = async () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    PatientRecordsABI,
    provider
  );

  const checkHealth = async () => {
    try {
      // Check basic contract functionality
      const owner = await contract.owner();
      const hospitalCount = (await contract.getRegisteredHospitals()).length;
      
      // Check recent block events
      const currentBlock = await provider.getBlockNumber();
      const events = await contract.queryFilter('RecordAdded', currentBlock - 100, currentBlock);

      const status = {
        timestamp: new Date().toISOString(),
        owner,
        hospitalCount,
        recentRecords: events.length,
        lastBlock: currentBlock,
        status: 'healthy'
      };

      await redisClient.set(CONTRACT_STATUS_KEY, JSON.stringify(status));
      console.log('Contract health check passed');
    } catch (error) {
      console.error('Contract health check failed:', error);
      await redisClient.set(CONTRACT_STATUS_KEY, JSON.stringify({
        timestamp: new Date().toISOString(),
        status: 'unhealthy',
        error: error.message
      }));
    }
  };

  // Run immediately and then every 5 minutes
  await checkHealth();
  setInterval(checkHealth, 300000);
};

export const getContractStatus = async () => {
  const status = await redisClient.get(CONTRACT_STATUS_KEY);
  return status ? JSON.parse(status) : null;
};