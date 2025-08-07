import { ethers } from 'ethers';
import { PatientRecordsABI } from '../contracts/PatientRecordsABI';
import { HospitalRegistryABI } from '../contracts/HospitalRegistryABI';
import { EmergencyAccessABI } from '../contracts/EmergencyAccessABI';

let provider;
let signer;
let patientRecords;
let hospitalRegistry;
let emergencyAccess;

export const initContracts = async () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    
    patientRecords = new ethers.Contract(
      import.meta.env.VITE_CONTRACT_ADDRESS,
      PatientRecordsABI,
      signer
    );
    
    hospitalRegistry = new ethers.Contract(
      import.meta.env.VITE_HOSPITAL_REGISTRY_ADDRESS,
      HospitalRegistryABI,
      signer
    );
    
    emergencyAccess = new ethers.Contract(
      import.meta.env.VITE_EMERGENCY_ACCESS_ADDRESS,
      EmergencyAccessABI,
      signer
    );
    
    return { patientRecords, hospitalRegistry, emergencyAccess };
  } else {
    throw new Error('Ethereum provider not found');
  }
};

export const getPatientRecords = async (patientAddress) => {
  return await patientRecords.getRecords(patientAddress);
};

export const grantAccess = async (patientAddress, grantee, recordId, duration, purpose) => {
  const tx = await patientRecords.grantAccess(
    grantee,
    recordId,
    duration,
    purpose
  );
  return await tx.wait();
};

export const requestEmergencyAccess = async (patientAddress, duration, reason) => {
  const tx = await emergencyAccess.requestEmergencyAccess(
    patientAddress,
    duration,
    reason,
    '0x' // Placeholder for medical authorization
  );
  return await tx.wait();
};

export const registerHospital = async (name, physicalAddress, accreditationId, publicKey) => {
  const tx = await hospitalRegistry.registerHospital(
    await signer.getAddress(),
    name,
    physicalAddress,
    accreditationId,
    publicKey
  );
  return await tx.wait();
};

export const submitTreatmentRecord = async (patientAddress, recordId, diagnosis, prescription, notes) => {
  const tx = await patientRecords.submitTreatmentRecord(
    patientAddress,
    recordId,
    diagnosis,
    prescription,
    notes
  );
  return await tx.wait();
};