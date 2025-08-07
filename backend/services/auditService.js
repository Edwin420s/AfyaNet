import { createClient } from 'redis';
import { ethers } from 'ethers';
import { PatientRecordsABI } from '../../frontend/src/contracts/PatientRecordsABI';

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

export const logAccessEvent = async (event) => {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = {
      ...event,
      timestamp,
      logId: ethers.utils.id(`${event.patient}-${timestamp}`)
    };

    // Store in Redis sorted set by timestamp
    await redisClient.zAdd(
      `audit:${event.patient}`,
      { score: new Date(timestamp).getTime(), value: JSON.stringify(logEntry) }
    );

    // Keep only last 1000 entries per patient
    await redisClient.zRemRangeByRank(
      `audit:${event.patient}`,
      0,
      -1001
    );

    console.log(`Audit logged for ${event.patient}`);
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
};

export const getAuditLogs = async (patientAddress, limit = 100) => {
  try {
    const logs = await redisClient.zRange(
      `audit:${patientAddress}`,
      -limit,
      -1,
      { REV: true }
    );

    return logs.map(log => JSON.parse(log));
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return [];
  }
};

export const setupAuditEventListener = () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    PatientRecordsABI,
    provider
  );

  contract.on('RecordAccessed', async (patient, accessor, recordId, timestamp) => {
    await logAccessEvent({
      type: 'RECORD_ACCESS',
      patient,
      accessor,
      recordId: recordId.toString(),
      timestamp: new Date(timestamp * 1000).toISOString()
    });
  });

  console.log('Audit event listener initialized');
};