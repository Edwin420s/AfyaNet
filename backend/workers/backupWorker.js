import { ethers } from 'ethers';
import { createClient } from 'redis';
import { PatientRecordsABI } from '../../frontend/src/contracts/PatientRecordsABI';
import { Web3Storage } from 'web3.storage';

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

const backupClient = new Web3Storage({ token: process.env.BACKUP_WEB3_STORAGE_TOKEN });

export const runBackup = async () => {
  console.log('Starting blockchain backup...');
  
  try {
    // Initialize provider and contract
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      PatientRecordsABI,
      provider
    );
    
    // Get all record events
    const filter = contract.filters.RecordAdded();
    const events = await contract.queryFilter(filter);
    
    // Process events and backup metadata
    const backupData = events.map(event => ({
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      patient: event.args.patient,
      recordId: event.args.recordId.toString(),
      ipfsCID: event.args.ipfsCID,
      timestamp: new Date(event.args.timestamp * 1000).toISOString()
    }));
    
    // Store backup on IPFS
    const backupFile = new File(
      [JSON.stringify(backupData, null, 2)],
      `afyanet-backup-${new Date().toISOString()}.json`,
      { type: 'application/json' }
    );
    
    const cid = await backupClient.put([backupFile]);
    console.log(`Backup completed: ${cid}`);
    
    // Store backup reference in Redis
    await redisClient.lPush('backups', cid);
    await redisClient.lTrim('backups', 0, 9); // Keep only last 10 backups
    
    return cid;
  } catch (error) {
    console.error('Backup failed:', error);
    throw error;
  }
};

// Run backup daily at 2 AM
const scheduleBackup = () => {
  const now = new Date();
  const nextRun = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    2, 0, 0
  );
  
  const delay = nextRun - now;
  
  setTimeout(async () => {
    await runBackup();
    scheduleBackup(); // Reschedule for next day
  }, delay);
};

// Start backup scheduler
scheduleBackup();
console.log('Backup scheduler started');