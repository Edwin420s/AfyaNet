import { ethers } from 'ethers';
import { PatientRecordsABI, EmergencyAccessABI } from '../../frontend/src/contracts';
import { sendNotification } from './notificationService';
import { logAccessEvent } from './auditService';

const eventProcessors = {
  RecordAdded: async (event, provider) => {
    const { patient, recordId, ipfsCID } = event.args;
    await sendNotification({
      type: 'RECORD_ADDED',
      patient,
      recordId: recordId.toString(),
      ipfsCID
    });
  },
  AccessGranted: async (event) => {
    const { patient, grantee, recordId, purpose } = event.args;
    await sendNotification({
      type: 'ACCESS_GRANTED',
      patient,
      grantee,
      recordId: recordId.toString(),
      purpose
    });
  },
  RecordAccessed: async (event) => {
    const { patient, accessor, recordId, timestamp } = event.args;
    await logAccessEvent({
      type: 'RECORD_ACCESS',
      patient,
      accessor,
      recordId: recordId.toString(),
      timestamp: new Date(timestamp * 1000).toISOString()
    });
  },
  EmergencyAccessRequested: async (event) => {
    const { patient, requester } = event.args;
    await sendNotification({
      type: 'EMERGENCY_REQUEST',
      patient,
      requester,
      urgent: true
    });
  }
};

export const setupEventListeners = async () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  
  // Patient Records contract
  const patientRecords = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    PatientRecordsABI,
    provider
  );

  // Emergency Access contract
  const emergencyAccess = new ethers.Contract(
    process.env.EMERGENCY_ACCESS_ADDRESS,
    EmergencyAccessABI,
    provider
  );

  // Setup listeners for all events
  for (const [eventName, processor] of Object.entries(eventProcessors)) {
    const contract = eventName.startsWith('Emergency') ? emergencyAccess : patientRecords;
    contract.on(eventName, (event) => processor(event, provider));
  }

  console.log('Event listeners initialized for all contracts');
};

export const getPastEvents = async (eventName, fromBlock = 0) => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    PatientRecordsABI,
    provider
  );

  const filter = contract.filters[eventName]();
  return await contract.queryFilter(filter, fromBlock);
};